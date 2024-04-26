import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { generalInfoSchema } from "@/lib/schemas/general-info";
import { passwordChangeSchema } from "@/lib/schemas/change-password";
import bcrypt from "bcrypt";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  getDetails: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        image: true,
      },
    });
  }),
  update: protectedProcedure
    .input(generalInfoSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          name: input.name,
          phoneNumber: input.phoneNumber,
          image: input.avatarUrl,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          image: true,
        },
      });
    }),
  changePassword: protectedProcedure
    .input(passwordChangeSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const valid = await bcrypt.compare(input.oldPassword, user.password);

      if (!valid) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Old password is incorrect",
        });
      }

      const hashedPassword = await bcrypt.hash(input.newPassword, 10);

      return await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          password: hashedPassword,
        },
      });
    }),
});
