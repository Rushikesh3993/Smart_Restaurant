import { Minus, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useState } from "react";
import CheckoutConfirmPage from "./CheckoutConfirmPage";
import { useCartStore } from "@/store/useCartStore";
import { CartItem } from "@/types/cartType";

const Cart = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { cart, decrementQuantity, incrementQuantity, removeFromTheCart, clearCart } = useCartStore();

  let totalAmount = cart.reduce((acc, ele) => {
    return acc + ele.price * ele.quantity;
  }, 0);

  return (
    <div className="flex flex-col max-w-7xl mx-auto my-10">
      {/* Clear All button functionality */}
      <div className="flex justify-end">
        <Button variant="link" onClick={clearCart}>Clear All</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Items</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="text-right">Remove</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cart.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-lg">
                Your cart is empty.
              </TableCell>
            </TableRow>
          ) : (
            cart.map((item: CartItem) => (
              <TableRow key={item._id}>
                <TableCell>
                  <Avatar>
                    <AvatarImage src={item.image} alt="" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>
                  <div className="w-fit flex items-center rounded-full border border-gray-100 dark:border-gray-800 shadow-md">
                    <Button
                      onClick={() => decrementQuantity(item._id)}
                      size={"icon"}
                      variant={"outline"}
                      className="rounded-full bg-gray-200 dark:bg-gray-700 dark:text-white text-black"
                    >
                      <Minus className="dark:text-white" />
                    </Button>
                    <div className="font-bold border-none px-3 py-1">{item.quantity}</div>
                    <Button
                      onClick={() => incrementQuantity(item._id)}
                      size={"icon"}
                      className="rounded-full bg-orange hover:bg-hoverOrange dark:bg-orange-600 dark:hover:bg-hoverOrange-600"
                      variant={"outline"}
                    >
                      <Plus />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>{item.price * item.quantity}</TableCell>
                <TableCell className="text-right">
                  <Button
                    size={"sm"}
                    className="bg-orange hover:bg-hoverOrange dark:bg-orange-500 dark:hover:bg-hoverOrange-500"
                    onClick={() => removeFromTheCart(item._id)}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>

        {cart.length > 0 && (
          <TableFooter>
            <TableRow className="text-2xl font-bold">
              <TableCell colSpan={5}>Total</TableCell>
              <TableCell className="text-right">{totalAmount}</TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>

      {cart.length > 0 && (
        <div className="flex justify-end my-5">
          <Button
            onClick={() => setOpen(true)}
            className="bg-orange hover:bg-hoverOrange dark:bg-orange-500 dark:hover:bg-hoverOrange-500"
          >
            Proceed To Checkout
          </Button>
        </div>
      )}
      <CheckoutConfirmPage open={open} setOpen={setOpen} />
    </div>
  );
};

export default Cart;
