
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StatsCard from "@/components/dashboard/StatsCard";
import BloodCampRegistrationDialog from "@/components/dashboard/BloodCampRegistrationDialog";
import AppointmentList from "@/components/appointments/AppointmentList";
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CalendarClock, Loader2, PlusCircle, UserRound, Users, Clock, CheckCircle2, XCircle, CalendarDays, Heart, MapPin,
} from "lucide-react";
import { usePatients, useDoctors, useAppointments } from "@/hooks/useSupabaseData";
import { Appointment } from "@/types/appointment";

const Dashboard = () => {
  const navigate = useNavigate();
  const [bloodCampOpen, setBloodCampOpen] = useState(false);

  const { data: patients, isLoading: pLoading } = usePatients();
  const { data: doctors, isLoading: dLoading } = useDoctors();
  const { data: rawAppointments, isLoading: aLoading } = useAppointments();

  const isLoading = pLoading || dLoading || aLoading;

  const appointments: Appointment[] = (rawAppointments ?? []).map((a: any) => ({
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

  const todayStr = new Date().toISOString().split("T")[0];
  const todayAppointments = appointments.filter((a) => a.date === todayStr);
  const upcoming = appointments.filter((a) => a.status === "scheduled" && a.date >= todayStr);
  const completedCount = appointments.filter((a) => a.status === "completed").length;
  const cancelledCount = appointments.filter((a) => a.status === "cancelled").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-semibold">Appointment Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of today's schedule and upcoming appointments</p>
        </div>
        <Button onClick={() => navigate("/appointments/new")}>
          <PlusCircle className="mr-2 h-4 w-4" /> New Appointment
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatsCard
              title="Today's Appointments"
              value={todayAppointments.length}
              icon={<CalendarDays className="h-5 w-5" />}
              description={`${todayAppointments.filter(a => a.status === 'scheduled').length} pending`}
            />
            <StatsCard
              title="Upcoming"
              value={upcoming.length}
              icon={<Clock className="h-5 w-5" />}
              description="Scheduled visits"
            />
            <StatsCard
              title="Completed"
              value={completedCount}
              icon={<CheckCircle2 className="h-5 w-5" />}
              description="Finished appointments"
            />
            <StatsCard
              title="Total Patients"
              value={patients?.length ?? 0}
              icon={<Users className="h-5 w-5" />}
              description={`${doctors?.length ?? 0} doctors active`}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Today's Schedule - takes 2 columns */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarClock className="h-5 w-5 text-primary" />
                      Today's Schedule
                    </CardTitle>
                    <CardDescription>
                      {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{todayAppointments.length} appointments</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {todayAppointments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <CalendarDays className="mb-3 h-12 w-12 text-muted-foreground/50" />
                    <h3 className="text-lg font-medium">No appointments today</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Schedule a new appointment to get started</p>
                    <Button className="mt-4" size="sm" onClick={() => navigate("/appointments/new")}>
                      <PlusCircle className="mr-2 h-4 w-4" /> Schedule Now
                    </Button>
                  </div>
                ) : (
                  <AppointmentList appointments={todayAppointments} />
                )}
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full" onClick={() => navigate("/appointments")}>
                  View All Appointments
                </Button>
              </CardFooter>
            </Card>

            {/* Upcoming Appointments Sidebar */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Upcoming Appointments</CardTitle>
                <CardDescription>Next scheduled visits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Blood Camp Advertisement */}
                <div className="rounded-lg border-2 border-destructive/30 bg-destructive/5 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Heart className="h-5 w-5 text-destructive" />
                    <h4 className="font-semibold text-destructive">🩸 Blood Donation Camp</h4>
                  </div>
                  <p className="text-sm font-medium">April 12 – May 5, 2026</p>
                  <p className="text-xs text-muted-foreground mt-1">Daily, 9:00 AM – 4:00 PM</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>Hospital Main Hall, Ground Floor</span>
                  </div>
                  <p className="text-xs mt-2 text-muted-foreground">
                    All blood groups needed. Walk-ins welcome. Free health checkup for all donors!
                  </p>
                  <Badge variant="destructive" className="mt-2 text-xs">Register Now</Badge>
                </div>

                {upcoming.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">No upcoming appointments</p>
                ) : (
                  <div className="space-y-3">
                    {upcoming.slice(0, 8).map((a) => (
                      <div key={a.id} className="flex items-start gap-3 rounded-lg border p-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                          <UserRound className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{a.patientName}</p>
                          <p className="text-xs text-muted-foreground">{a.doctorName}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{a.date}</Badge>
                            <span className="text-xs text-muted-foreground">{a.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              {upcoming.length > 8 && (
                <CardFooter>
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate("/appointments")}>
                    View {upcoming.length - 8} more
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Cancellation Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {appointments.length > 0 ? ((cancelledCount / appointments.length) * 100).toFixed(1) : 0}%
                </p>
                <p className="text-xs text-muted-foreground">{cancelledCount} cancelled of {appointments.length} total</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {appointments.length > 0 ? ((completedCount / appointments.length) * 100).toFixed(1) : 0}%
                </p>
                <p className="text-xs text-muted-foreground">{completedCount} completed of {appointments.length} total</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Doctors</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{doctors?.length ?? 0}</p>
                <p className="text-xs text-muted-foreground">Available for appointments</p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
