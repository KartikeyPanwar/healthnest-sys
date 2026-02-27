import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { mockDoctors, mockAppointments, mockPatients, mockPrescriptions } from "@/data/mockData";
import {
  Users, CalendarDays, Clock, CheckCircle, AlertTriangle, FileText,
  TrendingUp, Star, Stethoscope, Activity, ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [selectedDoctor, setSelectedDoctor] = useState(mockDoctors[0]?.id || "");

  const doctor = mockDoctors.find(d => d.id === selectedDoctor);
  if (!doctor) return null;

  const doctorAppointments = mockAppointments.filter(a => a.doctorId === selectedDoctor);
  const scheduledAppts = doctorAppointments.filter(a => a.status === "scheduled");
  const completedAppts = doctorAppointments.filter(a => a.status === "completed");
  const doctorPrescriptions = mockPrescriptions.filter(p => p.doctorId === selectedDoctor);

  // Unique patients for this doctor
  const uniquePatientIds = [...new Set(doctorAppointments.map(a => a.patientId))];
  const doctorPatients = mockPatients.filter(p => uniquePatientIds.includes(p.id));

  // Weekly schedule mock data
  const weeklyData = [
    { day: "Mon", appointments: 5, completed: 4 },
    { day: "Tue", appointments: 7, completed: 7 },
    { day: "Wed", appointments: 3, completed: 3 },
    { day: "Thu", appointments: 6, completed: 5 },
    { day: "Fri", appointments: 4, completed: 2 },
    { day: "Sat", appointments: 2, completed: 2 },
  ];

  // Service distribution
  const serviceMap: Record<string, number> = {};
  doctorAppointments.forEach(a => {
    serviceMap[a.service] = (serviceMap[a.service] || 0) + 1;
  });
  const serviceData = Object.entries(serviceMap).map(([name, value]) => ({ name, value }));
  const pieColors = [
    "hsl(var(--primary))",
    "hsl(var(--secondary))",
    "hsl(var(--destructive))",
    "hsl(35, 90%, 55%)",
    "hsl(270, 60%, 55%)",
  ];

  const completionRate = doctorAppointments.length > 0
    ? Math.round((completedAppts.length / doctorAppointments.length) * 100)
    : 0;

  const stats = [
    { label: "Total Patients", value: doctorPatients.length, icon: Users, color: "text-primary" },
    { label: "Scheduled", value: scheduledAppts.length, icon: CalendarDays, color: "text-amber-500" },
    { label: "Completed", value: completedAppts.length, icon: CheckCircle, color: "text-secondary" },
    { label: "Prescriptions", value: doctorPrescriptions.length, icon: FileText, color: "text-destructive" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Doctor Dashboard</h1>
          <p className="text-sm text-muted-foreground">Personal overview & performance</p>
        </div>
        <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
          <SelectTrigger className="w-[240px]">
            <SelectValue placeholder="Select doctor" />
          </SelectTrigger>
          <SelectContent>
            {mockDoctors.map(d => (
              <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Doctor Profile Card */}
      <Card>
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Stethoscope className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1 space-y-1">
            <h2 className="text-xl font-bold">{doctor.name}</h2>
            <p className="text-sm text-muted-foreground">{doctor.specialization} — {doctor.department}</p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Badge variant="outline">{doctor.qualification}</Badge>
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" /> {doctor.experience} yrs exp
              </Badge>
              <Badge
                className={
                  doctor.status === "active"
                    ? "bg-secondary/20 text-secondary border-secondary/30"
                    : doctor.status === "on-leave"
                    ? "bg-amber-100 text-amber-800 border-amber-300"
                    : "bg-destructive/20 text-destructive border-destructive/30"
                }
              >
                {doctor.status}
              </Badge>
            </div>
          </div>
          <div className="text-right space-y-1">
            <p className="text-xs text-muted-foreground">Availability</p>
            <p className="text-sm font-medium">{doctor.availability.days.join(", ")}</p>
            <p className="text-xs text-muted-foreground">{doctor.availability.startTime} – {doctor.availability.endTime}</p>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(s => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className={`rounded-full bg-muted p-2.5 ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Completion Rate + Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Completion Rate */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-primary" /> Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">Completion Rate</span>
                <span className="text-sm font-bold">{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">Patient Satisfaction</span>
                <span className="text-sm font-bold flex items-center gap-1">
                  <Star className="h-3 w-3 text-amber-500 fill-amber-500" /> 4.8
                </span>
              </div>
              <Progress value={96} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">Avg Consultation</span>
                <span className="text-sm font-bold">35 min</span>
              </div>
              <Progress value={70} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Weekly Appointments Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Weekly Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="appointments" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Scheduled" />
                <Bar dataKey="completed" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Service Distribution Pie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Service Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {serviceData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={serviceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={{ fontSize: 10 }}>
                    {serviceData.map((_, i) => (
                      <Cell key={i} fill={pieColors[i % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No service data</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Today's Appointments + Patient List */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Upcoming Appointments</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate("/appointments")} className="gap-1 text-xs">
              View All <ArrowRight className="h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent>
            {scheduledAppts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No upcoming appointments</p>
            ) : (
              <div className="space-y-3">
                {scheduledAppts.map(appt => (
                  <div key={appt.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                        <CalendarDays className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{appt.patientName}</p>
                        <p className="text-xs text-muted-foreground">{appt.service}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{appt.time}</p>
                      <p className="text-xs text-muted-foreground">{appt.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Patients */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">My Patients</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate("/patients")} className="gap-1 text-xs">
              View All <ArrowRight className="h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent>
            {doctorPatients.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No patients assigned</p>
            ) : (
              <div className="space-y-3">
                {doctorPatients.map(patient => (
                  <div key={patient.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent">
                        <Users className="h-4 w-4 text-accent-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{patient.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {patient.medicalHistory?.conditions.join(", ") || "No conditions"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{patient.bloodType}</Badge>
                      <Badge
                        className={
                          patient.status === "active"
                            ? "bg-secondary/20 text-secondary border-secondary/30"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {patient.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Prescriptions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent Prescriptions</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => navigate("/records")} className="gap-1 text-xs">
            View All <ArrowRight className="h-3 w-3" />
          </Button>
        </CardHeader>
        <CardContent>
          {doctorPrescriptions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No prescriptions</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {doctorPrescriptions.map(rx => (
                <div key={rx.id} className="rounded-lg border p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{rx.patientName}</p>
                    <span className="text-[10px] text-muted-foreground">{rx.date}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{rx.diagnosis}</p>
                  <div className="flex flex-wrap gap-1">
                    {rx.medications.map((med, i) => (
                      <Badge key={i} variant="outline" className="text-[10px]">
                        {med.name} {med.dosage}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorDashboard;
