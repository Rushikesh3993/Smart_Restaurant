import { MenuItem } from "@/types/restaurantType";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter } from "./ui/card";
import { useCartStore } from "@/store/useCartStore";
import { useNavigate } from "react-router-dom";

const AvailableMenu = ({ menus }: { menus: MenuItem[] }) => {
  const { addToCart } = useCartStore();
  const navigate = useNavigate();

  return (
    <div className="md:p-4">
      <h1 className="text-xl md:text-2xl font-extrabold mb-6 text-gray-800 dark:text-white">
        Available Menus
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menus.map((menu: MenuItem) => (
          <Card
            key={menu.id || menu.name}
            className="max-w-xs mx-auto shadow-lg rounded-lg overflow-hidden flex flex-col bg-white dark:bg-gray-800"
          >
            <img
              src={menu.image}
              alt={`Image of ${menu.name}`}
              className="w-full h-40 object-cover"
            />
            <CardContent className="flex-1 p-4 flex flex-col">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {menu.name}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                {menu.description}
              </p>

              {/* Price anchored to bottom of content */}
              <div className="mt-auto pt-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Price: <span className="text-[#D19254]">₹{menu.price}</span>
                </h3>
              </div>
            </CardContent>
            <CardFooter className="p-4">
              <Button
                onClick={() => {
                  addToCart(menu);
                  navigate("/cart");
                }}
                className="w-full bg-orange hover:bg-hoverOrange dark:bg-orange-500 dark:hover:bg-orange-600"
              >
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AvailableMenu;
