import { IndianRupee } from "lucide-react";
import { Separator } from "./ui/separator";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useOrderStore } from "@/store/useOrderStore";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";

type SimplifiedCartItem = {
  menuId: string;
  name: string;
  image: string;
  price: string;
  quantity: string;
};

const Success = () => {
  const { orders, getOrderDetails } = useOrderStore();
  const [isMounted, setIsMounted] = useState(false);
  const [width, height] = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(true); // 👈

  useEffect(() => {
    getOrderDetails();
    setIsMounted(true);

    // Automatically stop confetti after 3 seconds
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => clearTimeout(confettiTimer); // cleanup
  }, []);

  if (orders.length === 0)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="font-bold text-2xl text-gray-700 dark:text-gray-300">
          Order not found!
        </h1>
      </div>
    );

  const latestOrder = orders[orders.length - 1];

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4 overflow-hidden">
      {/* Confetti 🎉 */}
      {showConfetti && <Confetti width={width} height={height} numberOfPieces={300} recycle={false} />}

      <div
        className={`bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 max-w-lg w-full transform transition-all duration-700 ${
          isMounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-5 scale-95"
        }`}
      >
        {/* Thank you Message */}
        <div className="text-center mb-8">
          <h1
            className={`text-3xl font-extrabold text-orange-500 transition-all duration-700 ${
              isMounted ? "opacity-100 scale-110" : "opacity-0 scale-95"
            }`}
          >
            🎉 Thank You for Your Order! 🎉
          </h1>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Order Status:{" "}
            <span className="text-[#FF5A5A]">{latestOrder.status.toUpperCase()}</span>
          </h2>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Order Summary
          </h2>
          {latestOrder.cartItems.map((item: SimplifiedCartItem, index: number) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-md object-cover"
                  />
                  <h3 className="ml-4 text-gray-800 dark:text-gray-200 font-medium">
                    {item.name}{" "}
                    <span className="text-sm text-gray-500 ml-2">x{item.quantity}</span>
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-gray-800 dark:text-gray-200 flex items-center">
                    <IndianRupee />
                    <span className="text-lg font-medium">{item.price}</span>
                  </div>
                </div>
              </div>
              <Separator className="my-4" />
            </div>
          ))}
        </div>

        <Link to="/cart">
          <Button className="bg-orange hover:bg-hoverOrange w-full py-3 rounded-md shadow-lg">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Success;
