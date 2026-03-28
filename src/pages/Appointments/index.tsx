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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Plus, Search, Loader2 } from "lucide-react";
import { useAppointments, useUpdateAppointment } from "@/hooks/useSupabaseData";
import AppointmentList from "@/components/appointments/AppointmentList";
import { Appointment } from "@/types/appointment";

const AppointmentsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: dbAppointments, isLoading } = useAppointments();
  const updateMutation = useUpdateAppointment();

  const appointments: Appointment[] = (dbAppointments ?? []).map((a: any) => ({
    id: a.id,
    patientId: a.patient_id,
    patientName: a.patientName,
    doctorId: a.doctor_id,
    doctorName: a.doctorName,
    date: a.date,
    time: a.time,
    duration: a.duration ?? 30,
    service: a.service ?? "",
    notes: a.notes ?? "",
    status: a.status,
    createdAt: a.created_at ?? "",
  }));

  const filteredAppointments = appointments.filter(
    (a) =>
      (a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.doctorName.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "all" || a.status === statusFilter)
  );

  const upcoming = filteredAppointments.filter((a) => a.status === "scheduled");
  const completed = filteredAppointments.filter((a) => a.status === "completed");

  const handleAppointmentUpdated = (updated: Appointment) => {
    updateMutation.mutate({
      id: updated.id,
      date: updated.date,
      time: updated.time,
      duration: updated.duration,
      service: updated.service,
      notes: updated.notes,
      status: updated.status,
    });
  };

  const renderEmpty = (msg: string) => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Calendar className="mb-2 h-12 w-12 text-muted-foreground" />
      <h3 className="text-lg font-medium">{msg}</h3>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <h1 className="text-2xl font-semibold">Appointments</h1>
        <Button onClick={() => navigate("/appointments/new")}>
          <Plus className="mr-2 h-4 w-4" /> New Appointment
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Appointments</CardTitle>
          <CardDescription>View and manage patient appointments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search appointments..." className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="no-show">No Show</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Tabs defaultValue="upcoming">
              <TabsList className="mb-4">
                <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
                <TabsTrigger value="all">All ({filteredAppointments.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="upcoming">
                {upcoming.length === 0 ? renderEmpty("No upcoming appointments") : (
                  <AppointmentList appointments={upcoming} onAppointmentUpdated={handleAppointmentUpdated} />
                )}
              </TabsContent>
              <TabsContent value="completed">
                {completed.length === 0 ? renderEmpty("No completed appointments") : (
                  <AppointmentList appointments={completed} onAppointmentUpdated={handleAppointmentUpdated} />
                )}
              </TabsContent>
              <TabsContent value="all">
                {filteredAppointments.length === 0 ? renderEmpty("No appointments found") : (
                  <AppointmentList appointments={filteredAppointments} onAppointmentUpdated={handleAppointmentUpdated} />
                )}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
        {filteredAppointments.length > 0 && (
          <CardFooter className="flex justify-between border-t px-6 py-4">
            <div className="text-sm text-muted-foreground">
              Showing {filteredAppointments.length} of {appointments.length} appointments
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default AppointmentsPage;
