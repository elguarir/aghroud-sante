import { appointmentRouter } from "@/server/api/routers/appointment";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user";
import { patientRouter } from "./routers/patient";

export const appRouter = createTRPCRouter({
  user: userRouter,
  appointment: appointmentRouter,
  patient: patientRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
