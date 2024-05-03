import { ServiceSchema } from "@/lib/schemas/new-service";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const serviceRouter = createTRPCRouter({
  create: protectedProcedure
    .input(ServiceSchema)
    .mutation(async ({ ctx, input }) => {
      let service = await ctx.db.service.create({
        data: {
          name: input.name,
          description: input.description,
          duration: input.duration,
          price: input.price,
        },
      });

      if (!service) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Échec de l'enregistrement du service",
        });
      }

      return service;
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    let services = await ctx.db.service.findMany({
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
  }),
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      let service = await ctx.db.service.findUnique({
        where: {
          id: input.id,
        },
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
      });

      if (!service) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Service non trouvé",
        });
      }

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
    }),
  update: protectedProcedure
    .input(z.object({ id: z.string().optional(), data: ServiceSchema }))
    .mutation(async ({ ctx, input }) => {
      let service = await ctx.db.service.update({
        where: { id: input.id },
        data: {
          name: input.data.name,
          description: input.data.description,
          price: input.data.price,
          duration: input.data.duration,
        },
      });

      if (!service) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Échec de la mise à jour du service",
        });
      }

      return service;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      let service = await ctx.db.service.delete({
        where: { id: input.id },
      });

      if (!service) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Échec de la suppression du service",
        });
      }

      return service;
    }),
});
