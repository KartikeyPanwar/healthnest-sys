
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Plus, Search, UserPlus, Users, Eye, Mail, Phone, Building } from "lucide-react";
import { toast } from "sonner";

interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  status: string;
  email: string;
  phone: string;
}

const StaffPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: "", role: "nurse", department: "", email: "", phone: "" });

  const [mockStaff, setMockStaff] = useState<StaffMember[]>([
    { id: "STF001", name: "Dr. Jane Smith", role: "doctor", department: "Cardiology", status: "active", email: "jane.smith@hospital.com", phone: "+91 9876543210" },
    { id: "STF002", name: "Michael Johnson", role: "nurse", department: "Emergency", status: "active", email: "m.johnson@hospital.com", phone: "+91 9876543211" },
    { id: "STF003", name: "Robert Wilson", role: "admin", department: "Administration", status: "active", email: "r.wilson@hospital.com", phone: "+91 9876543212" },
    { id: "STF004", name: "Sarah Brown", role: "doctor", department: "Pediatrics", status: "inactive", email: "s.brown@hospital.com", phone: "+91 9876543213" },
    { id: "STF005", name: "Emily Davis", role: "nurse", department: "Surgery", status: "active", email: "e.davis@hospital.com", phone: "+91 9876543214" },
  ]);

  const filteredStaff = mockStaff.filter(
    (staff) =>
      (staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (roleFilter === "all" || staff.role === roleFilter)
  );

  const handleAddNewStaff = () => {
    setAddDialogOpen(true);
  };

  const handleSubmitNewStaff = () => {
    if (!newStaff.name || !newStaff.department) {
      toast.error("Please fill in all required fields");
      return;
    }
    const newId = `STF${String(mockStaff.length + 1).padStart(3, "0")}`;
    const staffMember: StaffMember = {
      id: newId,
      name: newStaff.name,
      role: newStaff.role,
      department: newStaff.department,
      status: "active",
      email: newStaff.email || `${newStaff.name.toLowerCase().replace(/\s+/g, ".")}@hospital.com`,
      phone: newStaff.phone || "+91 0000000000",
    };
    setMockStaff(prev => [...prev, staffMember]);
    setAddDialogOpen(false);
    setNewStaff({ name: "", role: "nurse", department: "", email: "", phone: "" });
    toast.success(`${staffMember.name} added to staff successfully`);
  };

  const handleViewStaff = (staff: StaffMember) => {
    setSelectedStaff(staff);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <h1 className="text-2xl font-semibold">Staff Management</h1>
        <Button onClick={handleAddNewStaff}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add New Staff
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hospital Staff</CardTitle>
          <CardDescription>View and manage hospital staff members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search staff..." className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="doctor">Doctors</SelectItem>
                <SelectItem value="nurse">Nurses</SelectItem>
                <SelectItem value="admin">Administrative</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredStaff.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="mb-2 h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-medium">No staff found</h3>
              <p className="mt-1 text-sm text-muted-foreground">No staff members match your search criteria.</p>
              <Button variant="outline" className="mt-4" onClick={() => { setSearchTerm(""); setRoleFilter("all"); }}>Reset Filters</Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-sm font-medium text-muted-foreground">
                    <th className="pb-3 text-left font-medium">ID</th>
                    <th className="pb-3 text-left font-medium">Name</th>
                    <th className="pb-3 text-left font-medium">Role</th>
                    <th className="pb-3 text-left font-medium">Department</th>
                    <th className="pb-3 text-center font-medium">Status</th>
                    <th className="pb-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredStaff.map((staff) => (
                    <tr key={staff.id} className="text-sm">
                      <td className="py-3 font-medium">{staff.id}</td>
                      <td className="py-3">{staff.name}</td>
                      <td className="py-3 capitalize">{staff.role}</td>
                      <td className="py-3">{staff.department}</td>
                      <td className="py-3 text-center">
                        <Badge variant="outline" className={`capitalize ${staff.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                          {staff.status}
                        </Badge>
                      </td>
                      <td className="py-3 text-right">
                        <Button variant="ghost" size="sm" onClick={() => handleViewStaff(staff)}>
                          <Eye className="mr-1 h-3.5 w-3.5" /> View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
        {filteredStaff.length > 0 && (
          <CardFooter className="flex justify-between border-t px-6 py-4">
            <div className="text-sm text-muted-foreground">Showing {filteredStaff.length} of {mockStaff.length} staff members</div>
          </CardFooter>
        )}
      </Card>

      {/* View Staff Dialog */}
      <Dialog open={!!selectedStaff} onOpenChange={() => setSelectedStaff(null)}>
        <DialogContent>
          {selectedStaff && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedStaff.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div><p className="text-xs text-muted-foreground">ID</p><p className="font-medium">{selectedStaff.id}</p></div>
                  <div><p className="text-xs text-muted-foreground">Role</p><p className="font-medium capitalize">{selectedStaff.role}</p></div>
                  <div><p className="text-xs text-muted-foreground">Department</p><p className="font-medium">{selectedStaff.department}</p></div>
                  <div><p className="text-xs text-muted-foreground">Status</p><Badge variant="outline" className={`capitalize ${selectedStaff.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>{selectedStaff.status}</Badge></div>
                </div>
                <div className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-muted-foreground" />{selectedStaff.email}</div>
                <div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-muted-foreground" />{selectedStaff.phone}</div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Staff Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Staff Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="staff-name">Full Name *</Label>
              <Input id="staff-name" value={newStaff.name} onChange={(e) => setNewStaff(s => ({ ...s, name: e.target.value }))} placeholder="Enter full name" />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={newStaff.role} onValueChange={(v) => setNewStaff(s => ({ ...s, role: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="nurse">Nurse</SelectItem>
                  <SelectItem value="admin">Administrative</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="staff-dept">Department *</Label>
              <Input id="staff-dept" value={newStaff.department} onChange={(e) => setNewStaff(s => ({ ...s, department: e.target.value }))} placeholder="Enter department" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="staff-email">Email</Label>
              <Input id="staff-email" type="email" value={newStaff.email} onChange={(e) => setNewStaff(s => ({ ...s, email: e.target.value }))} placeholder="Enter email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="staff-phone">Phone</Label>
              <Input id="staff-phone" value={newStaff.phone} onChange={(e) => setNewStaff(s => ({ ...s, phone: e.target.value }))} placeholder="Enter phone number" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmitNewStaff}>Add Staff</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffPage;
