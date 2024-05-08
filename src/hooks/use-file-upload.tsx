"use client";
import { upload, uuidv4 } from "@/lib/utils";
import { FileDropItem } from "@/types";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { DropzoneOptions, DropzoneState, useDropzone } from "react-dropzone";

export interface FileUploadState {
  files: FileDropItem[];
  isDisabled: boolean;
  isUploading: boolean;
  canStartUpload: boolean;
  clear: () => void;
  getRootProps: DropzoneState["getRootProps"];
  getInputProps: DropzoneState["getInputProps"];
  rootRef: DropzoneState["rootRef"];
  inputRef: DropzoneState["inputRef"];
  isDragAccept: DropzoneState["isDragAccept"];
  isDragActive: DropzoneState["isDragActive"];
  isDragReject: DropzoneState["isDragReject"];
  open: () => void;
  startUpload: () => void;
  removeFile: (id: string) => void;
}

interface FileUploadProps {
  opts?: Omit<DropzoneOptions, "onDrop" | "onDropAccepted" | "onDropRejected">;
  files?: FileDropItem[];
  setFiles?: Dispatch<SetStateAction<FileDropItem[]>>;
}

const useFileUpload = (props: FileUploadProps): FileUploadState => {
  const { opts } = props || {};
  const [filesState, setFileState] = useState<FileDropItem[]>([]);
  const files = props.files || filesState;
  const isDisabled = opts?.disabled || false;
  const setFiles = props.setFiles || setFileState;
  const isUploading = files.some((file) => file.state.status === "uploading");
  const canStartUpload = files.some((file) => file.state.status === "dropped");

  const clear = () => {
    setFiles([]);
  };

  const removeFile = (id: string) => {
    setFiles(files.filter((file) => file.id !== id));
  };

  const startUpload = useCallback(async () => {
    const filesToUpload = files.filter(
      (file) => file.state.status === "dropped",
    );
    if (filesToUpload.length === 0) {
      return;
    }

    for (const file of filesToUpload) {
      setFiles((prevFiles) =>
        prevFiles.map((prevFile) =>
          prevFile.id === file.id
            ? ({
                ...prevFile,
                state: { status: "uploading", progress: 0 },
              } as FileDropItem)
            : prevFile,
        ),
      );
      await upload({
        file: file.file,
        onUploadProgress(progress) {
          setFiles((prevFiles) =>
            prevFiles.map((prevFile) =>
              prevFile.id === file.id
                ? ({
                    ...prevFile,
                    state: {
                      status: "uploading",
                      progress,
                    },
                  } as FileDropItem)
                : prevFile,
            ),
          );
        },
        onUploadComplete(key) {
          setFiles((prevFiles) =>
            prevFiles.map((prevFile) =>
              prevFile.id === file.id
                ? ({
                    ...prevFile,
                    state: {
                      status: "uploaded",
                      key,
                    },
                  } as FileDropItem)
                : prevFile,
            ),
          );
        },
      });
    }
  }, [files]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      id: uuidv4(),
      file,
      state: { status: "dropped" },
    }));
    setFiles((prevFiles) => [...prevFiles, ...newFiles] as FileDropItem[]);
  }, []);

  const {
    getRootProps,
    getInputProps,
    rootRef,
    inputRef,
    isDragAccept,
    isDragActive,
    isDragReject,
    open,
  } = useDropzone({
    onDropAccepted: onDrop,
    onDropRejected: (fileRejections, event) =>
      console.log({ fileRejections, event }),
    disabled: opts?.disabled,
    ...opts,
  });

  return {
    files,
    isUploading,
    canStartUpload,
    startUpload,
    getRootProps,
    getInputProps,
    rootRef,
    inputRef,
    isDragAccept,
    isDragActive,
    isDragReject,
    isDisabled,
    clear,
    open,
    removeFile,
  };
};

export default useFileUpload;
