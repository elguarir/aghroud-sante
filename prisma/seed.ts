import { ExpenseType, PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import type { Patient, Prisma, Service, Therapist } from "@prisma/client";
import { addMinutes } from "date-fns";
const prisma = new PrismaClient();

const numberOfPayments = 100;
const numberOfPatients = 100;
const numberOfExpenses = 90;
const numberOfTherapists = 10;
const numberOfAppointments = 100;

async function seedPayments(patients?: Patient[]) {
  const payments = [];
  const paymentLabels = ["appointment", "service", "product", "advance"];
  const paymentMethods = ["cash", "transfer", "check", "other"];
  const possiblePatients =
    patients?.map((p) => p.id) ||
    (await prisma.patient.findMany()).map((p) => p.id);

  for (let i = 0; i < numberOfPayments; i++) {
    const payment = {
      id: faker.string.nanoid(8),
      patientId: faker.helpers.arrayElement(possiblePatients),
      label: faker.helpers.arrayElement(paymentLabels),
      amount: parseInt(faker.finance.amount({ min: 150, max: 1200, dec: 0 })),
      numberOfSessions: faker.number.int({ min: 1, max: 10 }),
      paymentDate: faker.date.recent({
        days: 360,
        refDate: new Date("2024-06-31"),
      }),
      paymentMethod: faker.helpers.arrayElement(paymentMethods),
      isPaid: faker.datatype.boolean(0.75),
      notes: faker.lorem.sentence(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    payments.push(payment);
  }

  await prisma.payment.createMany({
    data: payments,
  });

  console.log(`Created ${numberOfPayments} payment records`);
}

async function seedPatients() {
  const patients = [];

  for (let i = 0; i < numberOfPatients; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const patient = {
      firstName,
      lastName,
      email: faker.internet
        .email({
          firstName,
          lastName,
        })
        .toLowerCase(),
      dateOfBirth: faker.date.past({
        refDate: new Date("2008-01-01"),
        years: 30,
      }),
      phoneNumber: "+212" + faker.string.numeric({ length: 9 }),
      address: faker.location.streetAddress(),
      notes: faker.lorem.sentences(),
      insuranceProvider: faker.company.name(),
      createdAt: faker.date.recent({
        days: 360,
        refDate: new Date("2024-06-31"),
      }),
      updatedAt: new Date(),
    };
    patients.push(patient);
  }

  await prisma.patient.createMany({
    data: patients,
  });

  console.log(`Created ${numberOfPatients} patient records`);
}

async function seedExpenses() {
  const expenses = [];
  const expenseTypes = [
    "OPERATIONAL",
    "SALARY",
    "EQUIPMENT",
    "UTILITIES",
    "RENT",
    "OTHER",
  ];
  for (let i = 0; i < numberOfExpenses; i++) {
    const expense = {
      label: faker.company.buzzPhrase(),
      amount: parseInt(faker.finance.amount({ min: 80, max: 300, dec: 0 })),
      expenseDate: faker.date.recent({
        days: 360,
        refDate: new Date("2024-06-31"),
      }),
      type: faker.helpers.arrayElement(expenseTypes) as ExpenseType,
      notes: faker.lorem.sentence(),
      createdAt: faker.date.recent({
        days: 360,
        refDate: new Date("2024-06-31"),
      }),
    };
    expenses.push(expense);
  }

  await prisma.expense.createMany({
    data: expenses,
  });

  console.log(`Created ${numberOfExpenses} expense records`);
}

async function seedTherapists() {
  const therapists = [];

  for (let i = 0; i < numberOfTherapists; i++) {
    const therapist = {
      name: faker.person.fullName(),
      image: faker.image.avatar(),
      speciality: faker.person.jobType(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    therapists.push(therapist);
  }
  await prisma.therapist.createMany({
    data: therapists,
  });

  console.log(`Created ${numberOfTherapists} therapist records`);
}

async function seedAppointments(
  therapists?: Therapist[],
  patients?: Patient[],
  services?: Service[],
) {
  const appointments = [];

  const possibleTherapists =
    therapists?.map((t) => t.id) ||
    (await prisma.therapist.findMany()).map((t) => t.id);
  const possiblePatients =
    patients?.map((p) => p.id) ||
    (await prisma.patient.findMany()).map((p) => p.id);
  const possibleServices =
    services?.map((s) => s.id) ||
    (await prisma.service.findMany()).map((s) => s.id);
  // range of dates for appointments

  for (let i = 0; i < numberOfAppointments; i++) {
    const startDate = faker.date.recent({
      days: 150,
      refDate: new Date("2024-06-31"),
    });
    const startAppointment = faker.date.between({
      from: new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate(),
        8,
        0,
      ),
      to: new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate(),
        16,
        0,
      ),
    });
    const possibleDurations = [30, 45, 60, 75, 90, 120];
    const endAppointment = addMinutes(
      startAppointment.setMinutes(0),
      faker.helpers.arrayElement(possibleDurations),
    );

    const appointment = {
      patientId: faker.helpers.arrayElement(possiblePatients),
      therapistId: faker.helpers.arrayElement(possibleTherapists),
      serviceId: faker.helpers.arrayElement(possibleServices),
      startTime: new Date(startAppointment.setMinutes(0)),
      endTime: endAppointment,
      floor: faker.number.int({ min: 1, max: 3 }),
      notes: faker.lorem.sentence(),
      status: faker.helpers.arrayElement(["PENDING", "CONFIRMED", "CANCELLED"]),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Prisma.AppointmentCreateManyInput;

    appointments.push(appointment);
  }

  await prisma.appointment.createMany({
    data: appointments,
  });

  console.log(`Created ${numberOfAppointments} appointment records`);
}

async function main() {
  // get the --table argument
  const table = process.argv[2]?.split("=")[1];
  if (table === "all" || !table) {
    /**
     * seed all tables
     * 6. seed services (optional)
     * 1. seed patients
     * 2. seed payments
     * 3. seed expenses
     * 4. seed therapists
     * 5. seed appointments
     */

    await seedPatients();
    await seedPayments();
    await seedExpenses();
    await seedTherapists();
    await seedAppointments();
  }

  if (table === "patients") {
    console.log("seeding patients");
    await seedPatients();
  }
  if (table === "payments") {
    console.log("seeding payments");
    await seedPayments();
  }
  if (table === "expenses") {
    console.log("seeding expenses");
    await seedExpenses();
  }
  if (table === "therapists") {
    console.log("seeding therapists");
    await seedTherapists();
  }

  if (table === "appointments") {
    console.log("seeding appointments");
    await seedAppointments();
  }

  // example command: pnpm db:seed --table=patients
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

/**
 * 
generator client {
    provider = "prisma-client-js"
}

datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
}

// this model is for management personnels
model User {
    id          String   @id @default(cuid())
    name        String
    email       String   @unique
    image       String   @db.Text
    password    String
    phoneNumber String?  @unique @map("phone_number")
    createdAt   DateTime @default(now()) @map("created_at")
    updatedAt   DateTime @updatedAt @map("updated_at")

    @@map("utilisateurs")
}

// this model is for patients
model Patient {
    id                Int           @id @default(autoincrement())
    firstName         String        @map("first_name")
    lastName          String        @map("last_name")
    email             String?
    dateOfBirth       DateTime?     @map("date_of_birth")
    phoneNumber       String?       @map("phone_number")
    address           String?       @db.Text
    notes             String?       @db.Text
    // medical history: it means the patient's medical history which includes the patient's past and present health issues, surgeries, medications, allergies, and other medical conditions.
    insuranceProvider String?
    createdAt         DateTime      @default(now()) @map("created_at")
    updatedAt         DateTime      @updatedAt @map("updated_at")
    appointments      Appointment[]
    documents         Document[]
    payments          Payment[]

    @@map("patients")
}

model Therapist {
    id           String        @id @default(cuid())
    name         String
    image        String        @db.Text
    speciality   String?
    createdAt    DateTime      @default(now()) @map("created_at")
    updatedAt    DateTime      @updatedAt @map("updated_at")
    appointments Appointment[]

    @@map("therapists")
}

enum AppointmentStatus {
    PENDING
    CONFIRMED
    CANCELLED
}

model Appointment {
    id          String            @id @default(cuid())
    patientId   Int               @map("patient_id")
    therapistId String?           @map("therapist_id")
    serviceId   String?           @map("service_id")
    startTime   DateTime          @map("start_time")
    endTime     DateTime          @map("end_time")
    floor       Int?
    notes       String?           @db.Text
    // etage       Int?
    status      AppointmentStatus // pending, confirmed, cancelled: when the patient cancels the appointment or the therapist cancels the appointment or the appointment is cancelled by the management
    createdAt   DateTime          @default(now()) @map("created_at")
    updatedAt   DateTime          @updatedAt @map("updated_at")
    // when the appointment is confirmed, the service is added to the appointment
    service     Service?          @relation(fields: [serviceId], references: [id], onDelete: SetNull)
    patient     Patient           @relation(fields: [patientId], references: [id], onDelete: Cascade)
    therapist   Therapist?        @relation(fields: [therapistId], references: [id], onDelete: SetNull)

    @@map("appointments")
}

model Service {
    id           String        @id @default(cuid())
    name         String
    description  String?
    price        Float?
    duration     Int? // in minutes
    createdAt    DateTime      @default(now()) @map("created_at")
    updatedAt    DateTime      @updatedAt @map("updated_at")
    appointments Appointment[]

    @@map("services")
}

model Document {
    id          String @id @default(cuid())
    patientId   Int    @map("patient_id")
    name        String
    contentType String @map("content_type")
    fileSize    Int    @map("file_size")
    key         String

    createdAt DateTime @default(now()) @map("created_at")
    updatedAt DateTime @updatedAt @map("updated_at")
    patient   Patient  @relation(fields: [patientId], references: [id], onDelete: Cascade)

    @@map("documents")
}



model Payment {
    id               String   @id @default(cuid())
    patientId        Int?     @map("patient_id")
    label            String?
    amount           Float
    numberOfSessions Int?     @default(1) @map("number_of_sessions") // if the payment is for multiple sessions
    // the date when the payment was made
    paymentDate      DateTime @map("payment_date")
    // the method used for the payment (e.g., cash, credit card, bank transfer)
    paymentMethod    String?  @map("payment_method")

    isPaid Boolean @default(false) @map("is_paid") // indicates if the payment has been fully paid
    // add any other fields that are relevant to your payment system
    notes  String? @db.Text // additional notes for the payment  (e.g., reason for the payment, special instructions, etc...)

    patient Patient? @relation(fields: [patientId], references: [id], onDelete: Cascade)

    createdAt DateTime @default(now()) @map("created_at")
    updatedAt DateTime @updatedAt @map("updated_at")

    @@map("payments")
}

// Expenses model: for this model, we need to keep track of the expenses incurred by the center. The expenses could be related to operational costs, salaries, equipment, utilities, rent, or other expenses.

enum ExpenseType {
    OPERATIONAL
    SALARY
    EQUIPMENT
    UTILITIES
    RENT
    OTHER
}

model Expense {
    id          String      @id @default(cuid())
    label       String?
    amount      Float
    expenseDate DateTime
    type        ExpenseType
    notes       String? // Additional notes or comments about the expense

    createdAt DateTime @default(now()) @map("created_at")
    updatedAt DateTime @updatedAt @map("updated_at")

    @@map("expenses")
}

 */
