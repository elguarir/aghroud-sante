import { db } from "@/server/db";

export async function getAllPatients() {
  let patients = await db.patient.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      phoneNumber: true,
      dateOfBirth: true,
      email: true,
      address: true,
      insuranceProvider: true,
      notes: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          appointments: true,
        },
      },
    },
  });

  return patients.map((patient) => {
    return {
      id: patient.id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      phoneNumber: patient.phoneNumber,
      dateOfBirth: patient.dateOfBirth,
      email: patient.email,
      address: patient.address,
      insuranceProvider: patient.insuranceProvider,
      notes: patient.notes,
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt,
      appointmentsCount: patient._count.appointments,
    };
  });
}

export async function getPatientById(id: number) {
  let patient = await db.patient.findUnique({
    where: {
      id: parseInt(id.toString()),
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      phoneNumber: true,
      dateOfBirth: true,
      email: true,
      address: true,
      insuranceProvider: true,
      notes: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          appointments: true,
        },
      },
    },
  });
  if (!patient) return null;

  return {
    id: patient.id,
    firstName: patient.firstName,
    lastName: patient.lastName,
    phoneNumber: patient.phoneNumber,
    dateOfBirth: patient.dateOfBirth,
    email: patient.email,
    address: patient.address,
    insuranceProvider: patient.insuranceProvider,
    notes: patient.notes,
    createdAt: patient.createdAt,
    updatedAt: patient.updatedAt,
    appointmentsCount: patient._count.appointments,
  };
}
