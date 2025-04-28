import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  RestaurantFormSchema,
  restaurantFromSchema,
} from "@/schema/restaurantSchema";
import { useRestaurantStore } from "@/store/useRestaurantStore";
import { Loader2, Plus, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import RestaurantList from "@/components/RestaurantList";
import { Badge } from "@/components/ui/badge";

const Restaurant = () => {
  const [input, setInput] = useState<RestaurantFormSchema>({
    restaurantName: "",
    city: "",
    country: "",
    deliveryTime: 0,
    cuisines: [],
    imageFile: undefined,
  });
  const [cuisineInput, setCuisineInput] = useState("");
  const [errors, setErrors] = useState<Partial<RestaurantFormSchema>>({});
  const {
    loading,
    restaurant,
    updateRestaurant,
    createRestaurant,
    getRestaurant,
    restaurants,
  } = useRestaurantStore();

  // Fetch restaurant data on component mount
  useEffect(() => {
    getRestaurant();
  }, []);

  // Update form when restaurant data is loaded
  useEffect(() => {
    if (restaurant) {
      setInput({
        restaurantName: restaurant.restaurantName || "",
        city: restaurant.city || "",
        country: restaurant.country || "",
        deliveryTime: restaurant.deliveryTime || 0,
        cuisines: restaurant.cuisines || [],
        imageFile: undefined,
      });
    }
  }, [restaurant]);

  const changeEventHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setInput({ ...input, [name]: type === "number" ? Number(value) : value });
  };

  const addCuisine = () => {
    if (cuisineInput.trim() && !input.cuisines.includes(cuisineInput.trim())) {
      setInput({
        ...input,
        cuisines: [...input.cuisines, cuisineInput.trim()],
      });
      setCuisineInput("");
    }
  };

  const removeCuisine = (cuisine: string) => {
    setInput({
      ...input,
      cuisines: input.cuisines.filter((c) => c !== cuisine),
    });
  };

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = restaurantFromSchema.safeParse(input);
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setErrors(fieldErrors as Partial<RestaurantFormSchema>);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("restaurantName", input.restaurantName);
      formData.append("city", input.city);
      formData.append("country", input.country);
      formData.append("deliveryTime", input.deliveryTime.toString());
      formData.append("cuisines", JSON.stringify(input.cuisines));

      if (input.imageFile) {
        formData.append("imageFile", input.imageFile);
      }

      if (restaurant) {
        await updateRestaurant(formData);
      } else {
        await createRestaurant(formData);
      }
    } catch (error) {
      console.error("Error submitting restaurant:", error);
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
      <div>
        <h1 className="font-extrabold text-2xl mb-5">Restaurant Management</h1>

        <form onSubmit={submitHandler} className="space-y-6">
          <div className="md:grid grid-cols-2 gap-6 space-y-4 md:space-y-0">
            <div>
              <Label>Restaurant Name</Label>
              <Input
                type="text"
                name="restaurantName"
                value={input.restaurantName}
                onChange={changeEventHandler}
                placeholder="Enter your restaurant name"
              />
              {errors.restaurantName && (
                <span className="text-xs text-red-600 font-medium">
                  {errors.restaurantName}
                </span>
              )}
            </div>

            <div>
              <Label>City</Label>
              <Input
                type="text"
                name="city"
                value={input.city}
                onChange={changeEventHandler}
                placeholder="Enter your city name"
              />
              {errors.city && (
                <span className="text-xs text-red-600 font-medium">
                  {errors.city}
                </span>
              )}
            </div>

            <div>
              <Label>Country</Label>
              <Input
                type="text"
                name="country"
                value={input.country}
                onChange={changeEventHandler}
                placeholder="Enter your country name"
              />
              {errors.country && (
                <span className="text-xs text-red-600 font-medium">
                  {errors.country}
                </span>
              )}
            </div>

            <div>
              <Label>Delivery Time (minutes)</Label>
              <Input
                type="number"
                name="deliveryTime"
                value={input.deliveryTime}
                onChange={changeEventHandler}
                placeholder="Enter delivery time in minutes"
              />
              {errors.deliveryTime && (
                <span className="text-xs text-red-600 font-medium">
                  {errors.deliveryTime}
                </span>
              )}
            </div>

            <div>
              <Label>Restaurant Image</Label>
              <Input
                type="file"
                name="imageFile"
                onChange={(e) =>
                  setInput({
                    ...input,
                    imageFile: e.target.files?.[0] || undefined,
                  })
                }
              />
              {errors.imageFile && (
                <span className="text-xs text-red-600 font-medium">
                  {typeof errors.imageFile === 'string' ? errors.imageFile : 'Invalid image file'}
                </span>
              )}
            </div>

            <div className="col-span-2">
              <Label>Cuisines</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  type="text"
                  value={cuisineInput}
                  onChange={(e) => setCuisineInput(e.target.value)}
                  placeholder="Add a cuisine (e.g., Italian, Chinese)"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCuisine();
                    }
                  }}
                />
                <Button type="button" onClick={addCuisine} className="bg-orange hover:bg-hoverOrange">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {input.cuisines.map((cuisine, index) => (
                  <Badge key={index} className="bg-orange hover:bg-hoverOrange">
                    {cuisine}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => removeCuisine(cuisine)}
                    />
                  </Badge>
                ))}
              </div>
              {errors.cuisines && (
                <span className="text-xs text-red-600 font-medium">
                  {errors.cuisines}
                </span>
              )}
            </div>
          </div>

          <div className="my-5">
            {loading ? (
              <Button disabled className="bg-orange hover:bg-hoverOrange">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" className="bg-orange hover:bg-hoverOrange">
                {restaurant ? "Update Restaurant" : "Add Restaurant"}
              </Button>
            )}
          </div>
        </form>

        {restaurants.length > 0 && (
          <div className="my-10">
            <h2 className="font-extrabold text-xl mb-5">Your Restaurants</h2>
            <RestaurantList restaurants={restaurants} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Restaurant;
