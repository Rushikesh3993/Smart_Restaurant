import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus } from "lucide-react";
import React, { FormEvent, useEffect, useState } from "react";
import EditMenu from "./EditMenu";
import { MenuFormSchema, menuSchema } from "@/schema/menuSchema";
import { useMenuStore } from "@/store/useMenuStore";
import { useRestaurantStore } from "@/store/useRestaurantStore";

const AddMenu = () => {
  const [input, setInput] = useState<MenuFormSchema>({
    name: "",
    description: "",
    price: 0,
    image: undefined,
  });
  const [open, setOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [selectedMenu, setSelectedMenu] = useState<any>();
  const [error, setError] = useState<Partial<MenuFormSchema>>({});
  const { loading, createMenu } = useMenuStore();
  const { restaurant, getRestaurant } = useRestaurantStore();

  // Fetch restaurant data on component mount
  useEffect(() => {
    getRestaurant();
  }, []);

  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setInput({ ...input, [name]: type === "number" ? Number(value) : value });
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = menuSchema.safeParse(input);
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setError(fieldErrors as Partial<MenuFormSchema>);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", input.name);
      formData.append("description", input.description);
      formData.append("price", input.price.toString());
      if (input.image) {
        formData.append("image", input.image);
      }

      await createMenu(formData);
      setOpen(false);
      setInput({
        name: "",
        description: "",
        price: 0,
        image: undefined,
      });
    } catch (error) {
      console.error("Error creating menu:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto my-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-bold md:font-extrabold text-lg md:text-2xl">
          Menu Management
        </h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange hover:bg-hoverOrange">
              <Plus className="mr-2" />
              Add Menu Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add A New Menu Item</DialogTitle>
              <DialogDescription>
                Create a menu item that will make your restaurant stand out.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={submitHandler} className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  type="text"
                  name="name"
                  value={input.name}
                  onChange={changeEventHandler}
                  placeholder="Enter menu item name"
                />
                {error.name && (
                  <span className="text-xs font-medium text-red-600">
                    {error.name}
                  </span>
                )}
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  type="text"
                  name="description"
                  value={input.description}
                  onChange={changeEventHandler}
                  placeholder="Enter menu item description"
                />
                {error.description && (
                  <span className="text-xs font-medium text-red-600">
                    {error.description}
                  </span>
                )}
              </div>
              <div>
                <Label>Price (₹)</Label>
                <Input
                  type="number"
                  name="price"
                  value={input.price}
                  onChange={changeEventHandler}
                  placeholder="Enter menu item price"
                />
                {error.price && (
                  <span className="text-xs font-medium text-red-600">
                    {error.price}
                  </span>
                )}
              </div>
              <div>
                <Label>Menu Item Image</Label>
                <Input
                  type="file"
                  name="image"
                  onChange={(e) =>
                    setInput({
                      ...input,
                      image: e.target.files?.[0] || undefined,
                    })
                  }
                />
                {error.image && (
                  <span className="text-xs font-medium text-red-600">
                    {typeof error.image === 'string' ? error.image : 'Invalid image file'}
                  </span>
                )}
              </div>
              <DialogFooter className="mt-5">
                {loading ? (
                  <Button disabled className="bg-orange hover:bg-hoverOrange">
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Please wait
                  </Button>
                ) : (
                  <Button type="submit" className="bg-orange hover:bg-hoverOrange">
                    Add Menu Item
                  </Button>
                )}
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {restaurant?.menus && restaurant.menus.length > 0 ? (
        <div className="space-y-4">
          {restaurant.menus.map((menu: any, idx: number) => (
            <div key={idx} className="flex flex-col md:flex-row md:items-center md:space-x-4 p-4 shadow-md rounded-lg border">
              <img
                src={menu.image}
                alt={menu.name}
                className="w-full md:w-24 md:h-24 h-32 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h1 className="text-lg font-semibold text-gray-800">{menu.name}</h1>
                <p className="text-sm text-gray-600 mt-1">{menu.description}</p>
                <h2 className="text-md font-semibold mt-2">
                  Price: <span className="text-[#D19254]">₹{menu.price}</span>
                </h2>
              </div>
              <Button
                onClick={() => {
                  setSelectedMenu(menu);
                  setEditOpen(true);
                }}
                size={"sm"}
                className="bg-orange hover:bg-hoverOrange mt-2"
              >
                Edit
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No menu items added yet. Click the "Add Menu Item" button to get started.
        </div>
      )}

      <EditMenu
        selectedMenu={selectedMenu}
        editOpen={editOpen}
        setEditOpen={setEditOpen}
      />
    </div>
  );
};

export default AddMenu;