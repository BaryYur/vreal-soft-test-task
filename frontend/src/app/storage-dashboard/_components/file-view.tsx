"use client";

import { useUserStore } from "@/store";

import { useGetFileViewUrl } from "@/hooks";

import { FileChangeMenu } from "@/components";
import { Skeleton } from "@/components/ui";

import { File } from "lucide-react";

interface FileViewProps {
  fileId: string | null;
}

export const FileView: React.FC<FileViewProps> = ({ fileId }) => {
  const user = useUserStore((state) => state.user);

  const { data: fileData, isPending: isFileDataPending } =
    useGetFileViewUrl(fileId);

  if (isFileDataPending) {
    return <p className="text-xl">Loading...</p>;
  }

  if (!fileData) {
    return (
      <div className="space-y-4">
        <p>File not found</p>
      </div>
    );
  }

  const { file, viewUrl } = fileData;
  const fileExtension = file.name.split(".").pop()?.toLowerCase();
  const isImage = ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(
    fileExtension || "",
  );
  const isPdf = fileExtension === "pdf";
  const isText = ["txt", "md", "json", "xml", "csv", "log"].includes(
    fileExtension || "",
  );

  return (
    <div className="max-w-[900px] space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <File size={22} />
          <h1 className="text-xl">{file.name}</h1>
        </div>

        {user?.id === file.ownerId && <FileChangeMenu isPage file={file} />}
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        {isImage ? (
          <div className="flex justify-center">
            <img
              src={viewUrl}
              alt={file.name}
              className="max-h-[80vh] max-w-full object-contain"
            />
          </div>
        ) : isPdf ? (
          <iframe
            src={viewUrl}
            className="h-[80vh] w-full border-0"
            title={file.name}
          />
        ) : isText ? (
          <iframe
            src={viewUrl}
            className="h-[80vh] w-full rounded border border-zinc-200"
            title={file.name}
          />
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-zinc-500">File preview not available</p>
            <a
              href={viewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Download File
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
