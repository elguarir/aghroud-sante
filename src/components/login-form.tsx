"use client";
import {
  EyeFilledIcon,
  EyeSlashFilledIcon,
  MailIcon,
} from "@/components/icons";
import { authenticate } from "@/server/auth/actions";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Checkbox } from "@nextui-org/checkbox";
import { Input } from "@nextui-org/input";
import { Link } from "@nextui-org/link";
import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Callout from "./ui/callout";

export const LoginForm = () => {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);

  return (
    <Card shadow="sm" className="w-full">
      <CardHeader className="flex flex-col items-start space-y-1 p-6">
        <h3 className="text-large font-semibold leading-none tracking-tight">
          Connectez-vous
        </h3>
        <p className="text-small text-default-500">
          Connectez-vous à votre compte pour continuer
        </p>
      </CardHeader>
      <CardBody className="p-6 pt-1">
        <form className="flex flex-col gap-6" action={dispatch}>
          <Input
            label="Email"
            name="email"
            id="email"
            isRequired
            classNames={{
              inputWrapper:
                "group-data-[focus=true]:border-primary !transition-all !duration-200",
            }}
            autoComplete="off"
            validate={(value) => {
              if (!value.includes("@")) {
                return "S'il vous plaît, entrez une adresse email valide.";
              }
            }}
            validationBehavior="native"
            placeholder="Enter your email"
            variant="bordered"
            labelPlacement="outside"
            endContent={
              <MailIcon className="pointer-events-none flex-shrink-0 text-2xl text-default-400" />
            }
          />
          <Input
            label="Mot de passe"
            name="password"
            id="password"
            isRequired
            classNames={{
              inputWrapper:
                "group-data-[focus=true]:border-primary !transition-all !duration-200",
            }}
            autoComplete="off"
            placeholder="Enter your password"
            type={isVisible ? "text" : "password"}
            variant="bordered"
            labelPlacement="outside"
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
          <div className="flex flex-col gap-2">
            <div className="flex w-full justify-end px-1 py-2">
              {/* <Checkbox
                classNames={{
                  label: "text-small",
                }}
                name="remember"
              >
                Remember me
              </Checkbox> */}
              <Link color="primary" href="/forgot-password" size="sm">
                Forgot password?
              </Link>
            </div>
            {errorMessage && (
              <Callout variant={"danger"}>
                <p>{errorMessage}</p>
              </Callout>
            )}
            <div>
              <LoginButton />
            </div>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};

const LoginButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button isLoading={pending} type="submit" fullWidth color="primary">
      {pending ? "Signin in..." : "Sign in"}
    </Button>
  );
};
