import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { PatientSchema } from "@/lib/schemas/new-patient";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const patientRouter = createTRPCRouter({
  register: protectedProcedure
    .input(PatientSchema)
    .mutation(async ({ ctx, input }) => {
      let patient = await ctx.db.patient.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          phoneNumber: input.phoneNumber,
          dateOfBirth: input.dateOfBirth
            ? new Date(input.dateOfBirth)
            : undefined,
          email: input.email,
          address: input.address,
          insuranceProvider: input.insuranceProvider,
          notes: input.notes,
        },
      });

      if (!patient) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Échec de l'enregistrement du patient",
        });
      }

      return patient;
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    let patients = await ctx.db.patient.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        dateOfBirth: true,
        email: true,
        address: true,
        insuranceProvider: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            appointments: true,
          },
        },
      },
    });

    return patients.map((patient) => {
      return {
        id: patient.id,
        firstName: patient.firstName,
        lastName: patient.lastName,
        phoneNumber: patient.phoneNumber,
        dateOfBirth: patient.dateOfBirth,
        email: patient.email,
        address: patient.address,
        insuranceProvider: patient.insuranceProvider,
        notes: patient.notes,
        createdAt: patient.createdAt,
        updatedAt: patient.updatedAt,
        appointmentsCount: patient._count.appointments,
      };
    });
  }),
  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.patient.findUnique({
        where: { id: input.id },
      });
    }),
  update: protectedProcedure
    .input(z.object({ id: z.number().optional(), data: PatientSchema }))
    .mutation(async ({ ctx, input }) => {
      let patient = await ctx.db.patient.update({
        where: { id: input.id },
        data: {
          firstName: input.data.firstName,
          lastName: input.data.lastName,
          phoneNumber: input.data.phoneNumber,
          dateOfBirth: input.data.dateOfBirth
            ? new Date(input.data.dateOfBirth)
            : undefined,
          email: input.data.email,
          address: input.data.address,
          insuranceProvider: input.data.insuranceProvider,
          notes: input.data.notes,
        },
      });

      if (!patient) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Échec de la mise à jour du patient",
        });
      }

      return patient;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      let patient = await ctx.db.patient.delete({
        where: { id: input.id },
      });

      if (!patient) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Échec de la suppression du patient",
        });
      }

      return patient;
    }),
});
