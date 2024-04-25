"use client";
import { formatBytes, upload, uuidv4 } from "@/lib/utils";
import { useCallback, useRef, useState } from "react";
import { DropzoneOptions, DropzoneState, useDropzone } from "react-dropzone";
import axios, { CancelToken, CancelTokenSource } from "axios";

interface DroppedFileState {
  status: "dropped";
  preview?: string;
}

interface UploadingFileState {
  status: "uploading";
  progress: number;
  remainingTime: string;
  cancelUpload: () => void;
}

interface UploadedFileState {
  status: "uploaded";
  url: string;
}

export interface FileDropItem {
  id: string;
  file: File;
  state: DroppedFileState | UploadingFileState | UploadedFileState;
}

export interface FileUploadState {
  files: FileDropItem[];
  isUploading: boolean;
  isDisabled: boolean;
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
  cancelUpload: (id: string) => void;
}

interface FileUploadProps {
  opts?: Omit<DropzoneOptions, "onDrop" | "onDropAccepted" | "onDropRejected">;
}

const useFileUpload = (props: FileUploadProps): FileUploadState => {
  const { opts } = props || {};
  const [files, setFiles] = useState<FileDropItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const cancelTokens = useRef<{ [key: string]: CancelTokenSource }>({});
  const isDisabled = isUploading || opts?.disabled || false;

  const clear = () => {
    setFiles([]);
    cancelTokens.current = {};
  };

  const cancelUpload = (id: string) => {
    if (cancelTokens.current[id]) {
      cancelTokens.current[id]?.cancel();
      delete cancelTokens.current[id];
      setFiles(
        files.map((file) =>
          file.id === id ? { ...file, state: { status: "dropped" } } : file,
        ),
      );
    }
  };

  const startUpload = useCallback(async () => {
    setIsUploading(true);
    const filesToUpload = files.filter(
      (file) => file.state.status === "dropped",
    );
    if (filesToUpload.length === 0) {
      setIsUploading(false);
      return;
    }

    for (const file of filesToUpload) {
      const cancelTokenSource = axios.CancelToken.source();
      cancelTokens.current[file.id] = cancelTokenSource;

      setFiles((prevFiles) =>
        prevFiles.map((prevFile) =>
          prevFile.id === file.id
            ? ({
                ...prevFile,
                state: { status: "uploading", progress: 0, remainingTime: "" },
              } as FileDropItem)
            : prevFile,
        ),
      );

      try {
        await uploadFile({
          file,
          onProgress: (progress, remainingTime) => {
            setFiles((prevFiles) =>
              prevFiles.map((prevFile) =>
                prevFile.id === file.id
                  ? ({
                      ...prevFile,
                      state: { status: "uploading", progress, remainingTime },
                    } as FileDropItem)
                  : prevFile,
              ),
            );
          },
          onUpload: (url) => {
            setFiles((prevFiles) =>
              prevFiles.map((prevFile) =>
                prevFile.id === file.id
                  ? { ...prevFile, state: { status: "uploaded", url } }
                  : prevFile,
              ),
            );
          },
          cancelToken: cancelTokenSource.token,
        });
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Upload canceled", error.message);
        } else {
          console.error("Upload error:", error);
        }
      }
    }
    setIsUploading(false);
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
    disabled: isUploading || opts?.disabled,
    ...opts,
  });

  return {
    files,
    startUpload,
    isUploading,
    getRootProps,
    getInputProps,
    rootRef,
    inputRef,
    isDragAccept,
    isDisabled,
    isDragActive,
    isDragReject,
    clear,
    open,
    cancelUpload,
  };
};

export default useFileUpload;

interface UploadFileProps {
  file: FileDropItem;
  onProgress: (progress: number, remainingTime: string) => void;
  onUpload: (url: string) => void;
}

interface UploadFileProps {
  file: FileDropItem;
  onProgress: (progress: number, remainingTime: string) => void;
  onUpload: (url: string) => void;
  cancelToken: CancelToken;
}

export const uploadFile = async (props: UploadFileProps): Promise<void> => {
  const { file, onProgress, onUpload, cancelToken } = props;

  try {
    await upload({
      file: file.file,
      cancelToken,
      onUploadProgress: (progress) => {
        onProgress(progress, "");
      },
      onUploadComplete: (url) => {
        onUpload(url);
      },
      onUploadError: (error) => {
        console.error("Upload error:", error);
      },
    });

    // const response = await axios.put(url, file.file, {
    //   headers: {
    //     "Content-Type": file.file.type,
    //   },
    //   onUploadProgress: (progressEvent) => {
    //     const progress = Math.round(
    //       (progressEvent.loaded * 100) / (progressEvent.total ?? 0),
    //     );
    //     const remainingTime = formatBytes(
    //       (progressEvent.total ?? 0) - progressEvent.loaded,
    //       {
    //         sizeType: "accurate",
    //         decimals: 2,
    //       },
    //     );
    //     onProgress(progress, remainingTime);
    //   },
    //   cancelToken,
    // });

    // if (response.status === 200) {
    //   onUpload(url);
    // }
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log("Request canceled", error.message);
    } else {
      console.error("Upload error:", error);
    }
  }
};
