import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { mockPatients } from "@/data/mockData";
import { Activity, Heart, Thermometer, Wind, Droplets, AlertTriangle, Wifi, WifiOff, BatteryFull, BatteryLow, BatteryMedium, Bluetooth, Watch, Cpu } from "lucide-react";
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

interface IoTDevice {
  id: string;
  name: string;
  type: "heart_monitor" | "bp_cuff" | "pulse_oximeter" | "thermometer" | "wearable";
  status: "connected" | "disconnected" | "pairing";
  battery: number;
  signal: number;
  lastSync: string;
  firmware: string;
}

const mockDevices: IoTDevice[] = [
  { id: "dev-1", name: "CardioSense Pro", type: "heart_monitor", status: "connected", battery: 87, signal: 95, lastSync: "Just now", firmware: "v3.2.1" },
  { id: "dev-2", name: "PressureGuard X1", type: "bp_cuff", status: "connected", battery: 62, signal: 88, lastSync: "2s ago", firmware: "v2.8.0" },
  { id: "dev-3", name: "OxiPulse Mini", type: "pulse_oximeter", status: "connected", battery: 45, signal: 72, lastSync: "5s ago", firmware: "v1.5.3" },
  { id: "dev-4", name: "ThermoSync IR", type: "thermometer", status: "disconnected", battery: 12, signal: 0, lastSync: "5 min ago", firmware: "v1.2.0" },
  { id: "dev-5", name: "HealthBand Ultra", type: "wearable", status: "connected", battery: 93, signal: 98, lastSync: "Just now", firmware: "v4.0.2" },
];

const deviceIcons = {
  heart_monitor: Heart,
  bp_cuff: Activity,
  pulse_oximeter: Droplets,
  thermometer: Thermometer,
  wearable: Watch,
};

const generateVital = (base: number, variance: number) =>
  Math.round(base + (Math.random() - 0.5) * variance * 2);

const getStatus = (hr: number, sys: number, spo2: number) => {
  if (hr > 120 || hr < 50 || sys > 180 || sys < 80 || spo2 < 90) return "critical";
  if (hr > 100 || hr < 60 || sys > 140 || sys < 90 || spo2 < 95) return "warning";
  return "normal";
};

const statusColors = {
  normal: "bg-secondary/20 text-secondary border-secondary/30",
  warning: "bg-amber-100 text-amber-800 border-amber-300",
  critical: "bg-destructive/20 text-destructive border-destructive/30 animate-pulse",
};

const BatteryIcon = ({ level }: { level: number }) => {
  if (level > 60) return <BatteryFull className="h-4 w-4 text-secondary" />;
  if (level > 25) return <BatteryMedium className="h-4 w-4 text-amber-500" />;
  return <BatteryLow className="h-4 w-4 text-destructive" />;
};

const MonitoringPage = () => {
  const [selectedPatient, setSelectedPatient] = useState(mockPatients[0]?.id || "");
  const [vitals, setVitals] = useState<VitalSign[]>([]);
  const [currentVitals, setCurrentVitals] = useState<VitalSign | null>(null);
  const [devices, setDevices] = useState<IoTDevice[]>(mockDevices);

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

      // Simulate device battery drain & signal fluctuation
      setDevices(prev => prev.map(d => ({
        ...d,
        battery: Math.max(5, d.battery - (Math.random() > 0.8 ? 1 : 0)),
        signal: d.status === "connected" ? Math.min(100, Math.max(60, d.signal + Math.round((Math.random() - 0.5) * 6))) : 0,
        lastSync: d.status === "connected" ? "Just now" : d.lastSync,
      })));

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

  const toggleDevice = (id: string) => {
    setDevices(prev => prev.map(d => {
      if (d.id !== id) return d;
      const newStatus = d.status === "connected" ? "disconnected" : "pairing";
      if (newStatus === "pairing") {
        setTimeout(() => {
          setDevices(curr => curr.map(dd =>
            dd.id === id ? { ...dd, status: "connected", signal: 85 } : dd
          ));
          toast.success(`${d.name} connected successfully`);
        }, 2000);
      }
      return { ...d, status: newStatus, signal: newStatus === "disconnected" ? 0 : d.signal };
    }));
  };

  if (!currentVitals) return null;

  const status = getStatus(currentVitals.heartRate, currentVitals.systolic, currentVitals.spo2);
  const patient = mockPatients.find(p => p.id === selectedPatient);
  const connectedCount = devices.filter(d => d.status === "connected").length;

  const vitalCards = [
    { label: "Heart Rate", value: `${currentVitals.heartRate}`, unit: "bpm", icon: Heart, color: "text-destructive", warn: currentVitals.heartRate > 100 || currentVitals.heartRate < 60 },
    { label: "Blood Pressure", value: `${currentVitals.systolic}/${currentVitals.diastolic}`, unit: "mmHg", icon: Activity, color: "text-primary", warn: currentVitals.systolic > 140 },
    { label: "SpO2", value: `${currentVitals.spo2}`, unit: "%", icon: Droplets, color: "text-primary", warn: currentVitals.spo2 < 95 },
    { label: "Temperature", value: `${currentVitals.temperature}`, unit: "°C", icon: Thermometer, color: "text-amber-500", warn: currentVitals.temperature > 37.5 },
    { label: "Respiratory Rate", value: `${currentVitals.respiratoryRate}`, unit: "br/min", icon: Wind, color: "text-secondary", warn: currentVitals.respiratoryRate > 20 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Real-Time Monitoring</h1>
          <p className="text-sm text-muted-foreground">IoT Device Integration — Live Vitals Feed</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="gap-1">
            <Bluetooth className="h-3 w-3" />
            {connectedCount}/{devices.length} Devices
          </Badge>
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

      {/* IoT Devices Panel */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Cpu className="h-4 w-4 text-primary" />
            Connected IoT Devices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {devices.map(device => {
              const DevIcon = deviceIcons[device.type];
              return (
                <div
                  key={device.id}
                  className={`relative rounded-lg border p-3 transition-all cursor-pointer hover:shadow-md ${
                    device.status === "connected"
                      ? "border-secondary/40 bg-secondary/5"
                      : device.status === "pairing"
                      ? "border-primary/40 bg-primary/5 animate-pulse"
                      : "border-border bg-muted/30 opacity-70"
                  }`}
                  onClick={() => toggleDevice(device.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <DevIcon className={`h-5 w-5 ${device.status === "connected" ? "text-secondary" : "text-muted-foreground"}`} />
                    {device.status === "connected" ? (
                      <Wifi className="h-3.5 w-3.5 text-secondary" />
                    ) : device.status === "pairing" ? (
                      <Wifi className="h-3.5 w-3.5 text-primary animate-pulse" />
                    ) : (
                      <WifiOff className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                  </div>
                  <p className="text-xs font-semibold truncate">{device.name}</p>
                  <p className="text-[10px] text-muted-foreground mb-2">
                    {device.status === "pairing" ? "Pairing..." : device.lastSync}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <BatteryIcon level={device.battery} />
                      <span className="text-[10px] text-muted-foreground">{device.battery}%</span>
                    </div>
                    {device.status === "connected" && (
                      <div className="flex items-center gap-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" />
                        <span className="text-[10px] text-muted-foreground">{device.signal}%</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Vital Signs Cards */}
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

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Heart Rate Trend</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={vitals}>
                <defs>
                  <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="timestamp" className="text-xs" tick={{ fontSize: 10 }} />
                <YAxis domain={[40, 140]} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Area type="monotone" dataKey="heartRate" stroke="hsl(var(--destructive))" fill="url(#hrGrad)" strokeWidth={2} />
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
                <Line type="monotone" dataKey="systolic" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="diastolic" stroke="hsl(var(--secondary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Patient Info */}
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
