"use client";
import { cloudUpload, uuidv4 } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { DropzoneOptions, DropzoneState, useDropzone } from "react-dropzone";
import { upload } from "@/lib/utils";
import axios, { CancelToken } from "axios";

interface DroppedFileState {
  status: "dropped";
}

interface UploadingFileState {
  status: "uploading";
  progress: number;
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

interface DropZoneProps {
  onChange?: (url: string) => void;
  onError?: (error: string) => void;
  accept?: DropzoneOptions["accept"];
  disabled?: boolean;
  render: (props: {
    isDragActive: boolean;
    isDragAccept: boolean;
    isDragReject: boolean;
    isUploading: boolean;
    open: () => void;
    file?: FileDropItem;
    clear: () => void;
    getRootProps: DropzoneState["getRootProps"];
    getInputProps: DropzoneState["getInputProps"];
    inputRef: React.RefObject<HTMLInputElement>;
  }) => JSX.Element;
}

const DropZone = ({
  render,
  onChange,
  accept,
  onError,
  disabled = false,
}: DropZoneProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<FileDropItem | undefined>(undefined);
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    inputRef,
    isDragReject,
  } = useDropzone({
    onDrop: useCallback(
      async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;
        const file = acceptedFiles[0];
        if (!file) return;
        const previewUrl = URL.createObjectURL(file);
        // assign the preview URL to the file
        Object.assign(file, { preview: previewUrl });

        setFile({
          id: uuidv4(),
          preview: previewUrl,
          file,
          state: { status: "dropped" },
        } as FileDropItem);

        await handleUpload({
          id: uuidv4(),
          file,
          state: { status: "dropped" },
        });
      },
      [onChange],
    ),
    disabled,
    accept,
  });

  const handleUpload = async (file: FileDropItem) => {
    setIsUploading(true);
    setFile({
      ...file,
      state: {
        status: "uploading",
        progress: 0,
      },
    });

    try {
      const url = await cloudUpload({
        file: file.file,
        onUploadProgress: (progress) => {
          setFile({
            ...file,
            state: {
              status: "uploading",
              progress,
            },
          });
        },
        onUploadError: onError,
      });
      if (!url) return;
      setFile({
        ...file,
        state: {
          status: "uploaded",
          url,
        },
      });
      onChange?.(url);
    } catch (error) {
      if (error instanceof Error) {
        onError?.(error.message);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const clear = () => {};
  const open = () => {
    inputRef.current?.click();
  };

  useEffect(() => {
    return () => {
      // Revoke the preview URL when the component unmounts or the file is uploaded
      // @ts-ignore
      if (file?.file?.preview) URL.revokeObjectURL(file.file.preview);
    };
  }, [file]);

  return render({
    isDragActive,
    isDragAccept,
    file,
    isDragReject,
    isUploading,
    open,
    clear,
    getRootProps,
    getInputProps,
    inputRef,
  });
};

export default DropZone;
