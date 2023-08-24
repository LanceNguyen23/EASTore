"use client";

import { ChevronDown, LogOut, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "./ui/dropdown-menu";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const MainNav = () => {
  const { data: session } = useSession();
  return (
    <div className="h-20 bg-black flex items-center justify-between">
      <Image src="/assets/images/logo.png" width={200} height={10} alt="Logo" />
      <div className=""></div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="mx-[40px] flex flex-row items-center gap-2 cursor-pointer">
            <Avatar className="h-8 w-8">
              <AvatarImage src={session?.user.image!} />
              <AvatarFallback className="font-semibold">
                {session?.user.name?.substring(0, 1)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-white">
              <p className="text-sm">{session?.user.name}</p>
              <p className="text-[10px]">{session?.user.email}</p>
            </div>
            <ChevronDown color="white" size={15} />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-44 p-2">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup className="flex flex-col">
            <DropdownMenuItem className="flex items-center rounded-sm cursor-pointer p-2 focus-visible:outline-[#dddaff] hover:bg-[#f4f4f5]">
              <User className="h-4 w-4 float-left mr-2" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center hover:bg-[#f4f4f5] rounded-sm cursor-pointer p-2 focus-visible:outline-[#dddaff]" onClick={() => signOut()}>
              <LogOut className="h-4 w-4 float-left mr-2" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default MainNav;
