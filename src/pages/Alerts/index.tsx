import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockPatients } from "@/data/mockData";
import { AlertTriangle, Bell, BellOff, CheckCircle, Clock, Siren, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

interface Alert {
  id: string;
  patientId: string;
  patientName: string;
  type: "critical" | "warning" | "info";
  message: string;
  vital: string;
  value: string;
  timestamp: Date;
  acknowledged: boolean;
}

const alertStyles = {
  critical: { bg: "border-red-400 bg-red-50 dark:bg-red-950/30", badge: "bg-red-100 text-red-800", icon: Siren },
  warning: { bg: "border-amber-400 bg-amber-50 dark:bg-amber-950/30", badge: "bg-amber-100 text-amber-800", icon: AlertTriangle },
  info: { bg: "border-blue-400 bg-blue-50 dark:bg-blue-950/30", badge: "bg-blue-100 text-blue-800", icon: Bell },
};

const AlertsPage = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoGenerate, setAutoGenerate] = useState(true);

  const generateAlert = useCallback((): Alert => {
    const patient = mockPatients[Math.floor(Math.random() * mockPatients.length)];
    const scenarios = [
      { type: "critical" as const, vital: "Heart Rate", value: `${130 + Math.floor(Math.random() * 30)} bpm`, message: "Tachycardia detected — heart rate critically elevated" },
      { type: "critical" as const, vital: "SpO2", value: `${82 + Math.floor(Math.random() * 6)}%`, message: "Hypoxemia alert — oxygen saturation critically low" },
      { type: "critical" as const, vital: "Blood Pressure", value: `${190 + Math.floor(Math.random() * 20)}/${100 + Math.floor(Math.random() * 15)} mmHg`, message: "Hypertensive crisis — immediate intervention required" },
      { type: "warning" as const, vital: "Temperature", value: `${38.2 + Math.random() * 1.5}°C`, message: "Elevated body temperature detected" },
      { type: "warning" as const, vital: "Heart Rate", value: `${50 + Math.floor(Math.random() * 8)} bpm`, message: "Bradycardia warning — heart rate below normal" },
      { type: "info" as const, vital: "Blood Pressure", value: `${135 + Math.floor(Math.random() * 10)}/${88 + Math.floor(Math.random() * 5)} mmHg`, message: "Mild blood pressure elevation noted" },
    ];
    const s = scenarios[Math.floor(Math.random() * scenarios.length)];
    return {
      id: `ALT-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      patientId: patient.id,
      patientName: patient.name,
      ...s,
      timestamp: new Date(),
      acknowledged: false,
    };
  }, []);

  useEffect(() => {
    // Seed 3 initial alerts
    setAlerts(Array.from({ length: 3 }, generateAlert));
  }, [generateAlert]);

  useEffect(() => {
    if (!autoGenerate) return;
    const interval = setInterval(() => {
      const newAlert = generateAlert();
      setAlerts(prev => [newAlert, ...prev].slice(0, 50));
      if (newAlert.type === "critical") {
        toast.error(`🚨 ${newAlert.patientName}: ${newAlert.message}`, { duration: 6000 });
      } else if (newAlert.type === "warning") {
        toast.warning(`⚠️ ${newAlert.patientName}: ${newAlert.message}`, { duration: 4000 });
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [autoGenerate, generateAlert]);

  const acknowledgeAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
    toast.success("Alert acknowledged");
  };

  const acknowledgeAll = () => {
    setAlerts(prev => prev.map(a => ({ ...a, acknowledged: true })));
    toast.success("All alerts acknowledged");
  };

  const clearAcknowledged = () => {
    setAlerts(prev => prev.filter(a => !a.acknowledged));
    toast.info("Cleared acknowledged alerts");
  };

  const activeCount = alerts.filter(a => !a.acknowledged).length;
  const criticalCount = alerts.filter(a => a.type === "critical" && !a.acknowledged).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Siren className="h-6 w-6 text-destructive" /> Emergency Alert System
          </h1>
          <p className="text-sm text-muted-foreground">Real-time critical alerts from IoT monitoring devices</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Switch checked={autoGenerate} onCheckedChange={setAutoGenerate} />
            <span>Simulate Alerts</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
            <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-full bg-red-100 p-2"><Siren className="h-5 w-5 text-red-600" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Critical Alerts</p>
              <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-full bg-amber-100 p-2"><AlertTriangle className="h-5 w-5 text-amber-600" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Active Alerts</p>
              <p className="text-2xl font-bold text-amber-600">{activeCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-full bg-green-100 p-2"><CheckCircle className="h-5 w-5 text-green-600" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Acknowledged</p>
              <p className="text-2xl font-bold text-green-600">{alerts.filter(a => a.acknowledged).length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={acknowledgeAll}>Acknowledge All</Button>
        <Button variant="ghost" size="sm" onClick={clearAcknowledged}>Clear Acknowledged</Button>
      </div>

      <div className="space-y-3">
        {alerts.length === 0 && (
          <Card><CardContent className="p-8 text-center text-muted-foreground">No alerts at this time</CardContent></Card>
        )}
        {alerts.map(alert => {
          const style = alertStyles[alert.type];
          const Icon = style.icon;
          return (
            <Card key={alert.id} className={`${style.bg} ${alert.acknowledged ? "opacity-50" : ""}`}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${alert.type === "critical" ? "text-red-600 animate-pulse" : alert.type === "warning" ? "text-amber-600" : "text-blue-600"}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{alert.patientName}</span>
                      <Badge className={style.badge}>{alert.type.toUpperCase()}</Badge>
                      <Badge variant="outline">{alert.vital}: {alert.value}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {alert.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                {!alert.acknowledged && (
                  <Button size="sm" variant="outline" onClick={() => acknowledgeAlert(alert.id)}>
                    Acknowledge
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AlertsPage;
