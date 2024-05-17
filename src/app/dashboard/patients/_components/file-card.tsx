"use client";
import {
  DefaultExtensionType,
  FileIcon as ReactFileIcon,
  defaultStyles,
} from "react-file-icon";
import { DownloadIcon, TrashIcon } from "@/components/icons";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { Progress } from "@nextui-org/progress";
import { FileDropItem } from "@/types";
import { Tooltip } from "@nextui-org/tooltip";
import { formatBytes, getExtension } from "@/lib/utils";
import { Spinner } from "@nextui-org/spinner";
import { api, vanilla } from "@/trpc/react";
import { useState } from "react";
import { EyeOpenIcon } from "@radix-ui/react-icons";
import { EyeIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@nextui-org/modal";

interface FileCardProps extends FileDropItem {
  remove: () => void;
}

export const FileCard = ({ file, state, remove }: FileCardProps) => {
  const regex = /[^.]+$/;
  const extention = getExtension(file.type) || "." + regex.exec(file.name)?.[0];
  const name = file.name.split(".").slice(0, -1).join(".");
  const styles = {
    ...(defaultStyles[extention.split(".")[1] as keyof typeof defaultStyles] ||
      defaultStyles),
  };
  const getDocumentUrlMutation = api.document.getDocumentUrl.useMutation();

  return (
    <div className="flex w-full flex-col rounded-medium border border-content3 px-3 py-2">
      <div className="flex h-full w-full flex-1 items-center">
        {/* file info */}
        <div className="flex w-full items-center space-x-2">
          <div className="flex h-8 w-8 items-center">
            {/* <ReactFileIcon
              extension={extention.split(".")[1]}
              {...styles}
              color={styles.color || "var(--file-icon-color)"}
              glyphColor={
                styles.glyphColor || "var(--file-icon-color-secondary)"
              }
              foldColor={styles.foldColor || "var(--file-icon-color-secondary)"}
              labelColor={styles.labelColor || "var(--file-icon-color-label)"}
              labelTextColor={styles.labelTextColor || "white"}
              radius={styles.radius || 3}
            /> */}
            <FileIcon filename={file.name} contentType={file.type} />
          </div>
          <div className="grid w-full">
            <div className="line-clamp-1 text-sm font-medium text-content4-foreground">
              {name}
            </div>
            <div className="flex w-full items-center justify-between space-x-2 text-tiny text-default-500">
              <div className="flex items-center space-x-1">
                <span>{extention}</span>
                <Divider orientation="vertical" className="h-2" />
                <span>
                  {formatBytes(file.size, {
                    sizeType: "normal",
                  })}
                </span>
              </div>
              {state.status === "uploading" && <span>{state.progress}%</span>}
            </div>
          </div>
        </div>
        {/* actions */}
        <div className="ml-auto flex items-center gap-1.5 pl-3">
          {state.status === "dropped" ? (
            <>
              <Tooltip size="sm" content="Supprimer" delay={0} closeDelay={0}>
                <Button onClick={remove} size="sm" variant="light" isIconOnly>
                  <TrashIcon className="h-3.5 w-3.5" />
                </Button>
              </Tooltip>
            </>
          ) : state.status === "uploading" ? (
            <div className="ml-2">
              <Spinner size="sm" className="animate-spin" color="current" />
            </div>
          ) : (
            state.status === "uploaded" && (
              <>
                <Button
                  size="sm"
                  variant="flat"
                  isIconOnly
                  className="text-xs"
                  isLoading={getDocumentUrlMutation.isPending}
                  onClick={() => {
                    getDocumentUrlMutation.mutate(
                      { key: state.key },
                      {
                        onSuccess: (data) => {
                          window.open(data.url, "_blank");
                        },
                      },
                    );
                  }}
                >
                  <DownloadIcon className="h-[16px] w-[16px]" />
                </Button>
                <Button
                  onClick={remove}
                  size="sm"
                  variant="flat"
                  isIconOnly
                  className="text-xs"
                >
                  <TrashIcon className="h-[17px] w-[17px]" />
                </Button>
              </>
            )
          )}
        </div>
      </div>
      {state.status === "uploading" && (
        <div className="mt-1.5 w-full">
          <Progress
            classNames={{
              base: "gap-0 !m-0",
            }}
            aria-label="upload progress"
            value={state.progress}
            // disableAnimation
            size="sm"
          />
        </div>
      )}
    </div>
  );
};

interface FileIconProps {
  filename: string;
  contentType: string;
}

const FileIcon = ({ filename, contentType }: FileIconProps) => {
  const regex = /[^.]+$/;
  const extention =
    getExtension(contentType) || "." + regex.exec(filename)?.[0];
  const styles = {
    ...(defaultStyles[extention.split(".")[1] as keyof typeof defaultStyles] ||
      defaultStyles),
  };

  return (
    <ReactFileIcon
      extension={extention}
      {...styles}
      color={styles.color || "var(--file-icon-color)"}
      glyphColor={styles.glyphColor || "var(--file-icon-color-secondary)"}
      foldColor={styles.foldColor || "var(--file-icon-color-secondary)"}
      labelColor={styles.labelColor || "var(--file-icon-color-label)"}
      labelTextColor={styles.labelTextColor || "white"}
      radius={styles.radius || 3}
    />
  );
};

interface FileCardPreviewProps {
  onDelete: () => void;
  filename: string;
  fileSize: number;
  contentType: string;
  fileKey: string;
}
export const FileCardPreview = (props: FileCardPreviewProps) => {
  const regex = /[^.]+$/;
  const extention =
    getExtension(props.contentType) || "." + regex.exec(props.filename)?.[0];
  const getDocumentUrlMutation = api.document.getDocumentUrl.useMutation();
  const getPreviewUrlMutation = api.document.getDocumentUrl.useMutation();
  const [preview, setPreview] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const isImage = props.contentType.includes("image");
  
  return (
    <div className="flex w-full flex-col rounded-medium border border-content3 px-3 py-2">
      <Modal
        shouldBlockScroll
        isOpen={preview}
        onOpenChange={setPreview}
        placement="center"
        backdrop="blur"
        classNames={{
          base: "md:max-h-[85dvh]",
          wrapper: "overflow-hidden",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <div className="custom-scrollbar max-h-[90dvh] max-w-[95%] overflow-y-auto p-1">
              <div className="rounded-md">
                <ModalHeader className="flex flex-col gap-1">
                  <p className="leading-tight">{props.filename}</p>
                </ModalHeader>
                <ModalBody>
                  <div className="flex items-center justify-center pb-4">
                    <div className="flex justify-center w-full h-full min-h-64 items-center">
                      {previewUrl ? (
                        <img
                          className="max-w-full rounded object-fill"
                          src={previewUrl}
                          alt={props.filename}
                        />
                      ) : (
                        <p className="text-sm  text-default-500">
                          Aucun aperçu disponible pour ce fichier
                        </p>
                      )}
                    </div>
                  </div>
                </ModalBody>
              </div>
            </div>
          )}
        </ModalContent>
      </Modal>
      <div className="flex h-full w-full flex-1 items-center">
        {/* file info */}
        <div className="flex w-full items-center space-x-2">
          <div className="flex h-8 w-8 items-center">
            <FileIcon
              filename={props.filename}
              contentType={props.contentType}
            />
          </div>
          <div className="grid w-full">
            <div className="line-clamp-1 text-sm font-medium text-content4-foreground">
              {props.filename}
            </div>
            <div className="flex w-full items-center justify-between space-x-2 text-tiny text-default-500">
              <div className="flex items-center space-x-1">
                <span>{extention}</span>
                <Divider orientation="vertical" className="h-2" />
                <span>
                  {formatBytes(props.fileSize, {
                    sizeType: "normal",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* actions */}
        <div className="ml-auto flex items-center gap-1.5 pl-3">
          <>
            {isImage && (
              <Button
                size="sm"
                variant="flat"
                isIconOnly
                className="text-xs"
                isLoading={getPreviewUrlMutation.isPending}
                onClick={() => {
                  getPreviewUrlMutation.mutate(
                    { key: props.fileKey },
                    {
                      onSuccess: (data) => {
                        setPreviewUrl(data.url);
                        setPreview(true);
                      },
                    },
                  );
                }}
              >
                <EyeIcon className="h-[16px] w-[16px]" />
              </Button>
            )}
            <Button
              size="sm"
              variant="flat"
              isIconOnly
              className="text-xs"
              isLoading={getDocumentUrlMutation.isPending}
              onClick={() => {
                getDocumentUrlMutation.mutate(
                  { key: props.fileKey },
                  {
                    onSuccess: (data) => {
                      window.open(data.url, "_blank");
                    },
                  },
                );
              }}
            >
              <DownloadIcon className="h-[16px] w-[16px]" />
            </Button>
            <Button
              onClick={props.onDelete}
              size="sm"
              variant="flat"
              isIconOnly
              className="text-xs"
            >
              <TrashIcon className="h-[17px] w-[17px]" />
            </Button>
          </>
        </div>
      </div>
    </div>
  );
};
