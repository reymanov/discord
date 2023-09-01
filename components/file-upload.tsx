"use client";

import { UploadDropzone } from "@lib/uploadthing";
import { X } from "lucide-react";
import Image from "next/image";
import "@uploadthing/react/styles.css";

interface Props {
  value: string;
  endpoint: "messageFile" | "serverImage";
  onChange: (url?: string) => void;
}

const FileUpload = ({ value, endpoint, onChange }: Props) => {
  const fileType = value?.split(".").pop();

  if (value && fileType !== "pdf") {
    return (
      <div className="relative h-20 w-20">
        <Image fill src={value} alt="Upload" className="rounded-full" />
        <button
          type="button"
          onClick={() => onChange("")}
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint="serverImage"
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url);
      }}
      onUploadError={(err: Error) => {
        console.log(err);
      }}
    />
  );
};

export default FileUpload;
