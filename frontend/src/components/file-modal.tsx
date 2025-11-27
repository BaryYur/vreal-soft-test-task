import React, { useEffect, useState } from "react";

import { Directory, UserFileVisibility } from "@/types";

import { useUploadFile } from "@/hooks";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Input,
  Checkbox,
} from "@/components/ui";

interface FileModal {
  isOpen: boolean;
  onClose: () => void;
  directory: Directory;
}

export const FileModal: React.FC<FileModal> = ({
  isOpen,
  onClose,
  directory,
}) => {
  const [formData, setFormData] = useState<{
    file: File | null;
    isPublic: boolean;
  }>({
    file: null,
    isPublic: false,
  });

  const {
    mutate: uploadFile,
    isPending: isUploadFilePending,
    isSuccess: isUploadFileSuccess,
  } = useUploadFile();

  const handleSubmitUploadFile = (event: React.FormEvent) => {
    event.preventDefault();

    if (formData.file) {
      uploadFile({
        file: formData.file,
        data: {
          name: formData.file.name,
          ownerId: directory.ownerId,
          directoryId: directory.id,
          visibility: formData.isPublic
            ? UserFileVisibility.PUBLIC
            : UserFileVisibility.PRIVATE,
        },
      });
    }
  };

  useEffect(() => {
    if (isUploadFileSuccess) {
      onClose();
    }
  }, [isUploadFileSuccess, onClose]);

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="w-[380px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Create file</AlertDialogTitle>
          <AlertDialogDescription>Choose your file</AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={handleSubmitUploadFile} className="space-y-4">
          <Input
            id="file"
            type="file"
            disabled={isUploadFilePending}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const file = event.target.files?.[0] ?? null;

              setFormData({ ...formData, file });
            }}
            className="w-full"
          />

          <div className="flex items-center gap-1.5">
            <Checkbox
              id="isPublic"
              checked={formData.isPublic}
              onCheckedChange={() =>
                setFormData({ ...formData, isPublic: !formData.isPublic })
              }
              disabled={isUploadFilePending}
            />
            <label
              htmlFor="isPublic"
              className="cursor-pointer text-sm font-normal"
            >
              Is public
            </label>
          </div>

          <AlertDialogFooter className="mt-5">
            <AlertDialogCancel type="button" onClick={onClose}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              type="submit"
              disabled={formData.file === null || isUploadFilePending}
            >
              {isUploadFilePending ? "Uploading..." : "Upload"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
