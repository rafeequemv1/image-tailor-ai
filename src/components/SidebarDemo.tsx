import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, UserCog, Settings, LogOut, Microscope, Flask, Beaker } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";

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
  
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
      navigate("/login");
    }
  };
  
  const links = [
    {
      label: "Generator",
      href: "/app",
      icon: (
        <Flask className="h-5 w-5" />
      ),
    },
    {
      label: "Library",
      href: "/library",
      icon: (
        <Microscope className="h-5 w-5" />
      ),
    },
    {
      label: "Profile",
      href: "/profile",
      icon: (
        <UserCog className="h-5 w-5" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <LogOut className="h-5 w-5" />
      ),
      onClick: handleLogout
    },
  ];

  const Logo = () => {
    return (
      <Link
        to="/app"
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

  const LogoIcon = () => {
    return (
      <Link
        to="/app"
        className="font-normal flex space-x-2 items-center text-sm py-1 relative z-20"
      >
        <div className="h-5 w-6 bg-blue-600 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      </Link>
    );
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-3 py-2">
          {/* Use conditional rendering based on sidebar state */}
          <div className="sidebar-logo">
            <Logo />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {links.map((link, idx) => {
            if (link.onClick) {
              return (
                <SidebarMenuItem key={idx}>
                  <SidebarMenuButton onClick={link.onClick} tooltip={link.label}>
                    {link.icon}
                    <span>{link.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            }
            return <SidebarLink key={idx} link={link} />;
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-3 py-2">
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
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
          </SidebarMenuItem>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
