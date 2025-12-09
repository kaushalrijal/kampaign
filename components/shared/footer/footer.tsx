"use client";

import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = ["import", "design", "attachments", "configure"]

const PaginationFooter = () => {
    const pathname = usePathname().substring(1);
    const current = routes.indexOf(pathname);

    console.log(current)
  return (
    <div className="flex gap-4 justify-between pt-8 border-t border-border">
      <Button variant={"secondary"} asChild={current !== 0}
        className={`px-6 py-3 border border-border bg-background text-foreground font-semibold text-sm tracking-wide hover:bg-muted transition-colors ${current === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={current === 0}
      >
        {current !== 0 ? (
          <Link href={`/${routes[current-1]}`}>
            BACK
          </Link>
        ) : (
          <span>BACK</span>
        )}
      </Button>
      {current === 3 ? (
        <Button asChild
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold text-sm tracking-wide border border-foreground hover:opacity-90 transition-opacity"
        >
          <Link href="/">
            VIEW CAMPAIGNS
          </Link>
        </Button>
      ) : (
        <Button asChild
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold text-sm tracking-wide border border-foreground hover:opacity-90 transition-opacity"
        >
          <Link href={`/${routes[current+1]}`}>
            NEXT STEP
            <ChevronRight className="w-4 h-4" />
          </Link>
        </Button>
      )}
    </div>
  );
};

export default PaginationFooter;
