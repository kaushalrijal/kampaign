"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";


const NavMain = ({ items }: { items: Array<{ id: string; label: string }> }) => {
  const pathname = usePathname();

  const normalizeHref = (route: string) => {
    if (route === "/") return "/";
    if (route.startsWith("/")) return route;
    return `/${route}`;
  };

  const isActive = (route: string) => pathname === normalizeHref(route);
  return (
    <nav className="flex-1 px-4 py-6 flex flex-col gap-2 overflow-y-auto min-h-0">
      {items.map((item) => (
        <Link
          key={item.id}
          href={normalizeHref(item.id)}
          className={`px-4 py-3 text-left text-sm font-semibold tracking-wide border border-transparent transition-colors ${
            isActive(item.id)
              ? "bg-primary text-primary-foreground border-foreground"
              : "text-foreground hover:bg-muted hover:border-border"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};

export default NavMain;
