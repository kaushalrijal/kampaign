import { SidebarTrigger } from "@/components/ui/sidebar";

const Header = () => {
  return (
    <header className="border-b border-border bg-card sticky top-0 z-10 md:relative md:top-auto">
      <div className="px-6 py-8 flex items-center gap-4">
        <SidebarTrigger />
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">
            EMAILBOX
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Mass personalized email automation
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
