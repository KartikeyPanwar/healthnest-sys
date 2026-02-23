import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockPatients } from "@/data/mockData";
import { Brain, ShieldAlert, TrendingUp, AlertTriangle, CheckCircle, Info } from "lucide-react";

interface RiskFactor {
  name: string;
  score: number;
  level: "low" | "moderate" | "high";
  description: string;
}

interface HealthPrediction {
  overallRisk: number;
  riskLevel: "low" | "moderate" | "high" | "critical";
  factors: RiskFactor[];
  recommendations: string[];
}

const computeRisk = (patientId: string): HealthPrediction => {
  const patient = mockPatients.find(p => p.id === patientId);
  if (!patient) return { overallRisk: 0, riskLevel: "low", factors: [], recommendations: ["No patient data available."] };

  const factors: RiskFactor[] = [];
  let totalScore = 0;

  // Age risk
  const age = new Date().getFullYear() - new Date(patient.dob).getFullYear();
  const ageScore = age > 65 ? 30 : age > 50 ? 20 : age > 40 ? 10 : 5;
  factors.push({ name: "Age Factor", score: ageScore, level: ageScore > 20 ? "high" : ageScore > 10 ? "moderate" : "low", description: `Patient is ${age} years old` });
  totalScore += ageScore;

  // Conditions
  const conditions = patient.medicalHistory?.conditions || [];
  const condScore = conditions.length * 15;
  factors.push({ name: "Pre-existing Conditions", score: Math.min(condScore, 40), level: condScore > 25 ? "high" : condScore > 10 ? "moderate" : "low", description: conditions.length > 0 ? conditions.join(", ") : "None" });
  totalScore += Math.min(condScore, 40);

  // Allergies
  const allergies = patient.medicalHistory?.allergies.filter(a => a !== "None") || [];
  const allergyScore = allergies.length * 8;
  factors.push({ name: "Allergy Sensitivity", score: Math.min(allergyScore, 20), level: allergyScore > 15 ? "high" : allergyScore > 5 ? "moderate" : "low", description: allergies.length > 0 ? allergies.join(", ") : "None" });
  totalScore += Math.min(allergyScore, 20);

  // Medications
  const meds = patient.medicalHistory?.medications || [];
  const medScore = meds.length * 10;
  factors.push({ name: "Medication Interactions", score: Math.min(medScore, 25), level: medScore > 20 ? "high" : medScore > 8 ? "moderate" : "low", description: `${meds.length} active medication(s)` });
  totalScore += Math.min(medScore, 25);

  const overallRisk = Math.min(totalScore, 100);
  const riskLevel = overallRisk > 70 ? "critical" : overallRisk > 50 ? "high" : overallRisk > 25 ? "moderate" : "low";

  const recommendations: string[] = [];
  if (conditions.some(c => c.toLowerCase().includes("diabetes"))) recommendations.push("Schedule quarterly HbA1c monitoring");
  if (conditions.some(c => c.toLowerCase().includes("hypertension"))) recommendations.push("Daily blood pressure monitoring recommended");
  if (age > 50) recommendations.push("Annual cardiovascular screening advised");
  if (meds.length > 2) recommendations.push("Review medication interactions with pharmacist");
  if (allergies.length > 0) recommendations.push("Update allergy wristband before procedures");
  if (recommendations.length === 0) recommendations.push("Continue routine health checkups");

  return { overallRisk, riskLevel, factors, recommendations };
};

const riskColors = {
  low: "text-green-600",
  moderate: "text-amber-600",
  high: "text-orange-600",
  critical: "text-red-600",
};

const riskBg = {
  low: "bg-green-100 text-green-800",
  moderate: "bg-amber-100 text-amber-800",
  high: "bg-orange-100 text-orange-800",
  critical: "bg-red-100 text-red-800 animate-pulse",
};

const progressColor = (score: number) => {
  if (score > 70) return "[&>div]:bg-red-500";
  if (score > 50) return "[&>div]:bg-orange-500";
  if (score > 25) return "[&>div]:bg-amber-500";
  return "[&>div]:bg-green-500";
};

const HealthRiskPage = () => {
  const [selectedPatient, setSelectedPatient] = useState(mockPatients[0]?.id || "");
  const prediction = useMemo(() => computeRisk(selectedPatient), [selectedPatient]);
  const patient = mockPatients.find(p => p.id === selectedPatient);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" /> AI Health Risk Prediction
          </h1>
          <p className="text-sm text-muted-foreground">Predictive analysis based on patient medical profile</p>
        </div>
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

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Overall Risk Score</CardTitle>
            <CardDescription>{patient?.name}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="relative flex h-36 w-36 items-center justify-center rounded-full border-8 border-muted">
              <span className={`text-4xl font-bold ${riskColors[prediction.riskLevel]}`}>{prediction.overallRisk}</span>
              <span className="absolute bottom-2 text-xs text-muted-foreground">/100</span>
            </div>
            <Badge className={riskBg[prediction.riskLevel]}>
              {prediction.riskLevel === "critical" && <AlertTriangle className="mr-1 h-3 w-3" />}
              {prediction.riskLevel.toUpperCase()} RISK
            </Badge>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Risk Factors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {prediction.factors.map(f => (
              <div key={f.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className={`h-4 w-4 ${riskColors[f.level]}`} />
                    <span className="text-sm font-medium">{f.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{f.score}%</span>
                </div>
                <Progress value={f.score} className={`h-2 ${progressColor(f.score)}`} />
                <p className="text-xs text-muted-foreground">{f.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" /> AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {prediction.recommendations.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                {r}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthRiskPage;
