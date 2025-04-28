// restaurantType.ts

import { Key } from "react";
import { Orders } from "./orderType"; // ✅ Make sure this path is correct

export type MenuItem = {
    id: Key | null | undefined;
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    restaurantId: string; // ✅ Add this line
};

export type RestaurantUser = {
    _id: string;
    fullname: string;
    email: string;
    contact: number;
    role: string;
    isVerified: boolean;
};

export type Restaurant = {
    _id: string;
    user: RestaurantUser;
    restaurantName: string;
    city: string;
    country: string;
    deliveryTime: number;
    cuisines: string[];
    menus: MenuItem[];
    imageUrl: string;
};

export type SearchedRestaurant = {
    data: Restaurant[];
};

export type RestaurantState = {
    loading: boolean;
    restaurant: Restaurant | null;
    restaurants: Restaurant[]; // ✅ Make sure this is declared
    searchedRestaurant: SearchedRestaurant | null;
    appliedFilter: string[];
    singleRestaurant: Restaurant | null;
    restaurantOrder: Orders[];
    menuItems: MenuItem[];
    createRestaurant: (formData: FormData) => Promise<void>;
    getRestaurant: () => Promise<void>;
    updateRestaurant: (formData: FormData) => Promise<void>;
    searchRestaurant: (searchText: string, searchQuery: string, selectedCuisines: string[]) => Promise<void>;
    addMenuToRestaurant: (menu: MenuItem) => void;
    updateMenuToRestaurant: (menu: MenuItem) => void;
    setAppliedFilter: (value: string[]) => void;
    resetAppliedFilter: () => void;
    getSingleRestaurant: (restaurantId: string) => Promise<void>;
    getRestaurantOrders: () => Promise<void>;
    updateRestaurantOrder: (orderId: string, status: string) => Promise<void>;
};
