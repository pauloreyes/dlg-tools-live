import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
      <div className="bg-red-100 min-h-screen flex-grow flex"> {/* Removed items-center justify-center */}
        <main className="flex-grow"> {/* Added flex-grow to main */}
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
