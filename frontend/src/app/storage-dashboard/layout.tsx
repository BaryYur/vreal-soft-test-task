import React from "react";

import { SidebarProvider } from "@/components/ui";

import { DashboardSidebar } from "./_components";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh bg-zinc-100">
      <SidebarProvider>
        <DashboardSidebar />
        <main className="p-5 w-full">{children}</main>
      </SidebarProvider>
    </div>
  );
}
