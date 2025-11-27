import React, { useEffect } from "react";

import { useForm } from "react-hook-form";

import { Directory } from "@/types";

import { useCreateDirectory, useUpdateDirectory } from "@/hooks";

import { directorySchema, DirectoryData } from "@/schemas";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  Input,
} from "@/components/ui";

import { LoaderCircle } from "lucide-react";

interface DirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalType: "create" | "update";
  directory?: Directory;
}

const modalInfo = {
  create: {
    title: "Create new directory",
    description: "Enter the name for the new directory.",
    submitButtonText: "Create",
  },
  update: {
    title: "Update directory",
    description: "Enter the new name for the directory.",
    submitButtonText: "Save",
  },
} as const;

export const DirectoryModal: React.FC<DirectoryModalProps> = ({
  isOpen,
  onClose,
  modalType,
  directory,
}) => {
  const formConfig = {
    resolver: zodResolver(directorySchema),
    defaultValues: {
      name: "",
    },
  };
  const form = useForm<DirectoryData>(formConfig);

  const {
    mutate: createDirectoryMutation,
    isPending: isCreateDirectoryPending,
    isSuccess: isCreateDirectorySuccess,
  } = useCreateDirectory();
  const {
    mutate: updateDirectoryMutation,
    isPending: isUpdateDirectoryPending,
    isSuccess: isUpdateDirectorySuccess,
  } = useUpdateDirectory();

  const handleSubmit = (data: DirectoryData) => {
    if (modalType === "create") {
      if (directory) {
        createDirectoryMutation({ parentId: directory.id, ...data });
      } else {
        createDirectoryMutation(data);
      }
    } else if (modalType === "update" && directory) {
      updateDirectoryMutation({ id: directory.id, directory: data });
    }
  };

  useEffect(() => {
    if (isCreateDirectorySuccess || isUpdateDirectorySuccess) {
      onClose();
      form.setValue("name", "");
    }
  }, [isCreateDirectorySuccess, isUpdateDirectorySuccess, onClose, form]);

  useEffect(() => {
    if (modalType === "update" && directory) {
      form.setValue("name", directory.name);
    } else {
      form.setValue("name", "");
    }
  }, [modalType, directory, form]);

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="w-[380px]">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {modalInfo[modalType].title}{" "}
            {modalType === "update" && directory && (
              <span className="text-zinc-600">{directory.name}</span>
            )}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {modalInfo[modalType].description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} id="name" placeholder="Enter name" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <AlertDialogFooter className="mt-5">
              <AlertDialogCancel
                type="button"
                disabled={isCreateDirectoryPending || isUpdateDirectoryPending}
                onClick={onClose}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                type="submit"
                disabled={isCreateDirectoryPending || isUpdateDirectoryPending}
                className="min-w-[73px]"
              >
                {isCreateDirectoryPending || isUpdateDirectoryPending ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <span>{modalInfo[modalType].submitButtonText}</span>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
