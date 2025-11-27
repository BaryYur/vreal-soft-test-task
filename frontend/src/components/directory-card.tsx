"use client";

import React, { useState, useMemo, useCallback } from "react";

import { useRouter } from "next/navigation";

import { Directory } from "@/types";

import { useCloneDirectory, useDeleteDirectory } from "@/hooks";

import { routes } from "@/config";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui";
import { FileModal } from "./file-modal";
import { DirectoryModal } from "./directory-modal";

import {
  Folder,
  EllipsisVertical,
  FilePlusCorner,
  PenLine,
  FolderPlus,
  Folders,
  Trash,
  LucideIcon,
} from "lucide-react";

interface MenuAction {
  id: number;
  title: string;
  icon: LucideIcon;
  action?: () => void;
}

interface DirectoryCardProps {
  type?: "card" | "row";
  data: Directory;
}

export const DirectoryCard: React.FC<DirectoryCardProps> = ({ type, data }) => {
  const router = useRouter();

  const [isDirectoryModalOpen, setIsDirectoryModalOpen] = useState(false);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"update" | "create">("update");

  const { mutate: deleteDirectoryMutation } = useDeleteDirectory();
  const { mutate: cloneDirectoryMutation } = useCloneDirectory();

  const menuActions = useMemo<MenuAction[]>(
    () =>
      [
        {
          id: 1,
          title: "Update",
          icon: PenLine,
          action: () => {
            setModalType("update");
            setIsDirectoryModalOpen(true);
          },
        },
        {
          id: 2,
          title: "Create file",
          icon: FilePlusCorner,
          action: () => setIsFileModalOpen(true),
        },
        {
          id: 3,
          title: "Create directory",
          icon: FolderPlus,
          action: () => {
            setModalType("create");
            setIsDirectoryModalOpen(true);
          },
        },
        {
          id: 4,
          title: "Clone directory",
          icon: Folders,
          action: () => cloneDirectoryMutation({ id: data.id }),
        },
        {
          id: 5,
          title: "Delete",
          icon: Trash,
          action: () => deleteDirectoryMutation({ id: data.id }),
        },
      ] as const,
    [data, cloneDirectoryMutation, deleteDirectoryMutation],
  );

  const handleNavigateToDirectory = () => {
    router.push(
      `/${routes.storageDashboard.index}/${routes.storageDashboard.directory}/${data.id}`,
    );
  };

  const handleCloseFileModal = useCallback(() => {
    setIsFileModalOpen(false);
  }, [setIsFileModalOpen]);

  return (
    <>
      <div
        onClick={handleNavigateToDirectory}
        className={`${type === "row" ? "w-full py-2 pr-1 pl-2 hover:bg-zinc-100" : "min-w-50 rounded-md bg-white py-3.5 pr-2.5 pl-3.5 hover:bg-zinc-200"} flex cursor-pointer items-start justify-between gap-3 transition-all duration-200`}
      >
        <div className="flex items-start gap-3">
          <div>
            <Folder size={type === "card" ? 18 : 16} />
          </div>
          <p className="text-sm">{data.name}</p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer rounded-sm p-1 hover:bg-zinc-300">
            <EllipsisVertical size={16} />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end">
            {menuActions.map((menuAction) => (
              <DropdownMenuItem
                key={menuAction.id}
                onClick={(event: React.MouseEvent<HTMLElement>) => {
                  event.stopPropagation();

                  menuAction.action?.();
                }}
              >
                <div className="flex items-center gap-2">
                  <menuAction.icon className="size-3.5" />
                  <span className="text-xs">{menuAction.title}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DirectoryModal
        modalType={modalType}
        isOpen={isDirectoryModalOpen}
        onClose={() => setIsDirectoryModalOpen(false)}
        directory={data}
      />

      <FileModal
        isOpen={isFileModalOpen}
        onClose={handleCloseFileModal}
        directory={data}
      />
    </>
  );
};
