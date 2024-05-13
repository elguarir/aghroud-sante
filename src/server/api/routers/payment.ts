import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { PaymentSchema } from "@/lib/schemas/new-payment";
import { Prisma } from "@prisma/client";

export const paymentRouter = createTRPCRouter({
  create: protectedProcedure
    .input(PaymentSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        let payment = await ctx.db.payment.create({
          data: {
            label: input.label,
            notes: input.notes,
            isPaid: input.isPaid,
            numberOfSessions: input.numberOfSessions,
            paymentMethod: input.paymentMethod,
            amount: input.amount,
            paymentDate: input.paymentDate,
            patientId: input.patientId,
          },
          include: {
            patient: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phoneNumber: true,
              },
            },
          },
        });
        return payment;
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError)
          if (error.code === "P2002") {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Ce paiement existe déjà",
            });
          }
      }
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.payment.findMany({
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
    });
  }),
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      let payment = await ctx.db.payment.findUnique({
        where: {
          id: input.id,
        },
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phoneNumber: true,
            },
          },
        },
      });

      if (!payment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Paiement introuvable",
        });
      }

      return payment;
    }),
  update: protectedProcedure
    .input(z.object({ id: z.string(), data: PaymentSchema }))
    .mutation(async ({ ctx, input }) => {
      let payment = await ctx.db.payment.update({
        where: {
          id: input.id,
        },
        data: {
          label: input.data.label,
          notes: input.data.notes,
          isPaid: input.data.isPaid,
          numberOfSessions: input.data.numberOfSessions,
          paymentMethod: input.data.paymentMethod,
          amount: input.data.amount,
          paymentDate: input.data.paymentDate,
          patientId: input.data.patientId,
        },
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phoneNumber: true,
            },
          },
        },
      });

      return payment;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      let payment = await ctx.db.payment.delete({
        where: {
          id: input.id,
        },
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phoneNumber: true,
            },
          },
        },
      });

      return payment;
    }),
});
