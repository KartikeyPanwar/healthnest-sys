import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, Loader2 } from "lucide-react";
import { useDoctors } from "@/hooks/useSupabaseData";

const DoctorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: dbDoctors, isLoading } = useDoctors();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const raw = (dbDoctors ?? []).find((d: any) => d.id === id);

  if (!raw) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px]">
        <h2 className="text-xl font-semibold mb-2">Doctor not found</h2>
        <Button variant="outline" onClick={() => navigate(-1)}>Go back</Button>
      </div>
    );
  }

  const doctor = {
    ...raw,
    department: raw.department ?? "",
    specialization: raw.specialization ?? "",
    qualification: raw.qualification ?? "",
    experience: raw.experience ?? 0,
    phone: raw.phone ?? "",
    email: raw.email ?? "",
    address: raw.address ?? "",
    availability: (raw.availability as any) ?? { days: [], startTime: "09:00", endTime: "17:00" },
    joiningDate: raw.joining_date ?? "",
  };

  return (
    <div className="max-w-2xl mx-auto my-8">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeftIcon className="mr-2 h-4 w-4" />
        Back to Doctors
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>{doctor.name}</CardTitle>
          <CardDescription>{doctor.specialization}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <div className="text-sm text-muted-foreground">Status</div>
              <Badge variant="outline" className="capitalize">
                {doctor.status}
              </Badge>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Department</div>
              <div className="font-medium">{doctor.department}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Gender</div>
              <div className="font-medium capitalize">{doctor.gender}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Email</div>
              <div className="font-medium">{doctor.email}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Phone</div>
              <div className="font-medium">{doctor.phone}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Experience</div>
              <div className="font-medium">{doctor.experience} years</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Qualification</div>
              <div className="font-medium">{doctor.qualification}</div>
            </div>
            <div className="col-span-2">
              <div className="text-sm text-muted-foreground">Address</div>
              <div className="font-medium">{doctor.address}</div>
            </div>
            <div className="col-span-2">
              <div className="text-sm text-muted-foreground">Availability</div>
              <div className="font-medium">
                {doctor.availability.days?.join(", ") || "Not set"} (
                {doctor.availability.startTime} - {doctor.availability.endTime})
              </div>
            </div>
            <div className="col-span-2">
              <div className="text-sm text-muted-foreground">Joining Date</div>
              <div className="font-medium">{doctor.joiningDate}</div>
            </div>
          </div>
        </CardContent>
        <CardFooter />
      </Card>
    </div>
  );
};
export default DoctorDetail;
