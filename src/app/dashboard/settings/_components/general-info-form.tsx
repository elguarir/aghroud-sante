"use client";
import {
  EyeFilledIcon,
  EyeSlashFilledIcon,
} from "@/components/icons";
import { Input } from "@nextui-org/input";
import React, { useState } from "react";

type Props = {};

const GeneralInformationForm = (props: Props) => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  
  return (
    <form className="grid gap-y-6">
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
      <Input
        label="Password"
        placeholder="Enter your password"
        type={isVisible ? "text" : "password"}
        labelPlacement="outside"
        variant="bordered"
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

export default GeneralInformationForm;
