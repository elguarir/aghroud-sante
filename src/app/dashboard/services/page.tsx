import Wrapper from "../_components/wrapper";
import { CreateServiceModal } from "./_components/create-service-modal";
import { parseAsString } from "nuqs/server";
import { getAllServices } from "@/server/api/routers/helpers/service";
import { ServiceCard } from "./_components/service-card";
import SearchBar from "./_components/search-bar";
import { Metadata } from "next";

type Props = {
  searchParams: {
    search: string;
  };
};

export const metadata: Metadata = {
  title: "Services",
  description: "Liste de tous les services",
  keywords: "services, liste, service",
};

const ServicesPage = async (props: Props) => {
  const { searchParams } = props;
  const search = parseAsString.parse(searchParams.search);
  const services = await getAllServices({ search });

  return (
    <Wrapper>
      <div className="flex h-full flex-col gap-4">
        <div className="flex items-center justify-between space-x-3">
          <div className="flex flex-col">
            <h1 className="text-xl font-semibold md:text-2xl">Services</h1>
            <p className="text-sm text-default-500">
              {services.length} service
              {services.length > 1 ? "s" : ""}
            </p>
          </div>
          <CreateServiceModal />
        </div>
        <div className="flex h-full min-h-[78dvh] flex-1 flex-col rounded-lg py-6 shadow-sm lg:py-10">
          <div className="w-full max-w-xl">
            <SearchBar search={search} />
          </div>
          <div className="flex w-full flex-col space-y-8">
            <div className="flex flex-col space-y-1.5"></div>
            <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {services.length === 0 && (
                <div className="col-span-full flex h-44 w-full items-center justify-center p-2">
                  <p className="text-center text-default-500">
                    Aucun service n'a été trouvé
                  </p>
                </div>
              )}
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default ServicesPage;
