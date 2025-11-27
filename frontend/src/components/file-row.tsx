import React from "react";

import { useRouter } from "next/navigation";

import { routes } from "@/config";

import { UserFile } from "@/types";

import { FileChangeMenu } from "@/components";

import { File } from "lucide-react";

interface FileRowProps {
  file: UserFile;
}

export const FileRow: React.FC<FileRowProps> = ({ file }) => {
  const router = useRouter();

  const handleNavigateToFile = () => {
    router.push(
      `/${routes.storageDashboard.index}/${routes.storageDashboard.file}/${file.id}`,
    );
  };

  return (
    <div
      onClick={handleNavigateToFile}
      className="flex cursor-pointer items-center justify-between gap-2 bg-white py-2 pr-1 pl-2 hover:bg-zinc-50"
    >
      <div className="flex items-center gap-2">
        <File size={16} />
        <p className="text-sm">{file.name}</p>
      </div>

      <FileChangeMenu file={file} />
    </div>
  );
};
