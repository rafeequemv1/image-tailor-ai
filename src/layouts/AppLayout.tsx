
import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarDemo } from "@/components/SidebarDemo";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

const AppLayout = () => {
  return (
    <div className="flex min-h-screen w-full">
      <SidebarDemo />
      <SidebarInset className="pt-0">
        {/* Add the sidebar trigger in the header */}
        <div className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
          <SidebarTrigger />
          <div className="flex-1" />
        </div>
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </SidebarInset>
    </div>
  );
};

export default AppLayout;
