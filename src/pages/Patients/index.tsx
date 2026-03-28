
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import PatientCard from "@/components/patients/PatientCard";
import { Plus, Search, UserRound, Loader2 } from "lucide-react";
import { usePatients } from "@/hooks/useSupabaseData";
import { Patient } from "@/types/patient";

const PatientsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: dbPatients, isLoading } = usePatients();

  // Map DB rows to Patient type for PatientCard
  const patients: Patient[] = (dbPatients ?? []).map((p: any) => ({
    id: p.id,
    name: p.name,
    gender: p.gender,
    dob: p.dob,
    bloodType: p.blood_type ?? "Unknown",
    address: p.address ?? "",
    phone: p.phone ?? "",
    email: p.email ?? "",
    emergencyContact: p.emergency_contact ?? { name: "", relationship: "", phone: "" },
    medicalHistory: p.medical_history ?? { allergies: [], conditions: [], medications: [], surgeries: [] },
    insuranceDetails: p.insurance_details,
    status: p.status as "active" | "inactive",
    registeredDate: p.registered_date ?? "",
  }));

  const filteredPatients = patients.filter(
    (patient) =>
      (patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "all" || patient.status === statusFilter)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <h1 className="text-2xl font-semibold">Patient Management</h1>
        <Button onClick={() => navigate("/patients/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Patient
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patients</CardTitle>
          <CardDescription>View and manage patient records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search patients..." className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <UserRound className="mb-2 h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-medium">No patients found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {patients.length === 0 ? "Add your first patient to get started." : "No patients match your search criteria."}
              </p>
              {patients.length > 0 && (
                <Button variant="outline" className="mt-4" onClick={() => { setSearchTerm(""); setStatusFilter("all"); }}>
                  Reset Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPatients.map((patient) => (
                <PatientCard key={patient.id} patient={patient} onViewDetails={(id) => navigate(`/patients/${id}`)} onEditPatient={(id) => navigate(`/patients/${id}`)} />
              ))}
            </div>
          )}
        </CardContent>
        {filteredPatients.length > 0 && (
          <CardFooter className="flex justify-between border-t px-6 py-4">
            <div className="text-sm text-muted-foreground">
              Showing {filteredPatients.length} of {patients.length} patients
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default PatientsPage;
