import { appointmentRouter } from "@/server/api/routers/appointment";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user";

export const appRouter = createTRPCRouter({
  user: userRouter,
  appointment: appointmentRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
