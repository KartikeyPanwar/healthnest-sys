
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { usePatients } from "@/hooks/useSupabaseData";
import { Loader2 } from "lucide-react";

interface PatientSelectorProps {
  form: UseFormReturn<any>;
  name?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const PatientSelector = ({
  form,
  name = "patientId",
  label = "Patient",
  placeholder = "Select a patient",
  disabled = false,
}: PatientSelectorProps) => {
  const { data: patients, isLoading } = usePatients();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            onValueChange={field.onChange}
            value={field.value}
            disabled={disabled || isLoading}
          >
            <FormControl>
              <SelectTrigger>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-muted-foreground">Loading...</span>
                  </div>
                ) : (
                  <SelectValue placeholder={placeholder} />
                )}
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {(patients ?? []).map((patient: any) => (
                <SelectItem key={patient.id} value={patient.id}>
                  {patient.name} — {patient.phone || patient.email || "No contact"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
