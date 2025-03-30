import { AudioLines, Captions } from "lucide-react";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import Link from "next/link";
import CustomUser from "./custom-user";

// Menu items.
const items = [
	{
		title: "VO Generator",
		url: "/dashboard/voice-over",
		icon: AudioLines,
	},
	{
		title: "SRT to VTT Converter",
		url: "/dashboard/srt-to-vtt",
		icon: Captions,
	},
];

export function AppSidebar() {
	return (
		<Sidebar collapsible='icon' variant='floating'>
			<div className='flex items-center justify-center'>
				<SidebarTrigger />
			</div>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Applications</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<Link key={item.title} href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<CustomUser />
			</SidebarFooter>
		</Sidebar>
	);
}
