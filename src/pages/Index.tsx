
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarPlus, ClipboardList, UserPlus, Activity, HeartPulse, Users, Calendar, FileText, Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  const quickActions = [
    {
      title: "Schedule Appointment",
      description: "Create a new patient appointment",
      icon: CalendarPlus,
      action: () => navigate("/appointments/new"),
    },
    {
      title: "Register Patient",
      description: "Add a new patient to the system",
      icon: UserPlus,
      action: () => navigate("/patients/new"),
    },
    {
      title: "View Appointments",
      description: "See today's scheduled appointments",
      icon: ClipboardList,
      action: () => navigate("/appointments"),
    },
    {
      title: "Patient Records",
      description: "Access medical records and history",
      icon: HeartPulse,
      action: () => navigate("/records"),
    },
  ];

  const stats = [
    {
      title: "Total Patients",
      value: "2,583",
      change: "+8.2%",
      changeLabel: "from last month",
      icon: Users,
      progress: 75,
      color: "from-primary to-primary/70",
      iconBg: "bg-primary/10 text-primary",
    },
    {
      title: "Today's Appointments",
      value: "24",
      change: "+4",
      changeLabel: "more than yesterday",
      icon: Calendar,
      progress: 40,
      color: "from-secondary to-secondary/70",
      iconBg: "bg-secondary/10 text-secondary",
    },
    {
      title: "Pending Reports",
      value: "7",
      change: "2",
      changeLabel: "urgent",
      icon: FileText,
      progress: 20,
      color: "from-destructive to-destructive/70",
      iconBg: "bg-destructive/10 text-destructive",
    },
    {
      title: "Staff on Duty",
      value: "18",
      change: "3 doctors",
      changeLabel: "15 staff",
      icon: Stethoscope,
      progress: 60,
      color: "from-primary to-secondary",
      iconBg: "bg-accent text-primary",
    },
  ];

  const activities = [
    { title: "New patient registered", desc: "John Doe was added to the system", time: "10 minutes ago", icon: UserPlus, iconColor: "text-secondary" },
    { title: "Appointment rescheduled", desc: "Jane Smith moved to Thursday", time: "1 hour ago", icon: Calendar, iconColor: "text-primary" },
    { title: "Lab results updated", desc: "Blood work results uploaded for Patient #254", time: "3 hours ago", icon: FileText, iconColor: "text-amber-500" },
    { title: "Prescription created", desc: "Dr. Williams created prescription for Patient #118", time: "5 hours ago", icon: ClipboardList, iconColor: "text-primary" },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-secondary p-8 text-primary-foreground shadow-lg">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5 blur-xl" />
        <div className="relative z-10">
          <p className="text-sm font-medium text-primary-foreground/80 mb-1">Good day 👋</p>
          <h1 className="text-3xl font-bold tracking-tight">Welcome to HealthNest</h1>
          <p className="mt-2 max-w-lg text-primary-foreground/80">
            Your comprehensive hospital management dashboard. Monitor patients, manage appointments, and streamline operations — all in one place.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="group relative overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300">
            <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${stat.color} opacity-60 group-hover:opacity-100 transition-opacity`} />
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{stat.change}</span>{" "}
                    {stat.changeLabel}
                  </p>
                </div>
                <div className={`rounded-xl p-3 ${stat.iconBg}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${stat.color} transition-all duration-700`}
                  style={{ width: `${stat.progress}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom Grid */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card className="border-none shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>Common tasks you can perform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2.5">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="group flex items-center justify-between rounded-xl border border-border/60 bg-card px-4 py-3.5 text-left transition-all duration-200 hover:border-primary/30 hover:bg-accent/50 hover:shadow-sm"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="rounded-lg bg-primary/10 p-2.5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                      <action.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{action.title}</div>
                      <div className="text-xs text-muted-foreground">{action.description}</div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200" />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-none shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>Latest system activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((item, i) => (
                <div key={i} className="group flex items-start gap-3.5 rounded-xl p-2.5 transition-colors hover:bg-accent/40">
                  <div className="mt-0.5 rounded-lg bg-accent p-2">
                    <item.icon className={`h-4 w-4 ${item.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{item.desc}</p>
                    <p className="text-[11px] text-muted-foreground/70 mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
