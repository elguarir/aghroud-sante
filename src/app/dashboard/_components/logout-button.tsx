"use client";
import { Button } from "@nextui-org/button";
import { useFormStatus } from "react-dom";

const LogoutButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button
      isLoading={pending}
      type="submit"
      variant="flat"
      fullWidth
      className="mb-4"
    >
      {pending ? "Déconnexion..." : "Se déconnecter"}
    </Button>
  );
};

export default LogoutButton;
