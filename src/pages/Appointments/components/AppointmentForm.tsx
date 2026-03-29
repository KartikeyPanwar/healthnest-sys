
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { appointmentSchema, AppointmentFormValues } from "../schema";
import { mockServices, timeSlots } from "../data";
import {
  AppointmentDatePicker,
  AppointmentFormActions,
  AppointmentNotes,
  AppointmentTimePicker,
  DoctorSelector,
  PatientSelector,
  ServiceSelector
} from "@/components/appointments/scheduling";
import { useCreateAppointment, useDoctors } from "@/hooks/useSupabaseData";

interface AppointmentFormProps {
  onCancel: () => void;
}

const AppointmentForm = ({ onCancel }: AppointmentFormProps) => {
  const navigate = useNavigate();
  const [selectedDoctor, setSelectedDoctor] = useState<string | undefined>();
  const createAppointment = useCreateAppointment();
  const { data: dbDoctors } = useDoctors();

  const doctors = (dbDoctors ?? []).map((d: any) => ({
    id: d.id,
    name: d.name,
    department: d.specialization || d.department || "General",
  }));
  
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patientId: "",
      doctorId: "",
      service: "",
      duration: 30,
      notes: "",
    },
  });

  const onSubmit = (values: AppointmentFormValues) => {
    createAppointment.mutate(
      {
        patient_id: values.patientId,
        doctor_id: values.doctorId,
        date: values.date.toISOString().split("T")[0],
        time: values.time,
        duration: values.duration,
        service: values.service,
        notes: values.notes || "",
        status: "scheduled",
      },
      {
        onSuccess: () => {
          const doctor = doctors.find((d: any) => d.id === values.doctorId);
          toast.success("Appointment scheduled successfully", {
            description: `Appointment with ${doctor?.name ?? "Doctor"} on ${values.date.toLocaleDateString()} at ${values.time}`,
          });
          navigate("/appointments");
        },
        onError: (error) => {
          toast.error("Failed to schedule appointment", {
            description: error.message,
          });
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <PatientSelector form={form} />
          
          <DoctorSelector 
            form={form} 
            doctors={doctors} 
            onDoctorChange={setSelectedDoctor} 
          />
          
          <ServiceSelector 
            form={form} 
            services={mockServices} 
          />
          
          <AppointmentDatePicker form={form} />
          
          <AppointmentTimePicker 
            form={form} 
            timeSlots={timeSlots} 
          />
        </div>

        <AppointmentNotes form={form} />

        <AppointmentFormActions 
          onCancel={onCancel} 
          isSubmitting={createAppointment.isPending} 
        />
      </form>
    </Form>
  );
};

export default AppointmentForm;
