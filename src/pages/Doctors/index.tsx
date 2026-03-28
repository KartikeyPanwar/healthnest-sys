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
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Stethoscope, Loader2 } from "lucide-react";
import { useDoctors } from "@/hooks/useSupabaseData";
import { cn } from "@/lib/utils";

const DoctorsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const { data: dbDoctors, isLoading } = useDoctors();

  const doctors = (dbDoctors ?? []).map((d: any) => ({
    id: d.id,
    name: d.name,
    gender: d.gender,
    department: d.department ?? "",
    specialization: d.specialization ?? "",
    qualification: d.qualification ?? "",
    experience: d.experience ?? 0,
    phone: d.phone ?? "",
    email: d.email ?? "",
    address: d.address ?? "",
    availability: d.availability ?? { days: [], startTime: "09:00", endTime: "17:00" },
    status: d.status,
    joiningDate: d.joining_date ?? "",
  }));

  const departments = Array.from(new Set(doctors.map((d: any) => d.department).filter(Boolean)));

  const filteredDoctors = doctors.filter(
    (doctor: any) =>
      (doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (departmentFilter === "all" || doctor.department === departmentFilter)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-secondary/20 text-secondary";
      case "inactive": return "bg-destructive/20 text-destructive";
      case "on-leave": return "bg-amber-100 text-amber-800";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <h1 className="text-2xl font-semibold">Doctors</h1>
        <Button onClick={() => navigate("/doctors/new")} type="button">
          <Plus className="mr-2 h-4 w-4" /> Add New Doctor
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Medical Staff</CardTitle>
          <CardDescription>View and manage all doctors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search doctors..." className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dep) => (
                  <SelectItem key={dep} value={dep}>{dep}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Stethoscope className="mb-2 h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-medium">No doctors found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {doctors.length === 0 ? "Add your first doctor to get started." : "No doctors match your criteria."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredDoctors.map((doctor: any) => (
                <div key={doctor.id} className="rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Stethoscope className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{doctor.name}</h3>
                        <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={cn("capitalize", getStatusColor(doctor.status))}>{doctor.status}</Badge>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="rounded-md bg-accent p-2">
                      <p className="text-xs font-medium text-muted-foreground">Department</p>
                      <p className="text-sm font-medium">{doctor.department}</p>
                    </div>
                    <div className="rounded-md bg-accent p-2">
                      <p className="text-xs font-medium text-muted-foreground">Experience</p>
                      <p className="text-sm font-medium">{doctor.experience} years</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs font-medium text-muted-foreground">Availability</p>
                    <p className="text-sm">
                      {doctor.availability.days?.join(", ") || "Not set"} ({doctor.availability.startTime} - {doctor.availability.endTime})
                    </p>
                  </div>
                  <Button variant="default" size="sm" className="mt-4 w-full" onClick={() => navigate(`/doctors/${doctor.id}`)} type="button">
                    View Profile
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        {filteredDoctors.length > 0 && (
          <CardFooter className="flex justify-between border-t px-6 py-4">
            <div className="text-sm text-muted-foreground">
              Showing {filteredDoctors.length} of {doctors.length} doctors
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default DoctorsPage;
