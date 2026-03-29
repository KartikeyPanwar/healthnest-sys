
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { appointmentSchema, AppointmentFormValues } from "@/pages/Appointments/schema";
import { mockServices, timeSlots } from "@/pages/Appointments/data";
import {
  AppointmentDatePicker,
  AppointmentFormActions,
  AppointmentNotes,
  AppointmentTimePicker,
  DoctorSelector,
  PatientSelector,
  ServiceSelector
} from "@/components/appointments/scheduling";
import { Appointment } from "@/types/appointment";
import { useDoctors } from "@/hooks/useSupabaseData";

interface EditAppointmentDialogProps {
  appointment: Appointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedAppointment: Appointment) => void;
}

export const EditAppointmentDialog = ({
  appointment,
  open,
  onOpenChange,
  onSave,
}: EditAppointmentDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<string | undefined>(
    appointment?.doctorId
  );
  const { data: dbDoctors } = useDoctors();

  const doctors = (dbDoctors ?? []).map((d: any) => ({
    id: d.id,
    name: d.name,
    department: d.specialization || d.department || "General",
  }));

  const getDateFromString = (dateString: string | undefined) => {
    if (!dateString) return new Date();
    return new Date(dateString);
  };

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patientId: appointment?.patientId || "",
      doctorId: appointment?.doctorId || "",
      service: appointment?.service || "",
      date: getDateFromString(appointment?.date),
      time: appointment?.time || "",
      duration: appointment?.duration || 30,
      notes: appointment?.notes || "",
    },
  });

  const onSubmit = (values: AppointmentFormValues) => {
    if (!appointment) return;
    
    setIsSubmitting(true);
    
    const doctor = doctors.find((d: any) => d.id === values.doctorId);
    
    const updatedAppointment: Appointment = {
      ...appointment,
      patientId: values.patientId,
      doctorId: values.doctorId,
      doctorName: doctor?.name || "Unknown Doctor",
      date: values.date.toISOString().split("T")[0],
      time: values.time,
      duration: values.duration,
      service: values.service,
      notes: values.notes || "",
    };
    
    onSave(updatedAppointment);
    
    toast.success("Appointment updated successfully", {
      description: `Appointment with ${doctor?.name ?? "Doctor"} on ${values.date.toLocaleDateString()} at ${values.time}`,
    });
    
    setIsSubmitting(false);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Appointment</DialogTitle>
        </DialogHeader>
        
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
              onCancel={handleCancel} 
              isSubmitting={isSubmitting}
              submitLabel="Update Appointment" 
              cancelLabel="Cancel"
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
