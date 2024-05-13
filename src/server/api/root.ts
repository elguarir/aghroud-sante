import { appointmentRouter } from "@/server/api/routers/appointment";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user";
import { patientRouter } from "./routers/patient";
import { serviceRouter } from "./routers/service";
import { documentRouter } from "./routers/document";
import { paymentRouter } from "./routers/payment";

export const appRouter = createTRPCRouter({
  user: userRouter,
  appointment: appointmentRouter,
  patient: patientRouter,
  payment: paymentRouter,
  service: serviceRouter,
  document: documentRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
