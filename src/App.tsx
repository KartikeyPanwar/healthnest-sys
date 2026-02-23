import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import PatientsPage from "./pages/Patients";
import NewPatient from "./pages/Patients/NewPatient";
import AppointmentsPage from "./pages/Appointments";
import NewAppointment from "./pages/Appointments/NewAppointment";
import DoctorsPage from "./pages/Doctors";
import NewDoctor from "./pages/Doctors/NewDoctor";
import BillingPage from "./pages/Billing";
import NewBill from "./pages/Billing/NewBill";
import MedicalRecordsPage from "./pages/Records";
import NewPrescription from "./pages/Records/NewPrescription";
import StaffPage from "./pages/Staff";
import SettingsPage from "./pages/Settings";
import ProfilePage from "./pages/Profile";
import LoginPage from "./pages/Login";
import NotFound from "./pages/NotFound";
import DoctorDetail from "./pages/Doctors/DoctorDetail";
import MonitoringPage from "./pages/Monitoring";
import HealthRiskPage from "./pages/HealthRisk";
import AlertsPage from "./pages/Alerts";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patients" element={<PatientsPage />} />
            <Route path="/patients/new" element={<NewPatient />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/appointments/new" element={<NewAppointment />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/doctors/new" element={<NewDoctor />} />
            <Route path="/doctors/:id" element={<DoctorDetail />} />
            <Route path="/monitoring" element={<MonitoringPage />} />
            <Route path="/health-risk" element={<HealthRiskPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/records" element={<MedicalRecordsPage />} />
            <Route path="/records/prescription/new" element={<NewPrescription />} />
            <Route path="/billing" element={<BillingPage />} />
            <Route path="/billing/new" element={<NewBill />} />
            <Route path="/staff" element={<StaffPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
