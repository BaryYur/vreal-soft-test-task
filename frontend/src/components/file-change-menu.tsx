import React, { useMemo, useState, useCallback, useEffect } from "react";

import { useRouter } from "next/navigation";

import { UserFile } from "@/types";

import { useDeleteFile } from "@/hooks";

import { FileAccessModal } from "@/components";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui";

import { routes } from "@/config";

import toast from "react-hot-toast";

import { UserRoundPen, Trash, EllipsisVertical, Link } from "lucide-react";

interface FileChangeMenuProps {
  file: UserFile;
  isPage?: boolean;
}

export const FileChangeMenu: React.FC<FileChangeMenuProps> = ({
  file,
  isPage,
}) => {
  const router = useRouter();

  const [isFileAccessModalOpen, setIsFileAccessModalOpen] = useState(false);

  const { mutate: deleteFileMutation, isSuccess: isDeleteFileSuccess } =
    useDeleteFile();

  const fileMenuActions = useMemo(
    () =>
      [
        {
          id: 1,
          title: "File access",
          icon: UserRoundPen,
          action: () => setIsFileAccessModalOpen(true),
        },
        {
          id: 2,
          title: "Copy link",
          icon: Link,
          action: () => {
            navigator.clipboard.writeText(
              `${window.location.origin}/${routes.storageDashboard.index}/${routes.storageDashboard.file}/${file.id}`,
            );
            toast.success("Link copied to clipboard");
          },
        },
        {
          id: 3,
          title: "Delete",
          icon: Trash,
          action: () => deleteFileMutation({ id: file.id }),
        },
      ] as const,
    [deleteFileMutation, file.id],
  );

  useEffect(() => {
    if (isPage && isDeleteFileSuccess) {
      router.push(`/${routes.storageDashboard.index}`);
    }
  }, [isPage, isDeleteFileSuccess, router]);

  const handleCloseFileAccessModal = useCallback(() => {
    setIsFileAccessModalOpen(false);
  }, []);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="cursor-pointer rounded-sm p-1 hover:bg-zinc-200"
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          <EllipsisVertical size={isPage ? 20 : 16} />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end">
          {fileMenuActions.map((menuAction) => (
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

      <FileAccessModal
        isOpen={isFileAccessModalOpen}
        onClose={handleCloseFileAccessModal}
        file={file}
      />
    </>
  );
};
