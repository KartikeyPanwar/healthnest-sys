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
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FileText, FilePlus, Search, UserRound, Pill, Calendar, Stethoscope,
  Printer, Eye, Clock, CheckCircle, AlertTriangle, RefreshCw
} from "lucide-react";
import { mockPrescriptions, mockPatients } from "@/data/mockData";
import { Prescription } from "@/types/prescription";
import { toast } from "sonner";

const getStatus = (rx: Prescription): "active" | "completed" | "follow-up" => {
  if (rx.followUp?.date) {
    const followDate = new Date(rx.followUp.date);
    if (followDate > new Date()) return "follow-up";
  }
  const rxDate = new Date(rx.date);
  const daysSince = (Date.now() - rxDate.getTime()) / (1000 * 60 * 60 * 24);
  return daysSince > 30 ? "completed" : "active";
};

const statusConfig = {
  active: { label: "Active", icon: CheckCircle, className: "bg-secondary/20 text-secondary border-secondary/30" },
  completed: { label: "Completed", icon: Clock, className: "bg-muted text-muted-foreground border-border" },
  "follow-up": { label: "Follow-up Due", icon: AlertTriangle, className: "bg-amber-100 text-amber-800 border-amber-300" },
};

const MedicalRecordsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [patientFilter, setPatientFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);

  const prescriptionsWithStatus = mockPrescriptions.map(rx => ({
    ...rx,
    status: getStatus(rx),
  }));

  const filtered = prescriptionsWithStatus.filter(rx =>
    (rx.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (patientFilter === "all" || rx.patientId === patientFilter) &&
    (statusFilter === "all" || rx.status === statusFilter)
  );

  const stats = {
    total: prescriptionsWithStatus.length,
    active: prescriptionsWithStatus.filter(r => r.status === "active").length,
    followUp: prescriptionsWithStatus.filter(r => r.status === "follow-up").length,
    completed: prescriptionsWithStatus.filter(r => r.status === "completed").length,
  };

  const handlePrint = (rx: Prescription) => {
    toast.success(`Printing prescription for ${rx.patientName}...`);
  };

  const handleRefill = (rx: Prescription) => {
    toast.success(`Refill request sent for ${rx.patientName}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl font-semibold">Prescription Management</h1>
          <p className="text-sm text-muted-foreground">Create, track, and manage patient prescriptions</p>
        </div>
        <Button onClick={() => navigate("/records/prescription/new")}>
          <FilePlus className="mr-2 h-4 w-4" />
          New Prescription
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total", value: stats.total, icon: FileText, color: "text-primary" },
          { label: "Active", value: stats.active, icon: CheckCircle, color: "text-secondary" },
          { label: "Follow-up Due", value: stats.followUp, icon: AlertTriangle, color: "text-amber-500" },
          { label: "Completed", value: stats.completed, icon: Clock, color: "text-muted-foreground" },
        ].map(s => (
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

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Prescriptions</CardTitle>
          <CardDescription>View and manage all prescriptions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by patient, doctor, or diagnosis..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={patientFilter} onValueChange={setPatientFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by patient" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Patients</SelectItem>
                {mockPatients.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="follow-up">Follow-up Due</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="mb-2 h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-medium">No prescriptions found</h3>
              <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters.</p>
              <Button variant="outline" className="mt-4" onClick={() => { setSearchTerm(""); setPatientFilter("all"); setStatusFilter("all"); }}>
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(rx => {
                const sc = statusConfig[rx.status];
                return (
                  <div key={rx.id} className="rounded-lg border bg-card p-4 transition-all hover:shadow-md">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                          <UserRound className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{rx.patientName}</h3>
                            <Badge className={sc.className}>
                              <sc.icon className="mr-1 h-3 w-3" />
                              {sc.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Stethoscope className="h-3 w-3" /> {rx.doctorName}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {rx.date}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setSelectedRx(rx)} className="gap-1">
                          <Eye className="h-3.5 w-3.5" /> View
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handlePrint(rx)} className="gap-1">
                          <Printer className="h-3.5 w-3.5" /> Print
                        </Button>
                        <Button variant="default" size="sm" onClick={() => handleRefill(rx)} className="gap-1">
                          <RefreshCw className="h-3.5 w-3.5" /> Refill
                        </Button>
                      </div>
                    </div>

                    <Separator className="my-3" />

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Diagnosis</p>
                        <p className="text-sm">{rx.diagnosis}</p>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {rx.medications.map((med, i) => (
                          <Badge key={i} variant="outline" className="gap-1 text-xs">
                            <Pill className="h-3 w-3" /> {med.name} {med.dosage}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
        {filtered.length > 0 && (
          <CardFooter className="flex justify-between border-t px-6 py-4">
            <span className="text-sm text-muted-foreground">
              Showing {filtered.length} of {mockPrescriptions.length} prescriptions
            </span>
          </CardFooter>
        )}
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedRx} onOpenChange={() => setSelectedRx(null)}>
        <DialogContent className="max-w-lg">
          {selectedRx && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Prescription #{selectedRx.id}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Patient</p>
                    <p className="font-medium">{selectedRx.patientName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Doctor</p>
                    <p className="font-medium">{selectedRx.doctorName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="font-medium">{selectedRx.date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <Badge className={statusConfig[getStatus(selectedRx)].className}>
                      {statusConfig[getStatus(selectedRx)].label}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Diagnosis</p>
                  <p className="text-sm">{selectedRx.diagnosis}</p>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Medications</p>
                  <div className="space-y-2">
                    {selectedRx.medications.map((med, i) => (
                      <div key={i} className="rounded-md border p-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold flex items-center gap-1">
                            <Pill className="h-3.5 w-3.5 text-primary" /> {med.name}
                          </p>
                          <Badge variant="outline">{med.dosage}</Badge>
                        </div>
                        <div className="mt-1 grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                          <span>Frequency: {med.frequency}</span>
                          <span>Duration: {med.duration}</span>
                        </div>
                        {med.instructions && (
                          <p className="mt-1 text-xs text-muted-foreground italic">{med.instructions}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {selectedRx.instructions && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Additional Instructions</p>
                    <p className="text-sm">{selectedRx.instructions}</p>
                  </div>
                )}

                {selectedRx.followUp && (
                  <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
                    <p className="text-xs font-medium text-amber-800 mb-1">Follow-up</p>
                    <p className="text-sm text-amber-900">{selectedRx.followUp.date} — {selectedRx.followUp.notes}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button className="flex-1 gap-1" onClick={() => { handlePrint(selectedRx); setSelectedRx(null); }}>
                    <Printer className="h-4 w-4" /> Print
                  </Button>
                  <Button variant="outline" className="flex-1 gap-1" onClick={() => { handleRefill(selectedRx); setSelectedRx(null); }}>
                    <RefreshCw className="h-4 w-4" /> Refill
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MedicalRecordsPage;
