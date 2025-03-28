import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
      <div className="bg-red-100 min-h-screen flex-grow flex"> 
        <main className="flex-grow">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
