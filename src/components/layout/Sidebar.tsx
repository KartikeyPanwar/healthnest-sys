
import { 
  CalendarDays, 
  FileText, 
  LayoutDashboard, 
  Receipt, 
  Settings, 
  UserRound, 
  Users, 
  Stethoscope,
  Activity,
  Brain,
  Siren
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
}

const sidebarLinks = [
  { name: "Dashboard", path: "/", icon: <LayoutDashboard className="h-5 w-5" /> },
  { name: "Patients", path: "/patients", icon: <UserRound className="h-5 w-5" /> },
  { name: "Doctors", path: "/doctors", icon: <Stethoscope className="h-5 w-5" /> },
  { name: "Doctor Dashboard", path: "/doctor-dashboard", icon: <Activity className="h-5 w-5" /> },
  { name: "Appointments", path: "/appointments", icon: <CalendarDays className="h-5 w-5" /> },
  { name: "Monitoring", path: "/monitoring", icon: <Activity className="h-5 w-5" /> },
  { name: "Health Risk AI", path: "/health-risk", icon: <Brain className="h-5 w-5" /> },
  { name: "Alerts", path: "/alerts", icon: <Siren className="h-5 w-5" /> },
  { name: "Medical Records", path: "/records", icon: <FileText className="h-5 w-5" /> },
  { name: "Billing", path: "/billing", icon: <Receipt className="h-5 w-5" /> },
  { name: "Staff", path: "/staff", icon: <Users className="h-5 w-5" /> },
  { name: "Settings", path: "/settings", icon: <Settings className="h-5 w-5" /> },
];

const Sidebar = ({ isOpen }: SidebarProps) => {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r bg-sidebar transition-transform duration-300 md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-16 items-center border-b px-6">
        <h2 className="text-lg font-semibold text-sidebar-primary">Navigation</h2>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {sidebarLinks.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )
                }
              >
                {link.icon}
                <span className="ml-3">{link.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="border-t p-4">
        <Button variant="outline" className="w-full">
          <span>Help Center</span>
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
