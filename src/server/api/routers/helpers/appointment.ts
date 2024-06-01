import { db } from "@/server/db";

export async function getAllAppointments() {
  return await db.appointment.findMany({
    select: {
      id: true,
      startTime: true,
      endTime: true,
      status: true,
      notes: true,
      floor: true,
      createdAt: true,
      updatedAt: true,
      patient: {
        select: {
          id: true,
          phoneNumber: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      therapist: {
        select: {
          id: true,
          name: true,
          image: true,
          speciality: true,
          createdAt: true,
        },
      },
      service: {
        select: {
          id: true,
          name: true,
          price: true,
          duration: true,
          createdAt: true,
        },
      },
    },
    orderBy: {
      startTime: "asc",
    },
  });
}

export async function getAppointmentById() {}

export async function getAppointmentByPatientId() {}

export async function getAppointmentByDoctorId() {}
