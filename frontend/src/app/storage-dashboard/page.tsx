"use client";

import { useEffect, useState } from "react";

import { useGetDirectories, useGetFiles } from "@/hooks";

import { DirectoryCard, FileRow } from "@/components";
import { Skeleton } from "@/components/ui";
import { SearchForm, SearchDataType } from "./_components";

export default function HomePage() {
  const [search, setSearch] = useState<{
    type: SearchDataType;
    name: string;
  }>({
    type: "directory",
    name: "",
  });

  const {
    data: directories,
    isPending: isDirectoriesPending,
    refetch: refetchDirectories,
    isRefetching: isDirectoriesRefetching,
  } = useGetDirectories({ name: search.name });
  const {
    data: files,
    isPending: isFilesPending,
    refetch: refetchFiles,
    isRefetching: isFilesRefetching,
  } = useGetFiles({ name: search.name });

  useEffect(() => {
    if (search.type === "directory") {
      refetchDirectories();
    } else if (search.type === "file") {
      refetchFiles();
    }
  }, [search, refetchDirectories, refetchFiles]);

  return (
    <div className="w-full space-y-5">
      <h1 className="text-2xl font-semibold">Home</h1>

      <div>
        <SearchForm
          onStartSearch={(value) =>
            setSearch({ type: value.type, name: value.name })
          }
        />
      </div>

      <div>
        <h2 className="text-xl">Directories</h2>

        {!isDirectoriesPending && !isDirectoriesRefetching && (
          <div className="mt-4 flex flex-wrap gap-3">
            {directories?.map((directory) => (
              <DirectoryCard key={directory.id} data={directory} />
            ))}
          </div>
        )}

        {!isDirectoriesPending &&
          !isDirectoriesRefetching &&
          directories?.length === 0 && (
            <div className="w-full max-w-[900px] rounded-md bg-white py-8 shadow-xs">
              <p className="text-center text-sm text-zinc-500">
                No directories found
              </p>
            </div>
          )}

        {(isDirectoriesPending || isDirectoriesRefetching) && (
          <div className="mt-4 flex flex-wrap gap-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <Skeleton
                key={item}
                className="h-12 w-50 rounded-md bg-zinc-200"
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-4">
        <h2 className="text-xl">Files</h2>

        <div className="mt-4 max-w-[900px] rounded-md bg-white p-4 shadow-xs">
          {!isFilesPending && !isFilesRefetching && (
            <ul className="flex flex-col flex-wrap">
              {files?.map((file) => (
                <li key={file.id} className="border-b last:border-b-0">
                  <FileRow file={file} />
                </li>
              ))}
            </ul>
          )}

          {!isFilesPending && !isFilesRefetching && files?.length === 0 && (
            <div className="w-full py-4">
              <p className="text-center text-sm text-zinc-500">
                No files found
              </p>
            </div>
          )}

          {(isFilesPending || isFilesRefetching) && (
            <div className="mt-4 flex flex-col gap-px">
              {[1, 2, 3, 4, 5].map((item) => (
                <Skeleton key={item} className="h-9 rounded-xs bg-zinc-200" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
