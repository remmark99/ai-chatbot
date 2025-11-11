"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const currentPath = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="z-10 fixed top-1.5 left-1/2 -translate-x-1/2 flex gap-2"
    >
      <Link href="/">
        <Button
          className="md:h-[34px]"
          variant={currentPath === "/" ? "default" : "outline"}
        >
          Чат-бот
        </Button>
      </Link>
      <Link href="/clean-chat">
        <Button
          className="md:h-[34px]"
          variant={currentPath === "/clean-chat" ? "default" : "outline"}
        >
          Чистый чат-бот
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
      {/* Add more links here as needed */}
    </nav>
  );
}
