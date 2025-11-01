"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Users, UserPlus, Calculator, Presentation } from "lucide-react";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Donors", href: "/donors", icon: UserPlus },
  { name: "Members", href: "/members", icon: Users },
  { name: "Distribution", href: "/distribution", icon: Calculator },
  { name: "Slideshow", href: "/slideshow", icon: Presentation },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-2">
      {navigation.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              isActive
                ? "bg-green-600 text-white"
                : "text-gray-700 hover:bg-green-50 hover:text-green-700"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
