import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import NavMain from "./nav-main"
import Link from "next/link"
import NavFooter from "./nav-footer"

const navItems = [
  { id: "/", label: "DASHBOARD" },
  { id: "import", label: "IMPORT" },
  { id: "design", label: "DESIGN" },
  { id: "attachments", label: "ATTACH" },
  { id: "configure", label: "CONFIGURE" },
]

const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <div className="px-6 py-13 border-b border-border shrink-0">
          <div className="text-xs font-black tracking-widest text-muted-foreground">MENU</div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
       <NavFooter />
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar