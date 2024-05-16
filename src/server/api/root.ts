import { appointmentRouter } from "@/server/api/routers/appointment";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user";
import { patientRouter } from "./routers/patient";
import { serviceRouter } from "./routers/service";
import { documentRouter } from "./routers/document";
import { paymentRouter } from "./routers/payment";
import { expenseRouter } from "./routers/expense";

export const appRouter = createTRPCRouter({
  user: userRouter,
  appointment: appointmentRouter,
  patient: patientRouter,
  payment: paymentRouter,
  expense: expenseRouter,
  service: serviceRouter,
  document: documentRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
