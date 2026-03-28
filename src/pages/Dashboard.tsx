
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import StatsCard from "@/components/dashboard/StatsCard";
import AppointmentList from "@/components/appointments/AppointmentList";
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity, CalendarClock, IndianRupee, FileText, Pill, PlusCircle, UserRound, Users, Loader2,
} from "lucide-react";
import { usePatients, useDoctors, useAppointments, useBills } from "@/hooks/useSupabaseData";
import { Appointment } from "@/types/appointment";

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState("overview");
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: patients, isLoading: pLoading } = usePatients();
  const { data: doctors, isLoading: dLoading } = useDoctors();
  const { data: appointments, isLoading: aLoading } = useAppointments();
  const { data: bills } = useBills();

  const isLoading = pLoading || dLoading || aLoading;

  const totalRevenue = (bills ?? []).reduce((sum: number, b: any) => sum + Number(b.total || 0), 0);

  const todayStr = new Date().toISOString().split("T")[0];
  const todayAppointments: Appointment[] = (appointments ?? [])
    .filter((a: any) => a.date === todayStr)
    .map((a: any) => ({
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

  const recentPatients = (patients ?? []).slice(0, 5);

  const handleNewAppointment = () => navigate("/appointments/new");

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Button onClick={handleNewAppointment}>
          <PlusCircle className="mr-2 h-4 w-4" /> New Appointment
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard title="Total Patients" value={patients?.length ?? 0} icon={<Users className="h-5 w-5" />} description="Total registered patients" />
              <StatsCard title="Doctors" value={doctors?.length ?? 0} icon={<UserRound className="h-5 w-5" />} description="Active medical staff" />
              <StatsCard title="Appointments" value={appointments?.length ?? 0} icon={<CalendarClock className="h-5 w-5" />} description="Total scheduled" />
              <StatsCard title="Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={<IndianRupee className="h-5 w-5" />} description="Total billing" />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Appointments</CardTitle>
                  <CardDescription>Manage your appointments for today</CardDescription>
                </CardHeader>
                <CardContent>
                  {todayAppointments.length === 0 ? (
                    <div className="py-8 text-center text-sm text-muted-foreground">No appointments today</div>
                  ) : (
                    <AppointmentList appointments={todayAppointments} />
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full" onClick={() => navigate("/appointments")}>View All Appointments</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Patients</CardTitle>
                  <CardDescription>Latest registered patients</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentPatients.length === 0 ? (
                    <div className="py-8 text-center text-sm text-muted-foreground">No patients yet</div>
                  ) : (
                    <div className="rounded-md border">
                      <div className="divide-y">
                        {recentPatients.map((patient: any) => (
                          <div key={patient.id} className="flex items-center justify-between p-3">
                            <div className="flex items-center">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                <UserRound className="h-4 w-4 text-primary" />
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium">{patient.name}</p>
                                <p className="text-xs text-muted-foreground">{patient.email}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => navigate(`/patients/${patient.id}`)}>View</Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full" onClick={() => navigate("/patients")}>View All Patients</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>All Appointments</CardTitle>
                <CardDescription>View and manage all scheduled appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="mb-4" onClick={() => navigate("/appointments")}>Go to Appointments Page</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patients">
            <Card>
              <CardHeader>
                <CardTitle>Patient Management</CardTitle>
                <CardDescription>View and manage all registered patients</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="mb-4" onClick={() => navigate("/patients")}>Go to Patients Page</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Dashboard;
