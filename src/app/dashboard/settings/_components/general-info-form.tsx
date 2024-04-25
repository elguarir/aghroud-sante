"use client";
import DropZone from "@/components/DropZone";
import { FileUploadIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Input } from "@nextui-org/input";
import { useState } from "react";
import { CircularProgress } from "@nextui-org/progress";
import { Avatar } from "@nextui-org/avatar";

type Props = {};

const GeneralInformationForm = (props: Props) => {
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploadError, setUploadError] = useState("");

  return (
    <form className="grid gap-y-6">
      <div className="flex items-center gap-4">
        <div className="space-y-[10px]">
          <label htmlFor="profile-pic-input" className="text-small">
            Profile Picture
          </label>
          <div>
            <DropZone
              onChange={setAvatarUrl}
              onError={setUploadError}
              accept={{
                "image/jpeg": [],
                "image/png": [],
              }}
              render={({
                isDragActive,
                isDragReject,
                file,
                isUploading,
                open,
                clear,
                getRootProps,
                getInputProps,
                inputRef,
              }) => {
                return avatarUrl ? (
                  <div>
                    <Avatar
                      src={avatarUrl}
                      classNames={{
                        base: "w-24 h-24 border-[1.6px] border-content4",
                      }}
                      radius="lg"
                    />
                  </div>
                ) : (
                  <div
                    {...getRootProps()}
                    className={cn(
                      "flex h-24 w-24 cursor-pointer items-center justify-center rounded-large border-[1.6px] border-content4 bg-content3 transition-colors duration-200 focus-within:border-primary focus-within:outline-none hover:bg-content3/80",
                      isDragActive && "border-primary",
                      isDragReject && "border-danger",
                      isUploading && "pointer-events-none",
                    )}
                  >
                    <input {...getInputProps({ id: "profile-pic-input" })} />
                    {!file && !isUploading && !avatarUrl && (
                      <span className="text-content3-foreground">
                        <FileUploadIcon className="h-8 w-8" />
                      </span>
                    )}
                    {isUploading &&
                      file &&
                      file.state.status === "uploading" && (
                        <div>
                          <CircularProgress
                            aria-label="Loading..."
                            size="lg"
                            value={file.state.progress}
                            color="secondary"
                            showValueLabel={true}
                          />
                        </div>
                      )}
                  </div>
                );
              }}
            />
          </div>
        </div>

        <div className="flex flex-col"></div>
      </div>

      <Input
        label="Full name"
        placeholder="Your name"
        labelPlacement="outside"
        variant="bordered"
        classNames={{
          inputWrapper:
            "group-data-[focus=true]:border-primary !transition-all !duration-200",
        }}
      />
      <Input
        label="Email"
        placeholder="Your email"
        labelPlacement="outside"
        readOnly
        variant="bordered"
        classNames={{
          inputWrapper:
            "group-data-[focus=true]:border-primary !transition-all !duration-200",
        }}
      />
    </form>
  );
};

export default GeneralInformationForm;
