import { routes } from "@/config";

import { Home } from "lucide-react";

export const sidebarMenuList = [
  {
    id: "1",
    title: "Home",
    icon: Home,
    link: `/${routes.storageDashboard.index}`,
  },
] as const;
