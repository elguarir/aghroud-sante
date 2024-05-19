import { ExpenseType, PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function seedPayments() {
  const payments = [];
  const numberOfPayments = 5; // Number of payment records to generate

  for (let i = 0; i < numberOfPayments; i++) {
    const payment = {
      id: faker.string.nanoid(8),
      patientId: faker.helpers.arrayElement([1, 2]), // Assuming you have patients with IDs 1 and 2
      label: faker.helpers.arrayElement([
        "appointment",
        "service",
        "product",
        "advance",
      ]),
      amount: parseInt(faker.finance.amount({ min: 100, max: 1200, dec: 0 })),
      numberOfSessions: faker.number.int({ min: 1, max: 10 }),
      paymentDate: faker.date.recent({ days: 30 }), // Last 6 months
      paymentMethod: faker.helpers.arrayElement([
        "cash",
        "transfer",
        "check",
        "other",
      ]),
      isPaid: faker.datatype.boolean(),
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
  const numberOfPatients = 5;

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
        refDate: new Date("2005-01-01"), // Limit to patients born after 2000
        years: 30,
      }),
      phoneNumber: faker.phone.number("+212#########"),
      address: faker.location.streetAddress(),
      notes: faker.lorem.sentences(),
      insuranceProvider: faker.company.name(),
      createdAt: faker.date.recent({ days: 60 }), // Last month
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
  const numberOfExpenses = 50; // Number of expense records to generate

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
      amount: parseInt(faker.finance.amount({ min: 20, max: 1000, dec: 0 })),
      expenseDate: faker.date.recent({ days: 160 }),
      type: faker.helpers.arrayElement(expenseTypes) as ExpenseType,
      notes: faker.lorem.sentence(),
      createdAt: faker.date.recent({ days: 60 }),
    };
    expenses.push(expense);
  }

  await prisma.expense.createMany({
    data: expenses,
  });

  console.log(`Created ${numberOfExpenses} expense records`);
}

async function main() {
  // get the --table argument
  const table = process.argv[2]?.split("=")[1];

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
