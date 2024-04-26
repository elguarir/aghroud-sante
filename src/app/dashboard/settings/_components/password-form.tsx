"use client";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/components/icons";
import { passwordChangeSchema } from "@/lib/schemas/change-password";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {};
type FormValues = z.infer<typeof passwordChangeSchema>;

const PasswordForm = (props: Props) => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(passwordChangeSchema),
  });
  const changePassword = api.user.changePassword.useMutation();

  console.log("errors", errors);
  const onSubmit = (values: FormValues) => {
    changePassword.mutate(values, {
      onSuccess: () => {
        toast.success("Password updated successfully");
        setValue("oldPassword", "");
        setValue("newPassword", "");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <fieldset disabled={changePassword.isPending} className="grid gap-y-6">
        <Input
          label="Current Password"
          placeholder="Enter your current password"
          type={isVisible ? "text" : "password"}
          variant="bordered"
          labelPlacement="outside"
          isRequired
          description="Confirming your current password is required to update your password."
          classNames={{
            inputWrapper:
              "group-data-[focus=true]:border-primary !transition-all !duration-200",
          }}
          errorMessage={errors.oldPassword?.message}
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
            >
              {isVisible ? (
                <EyeSlashFilledIcon className="pointer-events-none text-2xl text-default-400" />
              ) : (
                <EyeFilledIcon className="pointer-events-none text-2xl text-default-400" />
              )}
            </button>
          }
          {...register("oldPassword")}
        />
        <Input
          label="New Password"
          placeholder="Enter your new password"
          type={isVisible ? "text" : "password"}
          variant="bordered"
          labelPlacement="outside"
          isRequired
          classNames={{
            inputWrapper:
              "group-data-[focus=true]:border-primary !transition-all !duration-200",
          }}
          errorMessage={errors.newPassword?.message}
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
            >
              {isVisible ? (
                <EyeSlashFilledIcon className="pointer-events-none text-2xl text-default-400" />
              ) : (
                <EyeFilledIcon className="pointer-events-none text-2xl text-default-400" />
              )}
            </button>
          }
          {...register("newPassword")}
        />
        <div className="flex w-full items-center justify-end">
          <Button
            isLoading={changePassword.isPending}
            type="submit"
            color="primary"
          >
            {changePassword.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </fieldset>
    </form>
  );
};

export default PasswordForm;
