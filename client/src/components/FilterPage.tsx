import { useRestaurantStore } from "@/store/useRestaurantStore";  // Import the Zustand store
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { useEffect } from "react";

// Filter options (example of cuisines)
const filterOptions = [
  { id: "biryani", label: "Biryani" },
  { id: "thali", label: "Thali" },
  { id: "burger", label: "Burger" },
  { id: "momos", label: "Momos" },
];

const FilterPage = () => {
  const { appliedFilter, setAppliedFilter, resetAppliedFilter, menuItems } = useRestaurantStore();  // Access menuItems here

  // Update filter selection when checkbox is clicked
  const appliedFilterHandler = (value: string) => {
    const newFilter = appliedFilter.includes(value)
      ? appliedFilter.filter((filter) => filter !== value)
      : [...appliedFilter, value];
    setAppliedFilter(newFilter);
  };

  // Log applied filters for debugging
  useEffect(() => {
    console.log("Applied Filters:", appliedFilter);
  }, [appliedFilter]);

  return (
    <div className="md:w-72">
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-lg">Filter by Cuisines</h1>
        <Button variant={"link"} onClick={resetAppliedFilter}>Reset</Button>
      </div>

      {/* Render filter options (checkboxes for each filter) */}
      {filterOptions.map((option) => (
        <div key={option.id} className="flex items-center space-x-2 my-5">
          <Checkbox
            id={option.id}
            checked={appliedFilter.includes(option.id)}
            onCheckedChange={() => appliedFilterHandler(option.id)}  // Toggle the filter
          />
          <Label htmlFor={option.id} className="text-sm font-medium">
            {option.label}
          </Label>
        </div>
      ))}

      {/* Display filtered menu items based on applied filters */}
      <div>
        <h2>Filtered Menu</h2>
        <ul>
          {menuItems
            .filter((item: any) => appliedFilter.length === 0 || appliedFilter.includes(item.cuisine))  // Apply filters
            .map((item: any, idx: number) => (
              <li key={idx}>{item.name}</li>  // Display item names
            ))}
        </ul>
      </div>
    </div>
  );
};

export default FilterPage;


