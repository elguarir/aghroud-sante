import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { ExpenseSchema } from "@/lib/schemas/new-expense";

export const expenseRouter = createTRPCRouter({
  create: protectedProcedure
    .input(ExpenseSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        let expense = await ctx.db.expense.create({
          data: {
            label: input.label,
            amount: input.amount,
            expenseDate: input.expenseDate,
            type: input.type,
            notes: input.notes,
          },
        });
        return expense;
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Une erreur s'est produite lors de la création de la dépense",
        });
      }
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.expense.findMany();
  }),
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.expense.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
  update: protectedProcedure
    .input(z.object({ id: z.string(), data: ExpenseSchema }))
    .mutation(async ({ ctx, input }) => {
      try {
        let expense = await ctx.db.expense.update({
          where: {
            id: input.id,
          },
          data: {
            label: input.data.label,
            amount: input.data.amount,
            expenseDate: input.data.expenseDate,
            type: input.data.type,
            notes: input.data.notes,
          },
        });
        return expense;
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Une erreur s'est produite lors de la mise à jour de la dépense",
        });
      }
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.expense.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
