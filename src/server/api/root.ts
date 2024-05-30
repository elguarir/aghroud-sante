import { appointmentRouter } from "@/server/api/routers/appointment";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user";
import { patientRouter } from "./routers/patient";
import { serviceRouter } from "./routers/service";
import { documentRouter } from "./routers/document";
import { paymentRouter } from "./routers/payment";
import { expenseRouter } from "./routers/expense";
import { analyticsRouter } from "./routers/analytics";
import { therapistRouter } from "./routers/therapist";
import { inferRouterOutputs } from "@trpc/server";

export const appRouter = createTRPCRouter({
  user: userRouter,
  appointment: appointmentRouter,
  patient: patientRouter,
  therapist: therapistRouter,
  payment: paymentRouter,
  expense: expenseRouter,
  service: serviceRouter,
  analytics: analyticsRouter,
  document: documentRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
export type RouterOutput = inferRouterOutputs<typeof appRouter>;
