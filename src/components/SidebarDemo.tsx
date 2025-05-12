
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserCog, Settings, LogOut, Microscope, FlaskConical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "./ui/sidebar";
import { useToast } from "./ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "./ui/dropdown-menu";

const SidebarLink = ({ link }: { link: { label: string; href: string; icon: React.ReactNode } }) => {
  const { state } = useSidebar();
  
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip={link.label}>
        <Link to={link.href} className="flex items-center gap-2">
          {link.icon}
          <span>{link.label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export function SidebarDemo() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const links = [
    {
      label: "Generator",
      href: "/",
      icon: (
        <FlaskConical className="h-5 w-5" />
      ),
    },
    {
      label: "Library",
      href: "/library",
      icon: (
        <Microscope className="h-5 w-5" />
      ),
    },
  ];

  const Logo = () => {
    return (
      <Link
        to="/"
        className="font-normal flex space-x-2 items-center text-sm py-1 relative z-20"
      >
        <div className="h-5 w-6 bg-blue-600 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-medium whitespace-pre text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
        >
          Sci-icons
        </motion.span>
      </Link>
    );
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-3 py-2">
          <div className="sidebar-logo">
            <Logo />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {links.map((link, idx) => (
            <SidebarLink key={idx} link={link} />
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-3 py-2">
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src="" alt="Profile" />
                      <AvatarFallback>
                        <UserCog className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <span>My Account</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Menu</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/" className="flex items-center gap-2">
                    <FlaskConical className="h-4 w-4" />
                    <span>Generator</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/library" className="flex items-center gap-2">
                    <Microscope className="h-4 w-4" />
                    <span>Library</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
