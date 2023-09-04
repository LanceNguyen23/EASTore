"use client";

import { ChevronDown, LayoutDashboard, LogOut, MinusSquare, Package2, Paintbrush2, Ruler, ShoppingCart, Store, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const MainNav = () => {
  const { data: session } = useSession();
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const routes = [
    {
      href: `/${params.storeId}`,
      label: "Dashboard",
      icon: <LayoutDashboard size={17}/>,
      active: pathname === `/${params.storeId}`,
    },
    {
      href: `/${params.storeId}/billboards`,
      label: "Billboards",
      icon: <MinusSquare size={17}/>,
      active: pathname === `/${params.storeId}/billboards`,
    },
    {
      href: `/${params.storeId}/categories`,
      label: "Categories",
      icon: <Store size={17}/>,
      active: pathname === `/${params.storeId}/categories`,
    },
    {
      href: `/${params.storeId}/sizes`,
      label: "Sizes",
      icon: <Ruler size={17}/>,
      active: pathname === `/${params.storeId}/sizes`,
    },
    {
      href: `/${params.storeId}/colors`,
      label: "Colors",
      icon: <Paintbrush2 size={17}/>,
      active: pathname === `/${params.storeId}/colors`,
    },
    {
      href: `/${params.storeId}/products`,
      label: "Products",
      icon: <Package2 size={17}/>,
      active: pathname === `/${params.storeId}/products`,
    },
    {
      href: `/${params.storeId}/orders`,
      label: "Orders",
      icon: <ShoppingCart size={17}/>,
      active: pathname === `/${params.storeId}/orders`,
    },
  ];
  return (
    <div className="h-20 bg-black flex items-center justify-between">
      <Image src="/assets/images/logo.png" width={200} height={10} alt="Logo" onClick={() => router.push(`/${params.storeId}`)} className="cursor-pointer"/>
      <nav className="text-white flex flex-row items-center gap-10">
        {routes.map((route) => (
          <Link key={route.href} href={route.href} className={cn("text-sm font-medium duration-300", route.active ? "bg-[#2c2c2c] py-2 px-4 rounded-2xl" : "")}>
            <div className={cn(route.active ? "mr-2 float-left" : "m-2")}>
              {route.icon}
            </div>
            {route.active ? route.label : null}
          </Link>
        ))}
      </nav>
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
              <User className="h-4 w-4 float-left m-2" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center hover:bg-[#f4f4f5] rounded-sm cursor-pointer p-2 hover:outline-[#dddaff]"
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4 float-left m-2" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default MainNav;
