import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { PatientSchema } from "@/lib/schemas/new-patient";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { TherapistSchema } from "@/lib/schemas/new-therapist";

export const therapistRouter = createTRPCRouter({
  register: protectedProcedure
    .input(TherapistSchema)
    .mutation(async ({ ctx, input }) => {
      let therapist = await ctx.db.therapist.create({
        data: {
          name: input.name,
          speciality: input.speciality,
          image:
            input.image === "" || !input.image
              ? `https://api.dicebear.com/8.x/initials/svg?fontSize=40&seed=${encodeURIComponent(input.name!)}`
              : input.image,
        },
      });

      if (!therapist) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erreur lors de la création du thérapeute",
        });
      }

      return therapist;
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    let therapists = await ctx.db.therapist.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        speciality: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return therapists;
  }),
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.therapist.findUnique({
        where: { id: input.id },
      });
    }),
  update: protectedProcedure
    .input(z.object({ id: z.string(), data: TherapistSchema }))
    .mutation(async ({ ctx, input }) => {
      let therapist = await ctx.db.therapist.update({
        where: { id: input.id },
        data: {
          name: input.data.name,
          speciality: input.data.speciality,
          image: input.data.image,
        },
      });

      if (!therapist) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erreur lors de la mise à jour du thérapeute",
        });
      }

      return therapist;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      let therapist = await ctx.db.therapist.delete({
        where: { id: input.id },
      });

      if (!therapist) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Erreur lors de la suppression du thérapeute",
        });
      }

      return therapist;
    }),
});
