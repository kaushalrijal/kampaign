"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NavFooter = () => {
  const pathname = usePathname();

  const isActive = (route: string) => {
    if (route === "/") {
      return pathname === "/";
    }
    return pathname === `/${route}`;
  };
  return (
    <div className="border-t border-border shrink-0 mt-auto">
      <Link
        href="/settings"
        className={`w-full block px-4 py-3 text-left text-sm font-semibold tracking-wide border-b border-border transition-colors ${
          isActive("settings")
            ? "bg-primary text-primary-foreground"
            : "text-foreground hover:bg-muted"
        }`}
      >
        SETTINGS
      </Link>

      {/* Status Indicator */}
      <div className="px-6 py-6 text-xs text-muted-foreground">
        <div className="font-black tracking-widest mb-2">STATUS</div>
        <div>Ready to send</div>
      </div>
    </div>
  );
};

export default NavFooter;
