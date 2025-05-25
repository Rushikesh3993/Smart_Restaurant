import { IndianRupee } from "lucide-react";
import { Separator } from "./ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useOrderStore } from "@/store/useOrderStore";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";
import { useLocation } from "react-router-dom";

type SimplifiedCartItem = {
  menuId: string;
  name: string;
  image: string;
  price: number;
  quantity: string;
};

const Success = () => {
  const { currentOrder, getOrderById, loading, error, clearCurrentOrder } = useOrderStore();
  const [isMounted, setIsMounted] = useState(false);
  const [width, height] = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Success component useEffect triggered.");
    const fetchOrderDetails = async () => {
      console.log("fetchOrderDetails started.");
      try {
        const params = new URLSearchParams(location.search);
        const orderId = params.get('orderId') || localStorage.getItem('currentOrderId');
        console.log("URL params:", Object.fromEntries(params.entries()));

        if (!orderId) {
          console.error("No order ID found in URL or localStorage");
          setLocalError("No order ID provided");
          setIsMounted(true);
          return;
        }

        console.log("Fetching order with ID:", orderId);
        await getOrderById(orderId);
        setIsMounted(true);
      } catch (error) {
        console.error("Error fetching order details:", error);
        setLocalError("Failed to fetch order details");
      }
    };

    fetchOrderDetails();

    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => clearTimeout(confettiTimer);
  }, []);

  // Clear the order from localStorage when the order is delivered
  useEffect(() => {
    if (currentOrder?.status === 'delivered') {
      clearCurrentOrder();
    }
  }, [currentOrder?.status]);

  console.log("Success component rendering state:", {
    loading,
    error,
    currentOrder,
    isMounted,
    url: location.search
  });

  if (loading) {
    console.log("Rendering loading state");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error || localError || !currentOrder || typeof currentOrder === 'string') {
    console.log("Rendering error state:", { error, localError, currentOrder, loading });
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="font-bold text-2xl text-gray-700 dark:text-gray-300">
          {error || localError || "Unable to load order details"}
        </h1>
        <div className="flex gap-4">
          <Link to="/cart">
            <Button className="bg-orange hover:bg-hoverOrange py-3 rounded-md shadow-lg">
              Return to Cart
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" className="py-3 rounded-md shadow-lg">
              Go to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!currentOrder.status || !currentOrder.cartItems) {
    console.warn("Invalid order data:", currentOrder);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="font-bold text-2xl text-gray-700 dark:text-gray-300">
          Invalid order data
        </h1>
        <div className="flex gap-4">
          <Link to="/cart">
            <Button className="bg-orange hover:bg-hoverOrange py-3 rounded-md shadow-lg">
              Return to Cart
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" className="py-3 rounded-md shadow-lg">
              Go to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  console.log("Rendering success page with order:", currentOrder);
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4 overflow-hidden">
      {showConfetti && <Confetti width={width} height={height} numberOfPieces={300} recycle={false} />}

      <div
        className={`bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 max-w-lg w-full transform transition-all duration-700 ${
          isMounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-5 scale-95"
        }`}
      >
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
            <span className="text-[#FF5A5A]">{currentOrder.status.toUpperCase()}</span>
          </h2>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Order Summary
          </h2>
          {currentOrder.cartItems.map((item: SimplifiedCartItem, index: number) => (
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
                    <span className="text-lg font-medium">{item.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <Separator className="my-4" />
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <Link to="/cart">
            <Button className="bg-orange hover:bg-hoverOrange w-full py-3 rounded-md shadow-lg">
              Continue Shopping
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" className="w-full py-3 rounded-md shadow-lg">
              Go to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Success;
