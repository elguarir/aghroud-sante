import { useCallback, useState } from "react";
import { DropzoneOptions, DropzoneState, useDropzone } from "react-dropzone";
import axios from "axios";
import { vanilla } from "@/trpc/react";

interface FileUploadProps {
  opts?: Omit<DropzoneOptions, "onDrop" | "onDropAccepted" | "onDropRejected">;
}

interface FileUploadState extends DropzoneState {
  files: File[];
  status: "idle" | "uploading" | "done";
  progress: number[];
  keys: string[];
  startUpload: () => void;
}

export const useUpload = (props: FileUploadProps): FileUploadState => {
  const { opts } = props || {};
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<"idle" | "uploading" | "done">("idle");
  const [progress, setProgress] = useState<number[]>([]);
  const [keys, setKeys] = useState<string[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    setProgress((prevProgress) => [
      ...prevProgress,
      ...new Array(acceptedFiles.length).fill(0),
    ]);
  }, []);

  const { getRootProps, getInputProps, ...dropzoneState } = useDropzone({
    onDropAccepted: onDrop,
    disabled: opts?.disabled,
    ...opts,
  });

  const startUpload = useCallback(async () => {
    setStatus("uploading");
    const newKeys = await Promise.all(
      files.map(async (file, index) => {
        const { key, url } = await vanilla.document.generateUrl.mutate({
          filename: file.name,
          filetype: file.type,
        });

        await axios.put(url, file, {
          headers: {
            "Content-Type": file.type,
          },
          onUploadProgress: (progressEvent) => {
            if (!progressEvent.total) return;
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setProgress((prevProgress) => {
              const newProgress = [...prevProgress];
              newProgress[index] = percentCompleted;
              return newProgress;
            });
          },
        });

        return key;
      }),
    );
    setKeys(newKeys);
    setStatus("done");
  }, [files]);

  return {
    ...dropzoneState,
    getRootProps,
    getInputProps,
    files,
    status,
    progress,
    keys,
    startUpload,
  };
};
