import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="h-full bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-6xl md:text-7xl font-black tracking-tight mb-4">
          404
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-3 text-foreground">
          PAGE NOT FOUND
        </h2>
        
        <p className="text-muted-foreground mb-8 text-sm md:text-base">
          The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
        
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-primary text-primary-foreground font-semibold tracking-wide border-2 border-primary hover:bg-primary/90 transition-colors text-sm md:text-base"
        >
          RETURN TO HOME
        </Link>
      </div>
    </div>
  );
}
