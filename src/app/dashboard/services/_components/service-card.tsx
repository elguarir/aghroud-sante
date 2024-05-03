import { TGetAllServices } from "@/server/api/routers/helpers/service";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { EditServiceModal } from "./edit-service-modal";
import { Button } from "@nextui-org/button";
import {
  CalendarIcon,
  ClockIcon,
  DollarIcon,
  EditIcon,
  TrashIcon,
} from "@/components/icons";
import { DeleteServiceButton } from "./delete-service-button";

interface ServiceCardProps {
  service: TGetAllServices[0];
}

export const ServiceCard = ({ service }: ServiceCardProps) => {
  return (
    <Card shadow="sm" className="p-2">
      <CardHeader className="flex flex-col items-start space-y-1 !py-2 px-3">
        <div className="flex w-full justify-between gap-x-2">
          <h2 className="line-clamp-2 text-large font-semibold leading-tight lg:text-xl">
            {service.name}
          </h2>
          <div className="hidden flex-nowrap space-x-1 md:flex">
            <EditServiceModal serviceId={service.id}>
              <Button variant="bordered" isIconOnly>
                <EditIcon className="h-4 w-4" />
              </Button>
            </EditServiceModal>
            <DeleteServiceButton
              variant="flat"
              color="danger"
              isIconOnly
              serviceId={service.id}
              popoverPlacement="bottom"
              popoverClassnames={{
                content: "hidden md:block",
              }}
            >
              <TrashIcon className="h-4 w-4" />
            </DeleteServiceButton>
          </div>
        </div>
      </CardHeader>
      <CardBody className="pb-2 pt-0">
        <ul className="flex w-full flex-col space-y-1.5 text-small text-default-500 2xl:text-medium">
          <li className="flex w-full items-center gap-2">
            <ClockIcon className="h-4 w-4 2xl:h-5 2xl:w-5" />
            <div>
              <span className="font-medium">{service.duration}</span> min
            </div>
          </li>
          <li className="flex w-full items-center gap-2">
            <DollarIcon className="h-4 w-4 2xl:h-5 2xl:w-5" />
            <div>
              <span className="font-medium">
                {service.price?.toLocaleString("fr-FR", {
                  minimumFractionDigits: 2,
                })}
              </span>{" "}
              MAD
            </div>
          </li>
          <li className="flex w-full items-center gap-2">
            <CalendarIcon className="h-4 w-4 2xl:h-5 2xl:w-5" />
            <div>
              <span className="font-medium">{service.appointmentsCount}</span>{" "}
              Rendez-vous
            </div>
          </li>
        </ul>
      </CardBody>
      <CardFooter className="flex w-full items-center gap-2 md:hidden">
        <EditServiceModal serviceId={service.id}>
          <Button
            startContent={<EditIcon className="h-4 w-4" />}
            variant="bordered"
            fullWidth
          >
            Modifier
          </Button>
        </EditServiceModal>
        <DeleteServiceButton
          startContent={<TrashIcon className="h-4 w-4" />}
          variant="flat"
          color="danger"
          fullWidth
          serviceId={service.id}
          popoverPlacement="top"
          popoverClassnames={{
            content: "md:hidden",
          }}
        >
          Supprimer
        </DeleteServiceButton>
      </CardFooter>
    </Card>
  );
};
