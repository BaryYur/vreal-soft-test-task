"use client";

import { useCallback, useState, useMemo } from "react";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";

import { useUserStore } from "@/store";

import { useGetDirectoriesTree, useGetDirectory } from "@/hooks";

import { TreeView } from "@/components";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  Button,
} from "@/components/ui";
import { DirectoryModal } from "@/components";

import { sidebarMenuList } from "../_data";

import { Archive, Plus, FolderMinus } from "lucide-react";

export const DashboardSidebar = () => {
  const pathname = usePathname();
  const params = useParams();

  const user = useUserStore((state) => state.user);

  const [isDirectoryModalOpen, setIsDirectoryModalOpen] = useState(false);

  const isDirectoryPath = useMemo(
    () =>
      pathname?.startsWith("/storage-dashboard/d/") &&
      typeof params?.id === "string",
    [pathname, params],
  );

  const directoryId: string | null =
    isDirectoryPath && typeof params?.id === "string" ? params.id : null;

  const { data: directories, isPending: isDirectoriesPending } =
    useGetDirectoriesTree();
  const { data: currentDirectory } = useGetDirectory(
    directoryId,
    isDirectoryModalOpen,
  );

  const onCloseModal = useCallback(() => {
    setIsDirectoryModalOpen(false);
  }, []);

  return (
    <>
      <Sidebar className="bg-white p-5 shadow-xs">
        <SidebarHeader className="border-b bg-white p-0 pb-5">
          <div className="flex items-center gap-3">
            <Archive size={22} />
            <span className="text-xl">Storage</span>
          </div>
        </SidebarHeader>

        <SidebarContent className="bg-white pt-3">
          <SidebarMenu>
            {sidebarMenuList.map((listItem) => (
              <SidebarMenuItem key={listItem.id}>
                <SidebarMenuButton asChild className="h-10">
                  <Link href={listItem.link}>
                    <listItem.icon />
                    <span>{listItem.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>

          {directories && directories.length > 0 ? (
            <TreeView data={directories} className="p-0" />
          ) : (
            <div className="p-2 text-sm text-zinc-600">
              {isDirectoriesPending ? (
                <span>Loading...</span>
              ) : (
                <div className="flex items-center gap-2">
                  <FolderMinus size={16} />
                  <span className="text-sm">No directories</span>
                </div>
              )}
            </div>
          )}

          <Button
            className="text-left"
            variant="secondary"
            onClick={() => setIsDirectoryModalOpen(true)}
          >
            <Plus />
            <span className="font-normal">New Folder</span>
          </Button>
        </SidebarContent>

        {user && (
          <SidebarFooter className="bg-white">
            <p className="text-sm">{user.name}</p>
            <p className="text-sm text-zinc-500">{user.email}</p>
          </SidebarFooter>
        )}
      </Sidebar>

      <DirectoryModal
        isOpen={isDirectoryModalOpen}
        onClose={onCloseModal}
        modalType="create"
        directory={currentDirectory}
      />
    </>
  );
};
