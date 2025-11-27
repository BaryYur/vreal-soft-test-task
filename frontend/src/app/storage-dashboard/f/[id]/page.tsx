"use client";

import { useParams } from "next/navigation";

import { FileView } from "../../_components";

export default function FileViewPage() {
  const params = useParams();

  const fileId: string | null =
    typeof params?.id === "string" ? params.id : null;

  return <FileView fileId={fileId} />;
}
