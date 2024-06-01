import type { ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import { vanilla } from "@/trpc/react";
import { extentions } from "./extentions";
import { env } from "@/env";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: "accurate" | "normal";
  } = {},
) {
  const { decimals = 0, sizeType = "normal" } = opts;

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate" ? accurateSizes[i] ?? "Bytest" : sizes[i] ?? "Bytes"
  }`;
}

export function uuidv4() {
  var d = new Date().getTime();
  var d2 =
    (typeof performance !== "undefined" &&
      performance.now &&
      performance.now() * 1000) ||
    0;
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.random() * 16;
    if (d > 0) {
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export type UploadProps = {
  file: File;
  onUploadProgress?: (progress: number) => void;
  onUploadComplete?: (key: string) => void;
  onUploadError?: (error: string) => void;
};
/**
 * Uploads a file to a specified URL.
 * @param file - The file to be uploaded.
 * @param onUploadProgress - Optional callback function to track the upload progress.
 * @param onUploadError - Optional callback function to handle upload errors.
 * @param onUploadComplete - Optional callback function to handle upload completion.
 * @returns The key of the uploaded file, or null if an error occurred.
 */

export const upload = async (props: UploadProps) => {
  const { file, onUploadProgress, onUploadError, onUploadComplete } = props;

  try {
    const { key, url } = await vanilla.document.generateUrl.mutate({
      filename: file.name,
      filetype: file.type,
    });
    await axios.put(url, file, {
      headers: {
        "Content-Type": file.type,
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total !== undefined) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          if (onUploadProgress) onUploadProgress(progress);
        }
      },
    });
    if (onUploadComplete) onUploadComplete(key);

    return key;
  } catch (error) {
    if (error instanceof Error) {
      if (onUploadError) onUploadError(error.message);
    } else {
      if (onUploadError)
        onUploadError(
          "Une erreur s'est produite lors du téléchargement du fichier, veuillez réessayer",
        );
    }
    return null;
  }
};

export const getExtension = (contenType: string) => {
  // key = extention, value = content type
  const ext = Object.keys(extentions).find(
    (key) => extentions[key] === contenType,
  );
  return ext;
};

export type CloudUploadProps = {
  file: File;
  onUploadProgress?: (progress: number) => void;
  onUploadComplete?: (url: string) => void;
  onUploadError?: (error: string) => void;
};
export const cloudUpload = async ({
  file,
  onUploadProgress,
  onUploadComplete,
  onUploadError,
}: CloudUploadProps) => {
  let baseUrl = `https://api.cloudinary.com/v1_1/${env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", env.NEXT_PUBLIC_CLOUDINARY_PRESET);

  try {
    const res = await axios.post(baseUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (data) => {
        const progress = Math.round((data.loaded * 100) / (data.total ?? 1));
        if (onUploadProgress) onUploadProgress(progress);
      },
    });
    if (onUploadComplete) onUploadComplete(res.data.secure_url as string);
    return res.data.secure_url as string;
  } catch (error) {
    console.error({ error });
    if (error instanceof Error) {
      if (onUploadError) onUploadError(error.message);
    } else {
      if (onUploadError)
        onUploadError("An error occurred while uploading the file");
    }
  }
};
export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Tremor Raw focusInput [v0.0.1]
export const focusInput = [
  // base
  "focus-visible:ring-2",
  // ring color
  "focus-visible:ring-blue-200 focus-visible:dark:ring-blue-700/30",
  // border color
  "focus-visible:border-blue-500 focus-visible:dark:border-blue-700",
];

// Tremor Raw hasErrorInput [v0.0.1]
export const hasErrorInput = [
  // base
  "ring-2",
  // border color
  "border-red-500 dark:border-red-700",
  // ring color
  "ring-red-200 dark:ring-red-700/30",
];

// Tremor Raw focusRing [v0.0.1]
export const focusRing = [
  // base
  "outline outline-offset-2 outline-0 focus-visible:outline-2",
  // outline color
  "outline-blue-500 dark:outline-blue-500",
];

export async function Await<T>({
  promise,
  children,
}: {
  promise: Promise<T>;
  children: (result: T) => JSX.Element;
}) {
  let result = await promise;

  return children(result);
}
