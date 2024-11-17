"use client";
import Link from "next/link";
import * as React from "react";
import { Button } from "../ui/button";
import { UserProfile } from "../user-profile";
import ModeToggle from "../mode-toggle";
import { TreePine } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import config from "@/config";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Marketing Page",
    href: "/marketing-page",
    description: "Write some wavy here to get them to click.",
  },
];

export default function NavBar() {
  let userId = null;
  /* eslint-disable react-hooks/rules-of-hooks */
  if (config?.auth?.enabled) {
    const user = useAuth();
    userId = user?.userId;
  }

  return (
    <div className="flex min-w-full fixed justify-between p-2 border-b z-10 dark:bg-black dark:bg-opacity-50 bg-white">
      <NavigationMenu>
        <NavigationMenuList className="flex gap-3 w-[100%] justify-between">
          <Link href="/" className="pl-2 flex items-center" aria-label="Home">
            <TreePine aria-hidden="true" className="text-green-600" />
            <span className="sr-only">Home</span>
          </Link>
          {userId && (
            <Link href="/dashboard" legacyBehavior passHref>
              <Button variant="ghost">Dashboard</Button>
            </Link>
          )}
        </NavigationMenuList>
      </NavigationMenu>
      <div className="flex items-center gap-2 max-[825px]:hidden">
        {userId ? (
          <UserProfile />
        ) : (
          <div className="flex gap-2">
            <Link href="/sign-in">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Sign Up</Button>
            </Link>
          </div>
        )}
        <ModeToggle />
      </div>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
