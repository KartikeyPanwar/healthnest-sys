import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockPatients } from "@/data/mockData";
import { Activity, Heart, Thermometer, Wind, Droplets, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { toast } from "sonner";

interface VitalSign {
  timestamp: string;
  heartRate: number;
  systolic: number;
  diastolic: number;
  spo2: number;
  temperature: number;
  respiratoryRate: number;
}

const generateVital = (base: number, variance: number) =>
  Math.round(base + (Math.random() - 0.5) * variance * 2);

const getStatus = (hr: number, sys: number, spo2: number) => {
  if (hr > 120 || hr < 50 || sys > 180 || sys < 80 || spo2 < 90) return "critical";
  if (hr > 100 || hr < 60 || sys > 140 || sys < 90 || spo2 < 95) return "warning";
  return "normal";
};

const statusColors = {
  normal: "bg-green-100 text-green-800 border-green-300",
  warning: "bg-amber-100 text-amber-800 border-amber-300",
  critical: "bg-red-100 text-red-800 border-red-300 animate-pulse",
};

const MonitoringPage = () => {
  const [selectedPatient, setSelectedPatient] = useState(mockPatients[0]?.id || "");
  const [vitals, setVitals] = useState<VitalSign[]>([]);
  const [currentVitals, setCurrentVitals] = useState<VitalSign | null>(null);

  const generateReading = useCallback((): VitalSign => {
    const patient = mockPatients.find(p => p.id === selectedPatient);
    const hasHypertension = patient?.medicalHistory?.conditions.some(c => c.toLowerCase().includes("hypertension"));
    
    return {
      timestamp: new Date().toLocaleTimeString(),
      heartRate: generateVital(hasHypertension ? 82 : 75, 15),
      systolic: generateVital(hasHypertension ? 145 : 120, 20),
      diastolic: generateVital(hasHypertension ? 92 : 78, 10),
      spo2: generateVital(97, 3),
      temperature: parseFloat((36.6 + (Math.random() - 0.5) * 1.2).toFixed(1)),
      respiratoryRate: generateVital(16, 4),
    };
  }, [selectedPatient]);

  useEffect(() => {
    const initial = Array.from({ length: 20 }, () => generateReading());
    setVitals(initial);
    setCurrentVitals(initial[initial.length - 1]);
  }, [selectedPatient, generateReading]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newReading = generateReading();
      setCurrentVitals(newReading);
      setVitals(prev => [...prev.slice(-29), newReading]);

      const status = getStatus(newReading.heartRate, newReading.systolic, newReading.spo2);
      if (status === "critical") {
        const patient = mockPatients.find(p => p.id === selectedPatient);
        toast.error(`🚨 Critical alert for ${patient?.name}!`, {
          description: `HR: ${newReading.heartRate} | BP: ${newReading.systolic}/${newReading.diastolic} | SpO2: ${newReading.spo2}%`,
          duration: 5000,
        });
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [selectedPatient, generateReading]);

  if (!currentVitals) return null;

  const status = getStatus(currentVitals.heartRate, currentVitals.systolic, currentVitals.spo2);
  const patient = mockPatients.find(p => p.id === selectedPatient);

  const vitalCards = [
    { label: "Heart Rate", value: `${currentVitals.heartRate}`, unit: "bpm", icon: Heart, color: "text-red-500", warn: currentVitals.heartRate > 100 || currentVitals.heartRate < 60 },
    { label: "Blood Pressure", value: `${currentVitals.systolic}/${currentVitals.diastolic}`, unit: "mmHg", icon: Activity, color: "text-blue-500", warn: currentVitals.systolic > 140 },
    { label: "SpO2", value: `${currentVitals.spo2}`, unit: "%", icon: Droplets, color: "text-cyan-500", warn: currentVitals.spo2 < 95 },
    { label: "Temperature", value: `${currentVitals.temperature}`, unit: "°C", icon: Thermometer, color: "text-orange-500", warn: currentVitals.temperature > 37.5 },
    { label: "Respiratory Rate", value: `${currentVitals.respiratoryRate}`, unit: "br/min", icon: Wind, color: "text-emerald-500", warn: currentVitals.respiratoryRate > 20 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Real-Time Monitoring</h1>
          <p className="text-sm text-muted-foreground">IoT Device Integration — Simulated Vitals</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={statusColors[status]}>
            {status === "critical" && <AlertTriangle className="mr-1 h-3 w-3" />}
            {status.toUpperCase()}
          </Badge>
          <Select value={selectedPatient} onValueChange={setSelectedPatient}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select patient" />
            </SelectTrigger>
            <SelectContent>
              {mockPatients.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {vitalCards.map(v => (
          <Card key={v.label} className={v.warn ? "border-destructive/50 shadow-destructive/10 shadow-md" : ""}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className={`rounded-full bg-muted p-2 ${v.color}`}>
                <v.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{v.label}</p>
                <p className="text-xl font-bold">{v.value} <span className="text-xs font-normal text-muted-foreground">{v.unit}</span></p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Heart Rate Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={vitals}>
                <defs>
                  <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="timestamp" className="text-xs" tick={{ fontSize: 10 }} />
                <YAxis domain={[40, 140]} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Area type="monotone" dataKey="heartRate" stroke="hsl(0, 84%, 60%)" fill="url(#hrGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Blood Pressure Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={vitals}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="timestamp" tick={{ fontSize: 10 }} />
                <YAxis domain={[50, 200]} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="systolic" stroke="hsl(199, 89%, 48%)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="diastolic" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {patient && (
        <Card>
          <CardHeader><CardTitle className="text-base">Patient Info — {patient.name}</CardTitle></CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs text-muted-foreground">Blood Type</p>
                <p className="font-medium">{patient.bloodType}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Allergies</p>
                <p className="font-medium">{patient.medicalHistory?.allergies.join(", ") || "None"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Conditions</p>
                <p className="font-medium">{patient.medicalHistory?.conditions.join(", ") || "None"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MonitoringPage;
