"use client";
import DropZone from "@/components/DropZone";
import { FileUploadIcon, PhoneIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Input } from "@nextui-org/input";
import { useState } from "react";
import { CircularProgress } from "@nextui-org/progress";
import { Avatar } from "@nextui-org/avatar";
import { Button } from "@nextui-org/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { generalInfoSchema } from "@/lib/schemas/general-info";
import { api, vanilla } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { Spinner } from "@nextui-org/spinner";
import { toast } from "sonner";

type Props = {};
type FormValues = z.infer<typeof generalInfoSchema>;

const GeneralInformationForm = (props: Props) => {
  const [uploadError, setUploadError] = useState("");
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors, isLoading },
  } = useForm<FormValues>({
    resolver: zodResolver(generalInfoSchema), // Apply the zodResolver
    defaultValues: async () => {
      let data = await vanilla.user.getDetails.query();
      return {
        name: data?.name ?? "",
        email: data?.email ?? "",
        avatarUrl: data?.image ?? "",
        phoneNumber: data?.phoneNumber ?? "",
      };
    },
  });

  const updateProfile = api.user.update.useMutation();
  const avatarUrl = watch("avatarUrl");

  const onSubmit = (values: FormValues) => {
    updateProfile.mutate(values, {
      onSuccess: () => {
        toast.success("Profile updated successfully");
        router.refresh();
      },
    });
  };
  if (isLoading)
    return (
      <div className="flex h-52 w-full flex-col items-center justify-center">
        <Spinner size="md" color="current" />
      </div>
    );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <fieldset className="grid gap-y-6" disabled={updateProfile.isPending}>
        <div className="flex items-center gap-4">
          <div className="space-y-[10px]">
            <label htmlFor="profile-pic-input" className="text-small">
              Profile Picture
            </label>
            <div>
              <DropZone
                onChange={(url) => {
                  setValue("avatarUrl", url);
                }}
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
                    <div className="flex items-center gap-6">
                      <Avatar
                        src={avatarUrl}
                        classNames={{
                          base: "w-24 h-24 border-[1.6px] border-content4",
                        }}
                        radius="lg"
                      />
                      <Button
                        color="danger"
                        type="button"
                        variant="bordered"
                        onClick={() => {
                          setValue("avatarUrl", "");
                        }}
                      >
                        Remove
                      </Button>
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
            <div className="relative !mt-0 flex flex-col p-1">
              <div className="text-tiny text-foreground-400">
                <span>Accepted formats: </span>
                <span className="font-medium text-foreground-500">
                  .jpeg, .png
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-x-4 gap-y-6 lg:grid-cols-2">
          <Input
            label="Full name"
            placeholder="Your name"
            labelPlacement="outside"
            variant="bordered"
            classNames={{
              inputWrapper:
                "group-data-[focus=true]:border-primary !transition-all !duration-200",
            }}
            {...register("name")}
          />
          <Input
            label="Email"
            placeholder="Your email"
            labelPlacement="outside"
            description="Your email will can't be changed"
            readOnly
            variant="bordered"
            classNames={{
              inputWrapper:
                "group-data-[focus=true]:border-primary !transition-all !duration-200",
            }}
            {...register("email")}
          />
        </div>

        <div className="grid gap-x-4 gap-y-6">
          <Input
            label="Phone number"
            placeholder="Your phone number"
            startContent={<PhoneIcon className="h-4 w-4 text-foreground-500" />}
            labelPlacement="outside"
            variant="bordered"
            classNames={{
              inputWrapper:
                "group-data-[focus=true]:border-primary !transition-all !duration-200",
            }}
            {...register("phoneNumber")}
          />
        </div>

        <div className="flex w-full items-center justify-end">
          <Button
            isLoading={updateProfile.isPending}
            type="submit"
            color="primary"
          >
            {updateProfile.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </fieldset>
    </form>
  );
};

export default GeneralInformationForm;
