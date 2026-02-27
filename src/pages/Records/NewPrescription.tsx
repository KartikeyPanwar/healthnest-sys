
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { mockPatients, mockDoctors, mockPrescriptions } from "@/data/mockData";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppointmentFormActions } from "@/components/appointments/scheduling";
import { Plus, Trash } from "lucide-react";

// Define schema for prescription form
const medicationSchema = z.object({
  name: z.string().min(3, { message: "Medication name is required" }),
  dosage: z.string().min(1, { message: "Dosage is required" }),
  frequency: z.string().min(1, { message: "Frequency is required" }),
  duration: z.string().min(1, { message: "Duration is required" }),
  instructions: z.string().optional(),
});

const prescriptionSchema = z.object({
  patientId: z.string().min(1, { message: "Patient is required" }),
  doctorId: z.string().min(1, { message: "Doctor is required" }),
  date: z.string().min(1, { message: "Date is required" }),
  diagnosis: z.string().min(3, { message: "Diagnosis is required" }),
  medications: z.array(medicationSchema).min(1, { message: "At least one medication is required" }),
  instructions: z.string().optional(),
  followUpDate: z.string().optional(),
  followUpNotes: z.string().optional(),
});

type PrescriptionFormValues = z.infer<typeof prescriptionSchema>;

const NewPrescription = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PrescriptionFormValues>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      medications: [{ name: "", dosage: "", frequency: "", duration: "", instructions: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "medications",
  });

  const handleCancel = () => {
    toast.info("Prescription creation cancelled");
    navigate("/records");
  };

  const onSubmit = (values: PrescriptionFormValues) => {
    setIsSubmitting(true);
    const patient = mockPatients.find(p => p.id === values.patientId);
    const doctor = mockDoctors.find(d => d.id === values.doctorId);

    setTimeout(() => {
      mockPrescriptions.push({
        id: `PR${String(mockPrescriptions.length + 1).padStart(3, "0")}`,
        patientId: values.patientId,
        patientName: patient?.name || "Unknown",
        doctorId: values.doctorId,
        doctorName: doctor?.name || "Unknown",
        date: values.date,
        diagnosis: values.diagnosis,
        medications: values.medications.map(m => ({
          name: m.name,
          dosage: m.dosage,
          frequency: m.frequency,
          duration: m.duration,
          instructions: m.instructions,
        })),
        instructions: values.instructions,
        followUp: values.followUpDate ? { date: values.followUpDate, notes: values.followUpNotes || "" } : undefined,
        createdAt: new Date().toISOString(),
      });
      toast.success("Prescription created successfully");
      setIsSubmitting(false);
      navigate("/records");
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Create New Prescription</h1>
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Prescription Details</CardTitle>
          <CardDescription>
            Create a new prescription for a patient
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="patientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select patient" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockPatients.map(p => (
                            <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="doctorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Doctor</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select doctor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockDoctors.map(d => (
                            <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="diagnosis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diagnosis</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter diagnosis" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <FormLabel>Medications</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ name: "", dosage: "", frequency: "", duration: "", instructions: "" })}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Medication
                  </Button>
                </div>
                
                {fields.map((field, index) => (
                  <div key={field.id} className="space-y-4 rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Medication {index + 1}</h4>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                        >
                          <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name={`medications.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Medication Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter medication name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`medications.${index}.dosage`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dosage</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. 10mg" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`medications.${index}.frequency`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Frequency</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. twice daily" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`medications.${index}.duration`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Duration</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. 7 days" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`medications.${index}.instructions`}
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>Special Instructions</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="e.g. take with food"
                                className="resize-none" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <FormField
                control={form.control}
                name="instructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Instructions</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter any additional instructions for the patient"
                        className="resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Follow-up</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="followUpDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Follow-up Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="followUpNotes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Follow-up Notes</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter any notes for the follow-up appointment"
                            className="resize-none" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <AppointmentFormActions
                onCancel={handleCancel}
                isSubmitting={isSubmitting}
                submitLabel="Create Prescription"
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewPrescription;
