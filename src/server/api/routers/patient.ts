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
});
