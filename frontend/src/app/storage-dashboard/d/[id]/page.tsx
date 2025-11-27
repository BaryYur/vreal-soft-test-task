"use client";

import { useParams } from "next/navigation";

import { useGetDirectory, useGetDirectoryChildren } from "@/hooks";

import { FileRow, DirectoryCard } from "@/components";
import { Skeleton } from "@/components/ui";

export default function DirectoryPage() {
  const params = useParams();

  const directoryId: string | null =
    typeof params?.id === "string" ? params.id : null;

  const { data: directory, isPending: isDirectoryPending } =
    useGetDirectory(directoryId);

  const { data: directoryChildren, isPending: isDirectoryChildrenPending } =
    useGetDirectoryChildren(directoryId);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl">
          {isDirectoryPending ? (
            <span>Loading...</span>
          ) : (
            <span>{directory?.name}</span>
          )}
        </h2>
      </div>

      <ul className="max-w-[900px] rounded-lg bg-white p-4 shadow-sm">
        {directoryChildren?.directories.map((directory) => (
          <li key={directory.id} className="border-b last:border-b-0">
            <DirectoryCard data={directory} type="row" />
          </li>
        ))}

        {directoryChildren?.files.map((file) => (
          <li key={file.id} className="border-b last:border-b-0">
            <FileRow file={file} />
          </li>
        ))}

        {isDirectoryChildrenPending && (
          <div className="mt-4 flex flex-col gap-px">
            {[1, 2, 3, 4, 5].map((item) => (
              <Skeleton key={item} className="h-9 rounded-xs bg-zinc-200" />
            ))}
          </div>
        )}

        {directoryChildren &&
          directoryChildren.directories.length === 0 &&
          directoryChildren.files.length === 0 && (
            <div className="py-10 text-center text-sm">
              <p>No data found</p>
            </div>
          )}
      </ul>
    </div>
  );
}
