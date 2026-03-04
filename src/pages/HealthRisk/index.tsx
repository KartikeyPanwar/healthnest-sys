import { useState, useMemo, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { mockPatients } from "@/data/mockData";
import {
  Brain, ShieldAlert, TrendingUp, AlertTriangle, CheckCircle,
  Activity, Heart, Pill, Dna, Scale, Cigarette, Wine,
  Download, Printer, Share2, FileText, CalendarPlus, ChevronRight,
  Zap, Eye, Users
} from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { toast } from "sonner";

interface RiskFactor {
  name: string;
  score: number;
  maxScore: number;
  level: "low" | "moderate" | "high" | "critical";
  description: string;
  icon: React.ReactNode;
  detail: string;
}

interface HealthPrediction {
  overallRisk: number;
  riskLevel: "low" | "moderate" | "high" | "critical";
  factors: RiskFactor[];
  recommendations: { text: string; priority: "low" | "medium" | "high"; category: string }[];
  trendData: { month: string; risk: number }[];
}

const computeRisk = (patientId: string): HealthPrediction => {
  const patient = mockPatients.find(p => p.id === patientId);
  if (!patient) return { overallRisk: 0, riskLevel: "low", factors: [], recommendations: [], trendData: [] };

  const factors: RiskFactor[] = [];
  let totalScore = 0;
  let maxTotal = 0;

  // Age risk
  const age = new Date().getFullYear() - new Date(patient.dob).getFullYear();
  const ageScore = age > 65 ? 35 : age > 50 ? 22 : age > 40 ? 12 : 5;
  factors.push({ name: "Age", score: ageScore, maxScore: 35, level: ageScore > 22 ? "high" : ageScore > 12 ? "moderate" : "low", description: `${age} years old`, icon: <Users className="h-4 w-4" />, detail: `Age is a significant factor. Patients over 50 have elevated cardiovascular and metabolic risks. Current age: ${age}.` });
  totalScore += ageScore; maxTotal += 35;

  // Pre-existing conditions
  const conditions = patient.medicalHistory?.conditions || [];
  const condScore = Math.min(conditions.length * 18, 40);
  factors.push({ name: "Conditions", score: condScore, maxScore: 40, level: condScore > 28 ? "critical" : condScore > 15 ? "high" : condScore > 8 ? "moderate" : "low", description: conditions.length > 0 ? conditions.join(", ") : "None reported", icon: <Heart className="h-4 w-4" />, detail: `Pre-existing conditions increase risk. Found: ${conditions.length > 0 ? conditions.join(", ") : "none"}.` });
  totalScore += condScore; maxTotal += 40;

  // Allergy sensitivity
  const allergies = patient.medicalHistory?.allergies.filter(a => a !== "None") || [];
  const allergyScore = Math.min(allergies.length * 10, 20);
  factors.push({ name: "Allergies", score: allergyScore, maxScore: 20, level: allergyScore > 15 ? "high" : allergyScore > 5 ? "moderate" : "low", description: allergies.length > 0 ? allergies.join(", ") : "None", icon: <ShieldAlert className="h-4 w-4" />, detail: `Drug and environmental allergies can complicate treatment. Known allergies: ${allergies.length > 0 ? allergies.join(", ") : "none"}.` });
  totalScore += allergyScore; maxTotal += 20;

  // Medication interactions
  const meds = patient.medicalHistory?.medications || [];
  const medScore = Math.min(meds.length * 12, 30);
  factors.push({ name: "Medications", score: medScore, maxScore: 30, level: medScore > 20 ? "high" : medScore > 10 ? "moderate" : "low", description: `${meds.length} active`, icon: <Pill className="h-4 w-4" />, detail: `Polypharmacy increases interaction risk. Active medications: ${meds.length > 0 ? meds.join(", ") : "none"}.` });
  totalScore += medScore; maxTotal += 30;

  // BMI estimate (simulated)
  const bmiSeed = patientId.charCodeAt(patientId.length - 1) % 4;
  const bmiScore = [5, 12, 22, 30][bmiSeed];
  const bmiLabel = ["Normal", "Overweight", "Obese Class I", "Obese Class II"][bmiSeed];
  factors.push({ name: "BMI", score: bmiScore, maxScore: 30, level: bmiScore > 22 ? "high" : bmiScore > 12 ? "moderate" : "low", description: bmiLabel, icon: <Scale className="h-4 w-4" />, detail: `Body Mass Index category: ${bmiLabel}. Higher BMI correlates with cardiovascular disease, diabetes, and joint issues.` });
  totalScore += bmiScore; maxTotal += 30;

  // Lifestyle (simulated)
  const lifeSeed = (patientId.charCodeAt(1) + patientId.charCodeAt(2)) % 3;
  const lifeScore = [3, 14, 25][lifeSeed];
  const lifeLabel = ["Active lifestyle", "Sedentary", "High-risk habits"][lifeSeed];
  factors.push({ name: "Lifestyle", score: lifeScore, maxScore: 25, level: lifeScore > 18 ? "high" : lifeScore > 8 ? "moderate" : "low", description: lifeLabel, icon: <Activity className="h-4 w-4" />, detail: `Lifestyle assessment: ${lifeLabel}. Physical activity, diet, and stress management all impact overall health risk.` });
  totalScore += lifeScore; maxTotal += 25;

  // Genetic predisposition (simulated)
  const genSeed = patientId.charCodeAt(patientId.length - 1) % 3;
  const genScore = [4, 12, 22][genSeed];
  const genLabel = ["Low predisposition", "Moderate family history", "Strong family history"][genSeed];
  factors.push({ name: "Genetics", score: genScore, maxScore: 25, level: genScore > 18 ? "high" : genScore > 8 ? "moderate" : "low", description: genLabel, icon: <Dna className="h-4 w-4" />, detail: `Genetic risk assessment: ${genLabel}. Family history of chronic diseases influences long-term health outlook.` });
  totalScore += genScore; maxTotal += 25;

  const overallRisk = Math.round((totalScore / maxTotal) * 100);
  const riskLevel: HealthPrediction["riskLevel"] = overallRisk > 70 ? "critical" : overallRisk > 50 ? "high" : overallRisk > 30 ? "moderate" : "low";

  // Recommendations
  const recommendations: HealthPrediction["recommendations"] = [];
  if (conditions.some(c => c.toLowerCase().includes("diabetes"))) recommendations.push({ text: "Schedule quarterly HbA1c monitoring", priority: "high", category: "Monitoring" });
  if (conditions.some(c => c.toLowerCase().includes("hypertension"))) recommendations.push({ text: "Daily blood pressure monitoring recommended", priority: "high", category: "Monitoring" });
  if (age > 50) recommendations.push({ text: "Annual cardiovascular screening advised", priority: "medium", category: "Screening" });
  if (meds.length > 1) recommendations.push({ text: "Review medication interactions with pharmacist", priority: "high", category: "Medication" });
  if (allergies.length > 0) recommendations.push({ text: "Update allergy wristband before procedures", priority: "medium", category: "Safety" });
  if (bmiScore > 12) recommendations.push({ text: "Nutritional counseling and weight management program", priority: "medium", category: "Lifestyle" });
  if (lifeScore > 8) recommendations.push({ text: "Increase physical activity to 150 min/week", priority: "medium", category: "Lifestyle" });
  if (genScore > 12) recommendations.push({ text: "Genetic screening for hereditary conditions", priority: "low", category: "Screening" });
  if (recommendations.length === 0) recommendations.push({ text: "Continue routine health checkups", priority: "low", category: "General" });

  // Trend data (simulated 6-month history)
  const trendData = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"].map((month, i) => ({
    month,
    risk: Math.max(10, Math.min(95, overallRisk + Math.round((Math.sin(i * 1.2 + totalScore) * 12)) - (5 - i) * 2))
  }));

  return { overallRisk, riskLevel, factors, recommendations, trendData };
};

const riskConfig = {
  low: { color: "hsl(var(--secondary))", bg: "bg-secondary/10 text-secondary", border: "border-secondary/30", label: "LOW RISK" },
  moderate: { color: "hsl(45, 93%, 47%)", bg: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400", border: "border-amber-300 dark:border-amber-700", label: "MODERATE RISK" },
  high: { color: "hsl(25, 95%, 53%)", bg: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400", border: "border-orange-300 dark:border-orange-700", label: "HIGH RISK" },
  critical: { color: "hsl(var(--destructive))", bg: "bg-destructive/10 text-destructive", border: "border-destructive/30", label: "CRITICAL RISK" },
};

const factorLevelColor = (level: string) => {
  switch (level) {
    case "low": return "text-secondary";
    case "moderate": return "text-amber-500";
    case "high": return "text-orange-500";
    case "critical": return "text-destructive";
    default: return "text-muted-foreground";
  }
};

const progressColorClass = (score: number, max: number) => {
  const pct = (score / max) * 100;
  if (pct > 70) return "[&>div]:bg-destructive";
  if (pct > 50) return "[&>div]:bg-orange-500";
  if (pct > 30) return "[&>div]:bg-amber-500";
  return "[&>div]:bg-secondary";
};

const priorityBadge = (p: string) => {
  switch (p) {
    case "high": return "bg-destructive/10 text-destructive border-destructive/20";
    case "medium": return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800";
    default: return "bg-secondary/10 text-secondary border-secondary/20";
  }
};

const HealthRiskPage = () => {
  const [selectedPatient, setSelectedPatient] = useState(mockPatients[0]?.id || "");
  const [detailFactor, setDetailFactor] = useState<RiskFactor | null>(null);
  const [showReport, setShowReport] = useState(false);
  const prediction = useMemo(() => computeRisk(selectedPatient), [selectedPatient]);
  const patient = mockPatients.find(p => p.id === selectedPatient);
  const config = riskConfig[prediction.riskLevel];

  const radarData = prediction.factors.map(f => ({
    subject: f.name,
    score: Math.round((f.score / f.maxScore) * 100),
    fullMark: 100,
  }));

  const handleExportPDF = () => {
    toast.success("Health Risk Report exported as PDF", { description: `Report for ${patient?.name} generated successfully.` });
  };
  const handlePrint = () => {
    window.print();
    toast.success("Print dialog opened");
  };
  const handleShare = () => {
    navigator.clipboard.writeText(`Health Risk Report - ${patient?.name}: Overall Risk ${prediction.overallRisk}% (${prediction.riskLevel.toUpperCase()})`);
    toast.success("Report summary copied to clipboard");
  };
  const handleSchedule = () => {
    toast.success("Appointment scheduling initiated", { description: `Follow-up appointment for ${patient?.name} is being prepared.` });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            AI Health Risk Prediction
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Advanced predictive analytics powered by patient medical profiles</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={selectedPatient} onValueChange={setSelectedPatient}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Select patient" />
            </SelectTrigger>
            <SelectContent>
              {mockPatients.map(p => (
                <SelectItem key={p.id} value={p.id}>
                  <span className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{p.name.charAt(0)}</span>
                    {p.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleExportPDF}><Download className="mr-1.5 h-4 w-4" />Export</Button>
          <Button variant="outline" size="sm" onClick={handlePrint}><Printer className="mr-1.5 h-4 w-4" />Print</Button>
          <Button variant="outline" size="sm" onClick={handleShare}><Share2 className="mr-1.5 h-4 w-4" />Share</Button>
        </div>
      </div>

      {/* Risk Overview Row */}
      <div className="grid gap-6 md:grid-cols-12">
        {/* Overall Score */}
        <Card className={`md:col-span-4 border-2 ${config.border} transition-all duration-500`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overall Risk Score</CardTitle>
            <CardDescription>{patient?.name} · {patient?.bloodType} · {patient?.gender}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 pt-2">
            <div className="relative flex h-40 w-40 items-center justify-center">
              <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="70" fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
                <circle
                  cx="80" cy="80" r="70" fill="none"
                  stroke={config.color}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  strokeDashoffset={`${2 * Math.PI * 70 * (1 - prediction.overallRisk / 100)}`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="flex flex-col items-center">
                <span className="text-4xl font-black tabular-nums" style={{ color: config.color }}>{prediction.overallRisk}</span>
                <span className="text-xs text-muted-foreground font-medium">/ 100</span>
              </div>
            </div>
            <Badge className={`${config.bg} text-xs font-semibold px-3 py-1 ${prediction.riskLevel === "critical" ? "animate-pulse" : ""}`}>
              {prediction.riskLevel === "critical" && <AlertTriangle className="mr-1 h-3 w-3" />}
              {config.label}
            </Badge>
            <Button size="sm" variant="outline" className="w-full" onClick={() => setShowReport(true)}>
              <FileText className="mr-1.5 h-4 w-4" />View Full Report
            </Button>
          </CardContent>
        </Card>

        {/* Radar Chart */}
        <Card className="md:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Risk" dataKey="score" stroke={config.color} fill={config.color} fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Trend Chart */}
        <Card className="md:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">6-Month Risk Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={prediction.trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={config.color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={config.color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 }} />
                <Area type="monotone" dataKey="risk" stroke={config.color} strokeWidth={2} fill="url(#riskGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabs: Factors & Recommendations */}
      <Tabs defaultValue="factors" className="space-y-4">
        <TabsList>
          <TabsTrigger value="factors" className="gap-1.5"><Zap className="h-3.5 w-3.5" />Risk Factors</TabsTrigger>
          <TabsTrigger value="recommendations" className="gap-1.5"><TrendingUp className="h-3.5 w-3.5" />Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="factors">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {prediction.factors.map(f => (
              <Card
                key={f.name}
                className="group cursor-pointer transition-all hover:shadow-md hover:border-primary/30"
                onClick={() => setDetailFactor(f)}
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-muted ${factorLevelColor(f.level)}`}>
                        {f.icon}
                      </div>
                      <span className="text-sm font-semibold">{f.name}</span>
                    </div>
                    <span className={`text-lg font-bold tabular-nums ${factorLevelColor(f.level)}`}>
                      {Math.round((f.score / f.maxScore) * 100)}%
                    </span>
                  </div>
                  <Progress value={(f.score / f.maxScore) * 100} className={`h-2 ${progressColorClass(f.score, f.maxScore)}`} />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground truncate max-w-[70%]">{f.description}</p>
                    <Eye className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommendations">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-3">
                {prediction.recommendations.map((r, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50">
                    <CheckCircle className={`mt-0.5 h-5 w-5 shrink-0 ${r.priority === "high" ? "text-destructive" : r.priority === "medium" ? "text-amber-500" : "text-secondary"}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{r.text}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Category: {r.category}</p>
                    </div>
                    <Badge variant="outline" className={`shrink-0 text-[10px] ${priorityBadge(r.priority)}`}>
                      {r.priority.toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" onClick={handleSchedule}>
                  <CalendarPlus className="mr-1.5 h-4 w-4" />Schedule Follow-up
                </Button>
                <Button size="sm" variant="outline" onClick={handleExportPDF}>
                  <Download className="mr-1.5 h-4 w-4" />Export Recommendations
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Factor Detail Dialog */}
      <Dialog open={!!detailFactor} onOpenChange={(open) => !open && setDetailFactor(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {detailFactor?.icon}
              {detailFactor?.name} Analysis
            </DialogTitle>
            <DialogDescription>Detailed breakdown for {patient?.name}</DialogDescription>
          </DialogHeader>
          {detailFactor && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm text-muted-foreground">Risk Score</span>
                <span className={`text-2xl font-bold ${factorLevelColor(detailFactor.level)}`}>
                  {Math.round((detailFactor.score / detailFactor.maxScore) * 100)}%
                </span>
              </div>
              <Progress value={(detailFactor.score / detailFactor.maxScore) * 100} className={`h-3 ${progressColorClass(detailFactor.score, detailFactor.maxScore)}`} />
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Assessment</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{detailFactor.detail}</p>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <span className="text-sm">Status</span>
                <Badge className={riskConfig[detailFactor.level === "critical" ? "critical" : detailFactor.level].bg}>
                  {detailFactor.level.toUpperCase()}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Full Report Dialog */}
      <Dialog open={showReport} onOpenChange={setShowReport}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" />Full Risk Report</DialogTitle>
            <DialogDescription>{patient?.name} · Generated {new Date().toLocaleDateString()}</DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border p-3 text-center">
                <p className="text-2xl font-bold" style={{ color: config.color }}>{prediction.overallRisk}%</p>
                <p className="text-xs text-muted-foreground">Overall Risk</p>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <p className="text-2xl font-bold text-foreground">{prediction.factors.length}</p>
                <p className="text-xs text-muted-foreground">Factors Analyzed</p>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <p className="text-2xl font-bold text-foreground">{prediction.recommendations.length}</p>
                <p className="text-xs text-muted-foreground">Recommendations</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2">Risk Factors Summary</h3>
              <div className="space-y-2">
                {prediction.factors.map(f => (
                  <div key={f.name} className="flex items-center justify-between text-sm border-b pb-2 last:border-0">
                    <span className="flex items-center gap-2">{f.icon}{f.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{f.description}</span>
                      <Badge variant="outline" className={`text-[10px] ${riskConfig[f.level === "critical" ? "critical" : f.level].bg}`}>
                        {Math.round((f.score / f.maxScore) * 100)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2">Recommendations</h3>
              <ul className="space-y-1.5">
                {prediction.recommendations.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <ChevronRight className="mt-0.5 h-3.5 w-3.5 text-primary shrink-0" />
                    <span>{r.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-2 pt-2">
              <Button size="sm" onClick={handleExportPDF}><Download className="mr-1.5 h-4 w-4" />Download PDF</Button>
              <Button size="sm" variant="outline" onClick={handlePrint}><Printer className="mr-1.5 h-4 w-4" />Print Report</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HealthRiskPage;
