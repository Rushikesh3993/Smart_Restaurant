import React from "react";
import { Restaurant as RestaurantType } from "@/types/restaurantType";

interface RestaurantListProps {
  restaurants: RestaurantType[];
}

const RestaurantList: React.FC<RestaurantListProps> = ({ restaurants }) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Restaurant List</h2>
      {restaurants.length === 0 ? (
        <p className="text-gray-600">No restaurants found.</p>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left">Restaurant Name</th>
              <th className="border p-2 text-left">City</th>
              <th className="border p-2 text-left">Country</th>
              <th className="border p-2 text-left">Delivery Time</th>
              <th className="border p-2 text-left">Cuisines</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((restaurant) => (
              <tr key={restaurant._id}>
                <td className="border p-2">{restaurant.restaurantName}</td>
                <td className="border p-2">{restaurant.city}</td>
                <td className="border p-2">{restaurant.country}</td>
                <td className="border p-2">{restaurant.deliveryTime} mins</td>
                <td className="border p-2">
                  {restaurant.cuisines.join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RestaurantList;
