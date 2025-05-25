export type CheckoutSessionRequest = {
    cartItems:{
        menuId:string;
        name:string;
        image:string;
        price:number | string;
        quantity:number | string;
    }[];
    deliveryDetails:{
        name:string;
        email:string;
        contact:string;
        address:string;
        city:string;
        country:string
    },
    restaurantId:string;
}
export interface Orders extends CheckoutSessionRequest {
    _id:string;
    status:string;
    totalAmount:number;
}
export type OrderState = {
    loading:boolean;
    orders:Orders[];
    currentOrder: Orders | null;
    error: string | null;
    createCheckoutSession: (checkoutSessionRequest:CheckoutSessionRequest) => Promise<void>;
    getOrderDetails: () => Promise<void>;
    getOrderById: (orderId: string) => Promise<void>;
    clearError: () => void;
}

type SimplifiedCartItem = {
  menuId: string;
  name: string;
  image: string;
  price: number;
  quantity: string;
};