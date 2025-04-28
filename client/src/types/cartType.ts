import { MenuItem } from "./restaurantType";

export interface CartItem extends MenuItem { 
    quantity: number;
    restaurantId: string; // ✅ Add this
}

export type CartState = {
    cart: CartItem[];
    restaurantId: string | null; // ✅ Track the current cart's restaurant
    addToCart: (item: MenuItem & { restaurantId: string }) => void;
    clearCart: () => void;
    removeFromTheCart: (id: string) => void;
    incrementQuantity: (id: string) => void;
    decrementQuantity: (id: string) => void;
}
