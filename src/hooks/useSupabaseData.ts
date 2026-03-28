import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// ─── Patients ────────────────────────────────────────
export const usePatients = () =>
  useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .order("registered_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

export const usePatient = (id: string) =>
  useQuery({
    queryKey: ["patients", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

export const useCreatePatient = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (patient: any) => {
      const { data, error } = await supabase.from("patients").insert([patient]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["patients"] }),
  });
};

// ─── Doctors ─────────────────────────────────────────
export const useDoctors = () =>
  useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("doctors")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

export const useDoctor = (id: string) =>
  useQuery({
    queryKey: ["doctors", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("doctors")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

export const useCreateDoctor = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (doctor: any) => {
      const { data, error } = await supabase.from("doctors").insert([doctor]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["doctors"] }),
  });
};

// ─── Appointments ────────────────────────────────────
export const useAppointments = () =>
  useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select(`*, patients(name), doctors(name)`)
        .order("date", { ascending: false });
      if (error) throw error;
      return data.map((a: any) => ({
        ...a,
        patientName: a.patients?.name ?? "Unknown",
        doctorName: a.doctors?.name ?? "Unknown",
      }));
    },
  });

export const useCreateAppointment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (appt: any) => {
      const { data, error } = await supabase.from("appointments").insert([appt]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["appointments"] }),
  });
};

export const useUpdateAppointment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string;[key: string]: any }) => {
      const { data, error } = await supabase.from("appointments").update(updates).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["appointments"] }),
  });
};

// ─── Prescriptions ───────────────────────────────────
export const usePrescriptions = () =>
  useQuery({
    queryKey: ["prescriptions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prescriptions")
        .select(`*, patients(name), doctors(name)`)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data.map((p: any) => ({
        ...p,
        patientName: p.patients?.name ?? "Unknown",
        doctorName: p.doctors?.name ?? "Unknown",
      }));
    },
  });

export const useCreatePrescription = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (rx: any) => {
      const { data, error } = await supabase.from("prescriptions").insert([rx]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["prescriptions"] }),
  });
};

// ─── Bills ───────────────────────────────────────────
export const useBills = () =>
  useQuery({
    queryKey: ["bills"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bills")
        .select(`*, patients(name), doctors(name)`)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data.map((b: any) => ({
        ...b,
        patientName: b.patients?.name ?? "Unknown",
        doctorName: b.doctors?.name ?? "Unknown",
      }));
    },
  });

export const useCreateBill = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (bill: any) => {
      const { data, error } = await supabase.from("bills").insert([bill]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bills"] }),
  });
};
