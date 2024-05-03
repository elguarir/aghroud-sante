import { db } from "@/server/db";

interface getAllServicesProps {
  search: string | null;
}

export async function getAllServices({ search }: getAllServicesProps) {
  let services = await db.service.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      duration: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          appointments: true,
        },
      },
    },
    where: {
      OR: [
        {
          name: {
            contains: search || "",
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search || "",
            mode: "insensitive",
          },
        },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return services.map((service) => {
    return {
      id: service.id,
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
      appointmentsCount: service._count.appointments,
    };
  });
}

export type TGetAllServices = Awaited<ReturnType<typeof getAllServices>>;
