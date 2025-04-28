import {
  Loader2,
  LocateIcon,
  Mail,
  MapPin,
  MapPinnedIcon,
  Plus,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { FormEvent, useRef, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useUserStore } from "../store/useUserStore";
import React from "react";

const Profile = () => {
  const { user, updateProfile } = useUserStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [profileData, setProfileData] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    address: user?.address || "",
    city: user?.city || "",
    country: user?.country || "",
    profilePicture: user?.profilePicture || "",
    admin: user?.admin || false,  // 👈 Add this line
  });
  const imageRef = useRef<HTMLInputElement | null>(null);
  const [selectedProfilePicture, setSelectedProfilePicture] = useState<string>(
    profileData.profilePicture || ""
  );

  const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setSelectedProfilePicture(result);
        setProfileData((prevData) => ({
          ...prevData,
          profilePicture: result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const updateProfileHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await updateProfile(profileData);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={updateProfileHandler} className="max-w-7xl mx-auto my-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="relative md:w-28 md:h-28 w-20 h-20">
            <AvatarImage src={selectedProfilePicture} />
            <AvatarFallback>CN</AvatarFallback>
            <input
              ref={imageRef}
              className="hidden"
              type="file"
              accept="image/*"
              onChange={fileChangeHandler}
            />
            <div
              onClick={() => imageRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/50 dark:bg-white/10 rounded-full cursor-pointer"
            >
              <Plus className="text-white w-8 h-8" />
            </div>
          </Avatar>
          <Input
            type="text"
            name="fullname"
            value={profileData.fullname}
            onChange={changeHandler}
            className="font-bold text-2xl outline-none border-none focus-visible:ring-transparent bg-transparent text-foreground"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-4 md:gap-2 gap-3 my-10">
        {/* Email */}
        <div className="flex items-center gap-4 rounded-sm p-2 bg-muted dark:bg-muted/50">
          <Mail className="text-muted-foreground" />
          <div className="w-full">
            <Label className="text-muted-foreground">Email</Label>
            <input
              disabled
              name="email"
              value={profileData.email}
              onChange={changeHandler}
              className="w-full text-foreground bg-transparent placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"
            />
          </div>
        </div>

        {/* Address */}
        <div className="flex items-center gap-4 rounded-sm p-2 bg-muted dark:bg-muted/50">
          <LocateIcon className="text-muted-foreground" />
          <div className="w-full">
            <Label className="text-muted-foreground">Address</Label>
            <input
              name="address"
              value={profileData.address}
              onChange={changeHandler}
              className="w-full text-foreground bg-transparent placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"
            />
          </div>
        </div>

        {/* City */}
        <div className="flex items-center gap-4 rounded-sm p-2 bg-muted dark:bg-muted/50">
          <MapPin className="text-muted-foreground" />
          <div className="w-full">
            <Label className="text-muted-foreground">City</Label>
            <input
              name="city"
              value={profileData.city}
              onChange={changeHandler}
              className="w-full text-foreground bg-transparent placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"
            />
          </div>
        </div>

        {/* Country */}
        <div className="flex items-center gap-4 rounded-sm p-2 bg-muted dark:bg-muted/50">
          <MapPinnedIcon className="text-muted-foreground" />
          <div className="w-full">
            <Label className="text-muted-foreground">Country</Label>
            <input
              name="country"
              value={profileData.country}
              onChange={changeHandler}
              className="w-full text-foreground bg-transparent placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:border-transparent outline-none border-none"
            />
          </div>
        </div>
      </div>

      <div className="text-center">
        {isLoading ? (
          <Button disabled className="bg-orange hover:bg-hoverOrange">
            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button type="submit" className="bg-orange hover:bg-hoverOrange">
            Update
          </Button>
        )}
      </div>
    </form>
  );
};

export default Profile;
