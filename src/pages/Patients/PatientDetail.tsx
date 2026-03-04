import { useParams, useNavigate } from "react-router-dom";
import { mockPatients, mockAppointments, mockPrescriptions } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft, UserRound, Phone, Mail, MapPin, Calendar, Heart,
  Pill, AlertTriangle, Shield, FileText, Clock, Droplets
} from "lucide-react";

const PatientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const patient = mockPatients.find(p => p.id === id);

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <UserRound className="mb-4 h-16 w-16 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Patient Not Found</h2>
        <p className="mt-1 text-sm text-muted-foreground">No patient found with ID: {id}</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/patients")}>
          <ArrowLeft className="mr-2 h-4 w-4" />Back to Patients
        </Button>
      </div>
    );
  }

  const age = new Date().getFullYear() - new Date(patient.dob).getFullYear();
  const appointments = mockAppointments.filter(a => a.patientId === patient.id);
  const prescriptions = mockPrescriptions.filter(p => p.patientId === patient.id);
  const history = patient.medicalHistory;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/patients")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{patient.name}</h1>
          <p className="text-sm text-muted-foreground">Patient ID: {patient.id}</p>
        </div>
        <Badge className={`ml-auto ${patient.status === "active" ? "bg-secondary/10 text-secondary" : "bg-amber-100 text-amber-800"}`}>
          {patient.status}
        </Badge>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Age / DOB</p>
              <p className="text-sm font-semibold">{age} yrs · {patient.dob}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Droplets className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Blood Type</p>
              <p className="text-sm font-semibold">{patient.bloodType}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Appointments</p>
              <p className="text-sm font-semibold">{appointments.length} total</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Prescriptions</p>
              <p className="text-sm font-semibold">{prescriptions.length} active</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">Personal Info</TabsTrigger>
          <TabsTrigger value="medical">Medical History</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
        </TabsList>

        {/* Personal Info */}
        <TabsContent value="info">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-base">Contact Information</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" /><span>{patient.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" /><span>{patient.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" /><span>{patient.address}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <UserRound className="h-4 w-4 text-muted-foreground" /><span className="capitalize">{patient.gender}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Emergency Contact</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <UserRound className="h-4 w-4 text-muted-foreground" /><span>{patient.emergencyContact.name}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="h-4 w-4 text-muted-foreground" /><span>{patient.emergencyContact.relationship}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" /><span>{patient.emergencyContact.phone}</span>
                </div>
              </CardContent>
            </Card>
            {patient.insuranceDetails && (
              <Card className="md:col-span-2">
                <CardHeader><CardTitle className="text-base">Insurance Details</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div><p className="text-xs text-muted-foreground">Provider</p><p className="text-sm font-medium">{patient.insuranceDetails.provider}</p></div>
                    <div><p className="text-xs text-muted-foreground">Policy Number</p><p className="text-sm font-medium">{patient.insuranceDetails.policyNumber}</p></div>
                    <div><p className="text-xs text-muted-foreground">Expiry Date</p><p className="text-sm font-medium">{patient.insuranceDetails.expiryDate}</p></div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Medical History */}
        <TabsContent value="medical">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-destructive" />Allergies</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {history?.allergies.map((a, i) => (
                    <Badge key={i} variant="outline" className="bg-destructive/5 text-destructive border-destructive/20">{a}</Badge>
                  )) || <p className="text-sm text-muted-foreground">None reported</p>}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Heart className="h-4 w-4 text-primary" />Conditions</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {history?.conditions.map((c, i) => (
                    <Badge key={i} variant="outline" className="bg-primary/5 text-primary border-primary/20">{c}</Badge>
                  )) || <p className="text-sm text-muted-foreground">None reported</p>}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Pill className="h-4 w-4 text-secondary" />Medications</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {history?.medications.map((m, i) => (
                    <Badge key={i} variant="outline" className="bg-secondary/5 text-secondary border-secondary/20">{m}</Badge>
                  )) || <p className="text-sm text-muted-foreground">None</p>}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-base">Surgeries</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {history?.surgeries && history.surgeries.length > 0
                    ? history.surgeries.map((s, i) => <Badge key={i} variant="outline">{s}</Badge>)
                    : <p className="text-sm text-muted-foreground">None</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Appointments */}
        <TabsContent value="appointments">
          <Card>
            <CardHeader><CardTitle className="text-base">Appointment History</CardTitle></CardHeader>
            <CardContent>
              {appointments.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No appointments found</p>
              ) : (
                <div className="space-y-3">
                  {appointments.map(a => (
                    <div key={a.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="text-sm font-medium">{a.service}</p>
                        <p className="text-xs text-muted-foreground">{a.doctorName} · {a.date} at {a.time}</p>
                      </div>
                      <Badge variant="outline" className={a.status === "completed" ? "bg-secondary/10 text-secondary" : "bg-primary/10 text-primary"}>
                        {a.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Prescriptions */}
        <TabsContent value="prescriptions">
          <Card>
            <CardHeader><CardTitle className="text-base">Prescriptions</CardTitle></CardHeader>
            <CardContent>
              {prescriptions.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No prescriptions found</p>
              ) : (
                <div className="space-y-3">
                  {prescriptions.map(rx => (
                    <div key={rx.id} className="rounded-lg border p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{rx.diagnosis}</p>
                        <span className="text-xs text-muted-foreground">{rx.date}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Dr. {rx.doctorName}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {rx.medications.map((m, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{m.name} {m.dosage}</Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientDetail;
