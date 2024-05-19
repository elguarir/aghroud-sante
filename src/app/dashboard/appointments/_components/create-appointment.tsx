import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";

export function CreateAppointmentModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="bordered">Add Appointement</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Appointement</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid w-full gap-4 py-4">
          <div className="">
            <Input
              variant="bordered"
              labelPlacement="outside"
              label={"Name"}
              id="name"
              value="Pedro Duarte"
              className="col-span-3"
            />
          </div>
          <div className="">
            <Input
              variant="bordered"
              labelPlacement="outside"
              label="Username"
              id="username"
              value="@peduarte"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button color="primary" type="submit">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
