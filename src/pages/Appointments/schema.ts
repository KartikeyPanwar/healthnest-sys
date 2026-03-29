
import { z } from "zod";

export const appointmentSchema = z.object({
  patientId: z.string().min(1, "Please select a patient"),
  doctorId: z.string().min(1, "Please select a doctor"),
  service: z.string().min(1, "Please select a service"),
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.string().min(1, "Please select a time"),
  duration: z.number().default(30),
  notes: z.string().optional(),
});

export type AppointmentFormValues = z.infer<typeof appointmentSchema>;
