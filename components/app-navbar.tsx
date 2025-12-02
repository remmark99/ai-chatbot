"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";

export default function NavBar() {
  const router = useRouter();
  const { data: session } = useSession();
  const currentPath = usePathname();
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <>
      <nav
        aria-label="Main navigation"
        className="z-10 fixed top-1.5 left-1/2 -translate-x-1/2 flex gap-2"
      >
        <Link href="/clean-chat">
          <Button
            className="md:h-[34px]"
            variant={
              /.*\/clean-chat.*/.test(currentPath) ? "default" : "outline"
            }
          >
            Чат-бот
          </Button>
        </Link>
        <Link href="/chat">
          <Button
            className="md:h-[34px]"
            variant={/.*\/chat.*/.test(currentPath) ? "default" : "outline"}
          >
            КП
          </Button>
        </Link>
        <Link href="/prices">
          <Button
            className="md:h-[34px]"
            variant={currentPath === "/prices" ? "default" : "outline"}
          >
            Цены
          </Button>
        </Link>
        <Link href="/settings">
          <Button
            className="md:h-[34px]"
            variant={currentPath === "/settings" ? "default" : "outline"}
          >
            Настройки
          </Button>
        </Link>
        {/* Add more links here as needed */}
      </nav>
      <div className="right-12 top-1.5 z-10 fixed">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer size-[34px]">
              <AvatarImage
                src={`https://avatar.vercel.sh/${session?.user.email}`}
                alt="@user"
              />
              <AvatarFallback>
                {session?.user.name
                  ? session?.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                  : "?"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={() => {
                router.push("/settings");
              }}
            >
              Настройки
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
            >
              {`Включить ${resolvedTheme === "light" ? "темную" : "светлую"} тему`}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
