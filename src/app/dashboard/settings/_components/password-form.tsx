"use client";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/components/icons";
import { Input } from "@nextui-org/input";
import React, { useState } from "react";

type Props = {};

const PasswordForm = (props: Props) => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <form className="grid gap-y-6">
      <Input
        label="Current Password"
        placeholder="Enter your current password"
        type={isVisible ? "text" : "password"}
        variant="bordered"
        labelPlacement="outside"
        description="Confirming your current password is required to update your password."
        classNames={{
          inputWrapper:
            "group-data-[focus=true]:border-primary !transition-all !duration-200",
        }}
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
      />
      <Input
        label="New Password"
        placeholder="Enter your new password"
        type={isVisible ? "text" : "password"}
        variant="bordered"
        labelPlacement="outside"
        classNames={{
          inputWrapper:
            "group-data-[focus=true]:border-primary !transition-all !duration-200",
        }}
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
      />
    </form>
  );
};

export default PasswordForm;
