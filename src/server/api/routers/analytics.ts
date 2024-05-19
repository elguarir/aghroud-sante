import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const analyticsRouter = createTRPCRouter({
  getRevenueByMonth: publicProcedure
    .input(z.object({ year: z.number() }))
    .query(async ({ ctx, input }) => {
        
    }),
});
