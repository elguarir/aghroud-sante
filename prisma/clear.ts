import { PrismaClient } from "@prisma/client";
import readline from "readline";

const prisma = new PrismaClient();
/**
 * 
  example command needs to be executed in correct order to avoid violating constraint:
  - `pnpm db:clear --table=patients,therapists,appointments,payments,expenses`
 */
async function main() {
  // get the --table argument
  const tables = process.argv[2]?.split("=")[1];
  const tablesArray = tables?.split(",");
  const allowedTables = [
    "patients",
    "therapists",
    "appointments",
    "payments",
    "expenses",
  ];

  const truncateTables = async () => {
    for (const table of tablesArray ?? []) {
      if (!allowedTables.includes(table)) {
        throw new Error(`Table ${table} is not allowed`);
      }

      await prisma.$queryRawUnsafe(
        `TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE`,
      );
    }
  };

  //   ask for confirmation before truncating tables
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question(
    `This will delete all data from the specified tables. Are you sure you want to continue? (yes/no) `,
    async (answer) => {
      if (answer.toLowerCase() === "yes") {
        await truncateTables();
        console.log("Tables truncated successfully.");
      } else {
        console.log("Operation cancelled.");
      }
      rl.close();
    },
  );

  //   for (const table of tablesArray ?? []) {
  //     if (!allowedTables.includes(table)) {
  //       throw new Error(`Table ${table} is not allowed`);
  //     }

  //     await prisma.$queryRawUnsafe(
  //       `TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE`,
  //     );
  //   }
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
