import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { AppointmentSchema } from "@/lib/schemas/new-appointment";
import { TRPCError } from "@trpc/server";
import { endOfDay, startOfDay } from "date-fns";

export const appointmentRouter = createTRPCRouter({
  create: protectedProcedure
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
  update: protectedProcedure
    .input(z.object({ id: z.string(), data: AppointmentSchema }))
    .mutation(async ({ ctx, input }) => {
      let appointment = await ctx.db.appointment.update({
        where: { id: input.id },
        data: {
          patientId: input.data.patientId,
          therapistId: input.data.therapistId ?? null,
          serviceId: input.data.serviceId ?? null,
          startTime: input.data.startTime,
          endTime: input.data.endTime,
          status: input.data.status,
          notes: input.data.notes ?? "",
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
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.appointment.findUnique({
        where: { id: input.id },
      });
    }),
  all: protectedProcedure.query(async ({ ctx }) => {
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
      orderBy: {
        startTime: "asc",
      },
    });
  }),
  allWithFilter: protectedProcedure
    .input(z.object({ date: z.date() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.appointment.findMany({
        where: {
          startTime: {
            gte: startOfDay(input.date),
            lt: endOfDay(input.date),
          },
        },
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
        orderBy: {
          startTime: "asc",
        },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.appointment.delete({
        where: { id: input.id },
      });
    }),
  checkTherapistAvailability: protectedProcedure
    .input(
      z.object({
        therapistId: z.string().optional(),
        startTime: z.date(),
      }),
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
        orderBy: {
          startTime: "desc",
        },
      });
    }),
  checkTimeAvailability: protectedProcedure
    .input(
      z.object({
        floor: z.number().optional(),
        startTime: z.date(),
        endTime: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // check if the time is available for the given floor
      const conflictingAppointments = await ctx.db.appointment.findMany({
        where: {
          floor: input.floor,
          AND: [
            {
              startTime: {
                lt: input.endTime,
              },
            },
            {
              endTime: {
                gt: input.startTime,
              },
            },
            {
              status: {
                not: "CANCELLED",
              },
            },
          ],
        },
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
              firstName: true,
              lastName: true,
              phoneNumber: true,
            },
          },
          therapist: {
            select: {
              id: true,
              name: true,
              image: true,
              speciality: true,
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

      return {
        isAvailable: conflictingAppointments.length === 0,
        conflicts: conflictingAppointments,
      };
    }),
});
