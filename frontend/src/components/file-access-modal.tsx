import React, { useState, useEffect } from "react";

import { UserFile, UserFileAccess } from "@/types";

import { useGetFileAccess, useUpdateFileAccess } from "@/hooks";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Input,
  AlertDialogFooter,
  Button,
} from "./ui";

import { LoaderCircle, X } from "lucide-react";

import toast from "react-hot-toast";

interface FileAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: UserFile;
}

export const FileAccessModal: React.FC<FileAccessModalProps> = ({
  isOpen,
  onClose,
  file,
}) => {
  const [formData, setFormData] = useState<{
    email: string;
    access: "change" | "watch";
  }>({
    email: "",
    access: "watch",
  });
  const [fileAccessUsers, setFileAccessUsers] = useState<UserFileAccess[]>([]);

  const { data: fileAccessUsersData } = useGetFileAccess(file.id);
  const {
    mutate: updateFileAccessMutation,
    isPending: isUpdateFileAccessPending,
    isSuccess: isUpdateFileAccessSuccess,
  } = useUpdateFileAccess();

  const handleSubmitUpdateFileAccess = (event: React.FormEvent) => {
    event.preventDefault();

    if (formData.email === "") {
      toast.error("Please enter an email");

      return;
    }

    if (fileAccessUsers.some((user) => user.email === formData.email)) {
      toast.error("User already added");

      return;
    }

    setFileAccessUsers([
      ...fileAccessUsers,
      { id: Math.random().toString(), ...formData },
    ]);
    setFormData({ email: "", access: "watch" });
  };

  const updateFileAccess = () => {
    updateFileAccessMutation({ id: file.id, data: fileAccessUsers });
  };

  const handleRemoveFileAccessUser = (id: string) => {
    setFileAccessUsers(fileAccessUsers.filter((user) => user.id !== id));
  };

  useEffect(() => {
    if (fileAccessUsersData) {
      setFileAccessUsers(fileAccessUsersData);
    }
  }, [fileAccessUsersData]);

  useEffect(() => {
    if (isUpdateFileAccessSuccess) {
      onClose();
    }
  }, [isUpdateFileAccessSuccess, onClose]);

  return (
    <AlertDialog open={isOpen}>
<<<<<<< HEAD
      <AlertDialogContent className="w-[460px]" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
=======
      <AlertDialogContent
        className="w-[460px]"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
>>>>>>> c35a8959124d8fbd9f9f1857fea7fd43c49abffd
        <AlertDialogHeader>
          <AlertDialogTitle>File access</AlertDialogTitle>
          <AlertDialogDescription>
            Add user access to this file:{" "}
            <span className="font-bold">{file.name}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form
          onSubmit={handleSubmitUpdateFileAccess}
          className="flex items-center"
        >
          <Select
            value={formData.access}
            onValueChange={(value: "change" | "watch") =>
              setFormData({ ...formData, access: value })
            }
          >
            <SelectTrigger className="border-r-none focus-visible:ring-none h-10 w-30 rounded-r-none border-r-0 bg-white py-5 focus-visible:ring-0">
              <SelectValue placeholder="Select access" />
            </SelectTrigger>

            <SelectContent side="bottom" align="start">
              <SelectItem value="change">Change</SelectItem>
              <SelectItem value="watch">Watch</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="email"
            value={formData.email}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, email: event.target.value })
            }
            placeholder="Enter email"
            className="border-l-none border-r-none focus-visible:ring-none h-[41.6px] rounded-none bg-white focus-visible:ring-0"
          />

          <Button type="submit" className="h-[41.6px] w-[73px] rounded-l-none">
            Add
          </Button>
        </form>

        <div>
          {fileAccessUsers.length === 0 && (
            <p className="my-4 text-center text-sm text-zinc-500">
              No users added yet
            </p>
          )}

          <ul className="flex flex-wrap gap-2">
            {fileAccessUsers.map((user) => (
              <li
                key={user.id}
                className="flex items-center gap-2 rounded-md bg-zinc-200 px-2 py-1 text-sm"
              >
                <span>{user.email}</span>
                <span className="text-zinc-500">{user.access}</span>

                <button onClick={() => handleRemoveFileAccessUser(user.id)}>
                  <X className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <AlertDialogFooter className="flex items-center justify-end gap-2">
          <AlertDialogCancel
            type="button"
            disabled={isUpdateFileAccessPending}
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              event.stopPropagation();

              onClose();
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={updateFileAccess}
            disabled={isUpdateFileAccessPending}
            className="min-w-[80px]"
          >
            {isUpdateFileAccessPending ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <span>Save</span>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
