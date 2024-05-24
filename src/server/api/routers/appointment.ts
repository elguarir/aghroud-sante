import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { AppointmentSchema } from "@/lib/schemas/new-appointment";
import { TRPCError } from "@trpc/server";

export const appointmentRouter = createTRPCRouter({
  create: publicProcedure
    .input(AppointmentSchema)
    .mutation(async ({ ctx, input }) => {
      let appointment = await ctx.db.appointment.create({
        data: {
          patientId: input.patientId,
          therapistId: input.therapistId,
          serviceId: input.serviceId,
          startTime: input.startTime,
          endTime: input.endTime,
          status: input.status,
          notes: input.notes,
          floor: input.floor,
        },
      });

      if (!appointment) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Il y a eu un problème lors de la création de rendez-vous. Veuillez réessayer.",
        });
      }

      return appointment;
    }),
  update: publicProcedure
    .input(z.object({ id: z.string(), data: AppointmentSchema }))
    .mutation(async ({ ctx, input }) => {
      let appointment = await ctx.db.appointment.update({
        where: { id: input.id },
        data: {
          patientId: input.data.patientId,
          therapistId: input.data.therapistId,
          serviceId: input.data.serviceId,
          startTime: input.data.startTime,
          endTime: input.data.endTime,
          status: input.data.status,
          notes: input.data.notes,
          floor: input.data.floor,
        },
      });

      if (!appointment) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Il y a eu un problème lors de la mise à jour de rendez-vous. Veuillez réessayer.",
        });
      }

      return appointment;
    }),
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.appointment.findUnique({
        where: { id: input.id },
      });
    }),
  all: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.appointment.findMany({
      select: {
        id: true,
        startTime: true,
        endTime: true,
        status: true,
        notes: true,
        floor: true,
        createdAt: true,
        updatedAt: true,
        patient: {
          select: {
            id: true,
            phoneNumber: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        therapist: {
          select: {
            id: true,
            name: true,
            image: true,
            speciality: true,
            createdAt: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            price: true,
            duration: true,
            createdAt: true,
          },
        },
      },
    });
  }),
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.appointment.delete({
        where: { id: input.id },
      });
    }),
  checkAvailability: publicProcedure
    .input(
      z.object({ therapistId: z.string().optional(), startTime: z.date() }),
    )
    .query(async ({ ctx, input }) => {
      // Check if the therapist is available at the given time
      let res = await ctx.db.appointment.findMany({
        where: {
          therapistId: input.therapistId,
          startTime: {
            lte: input.startTime,
          },
          endTime: {
            gte: input.startTime,
          },
        },
      });
    }),
});
