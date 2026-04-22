import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Heart } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const BloodCampRegistrationDialog = ({ open, onOpenChange }: Props) => {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    age: "",
    phone: "",
    bloodGroup: "",
    preferredDate: "",
  });

  const update = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.bloodGroup || !form.preferredDate) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Registration successful!", {
        description: `Thanks ${form.name}, we'll see you on ${form.preferredDate}.`,
      });
      setForm({ name: "", age: "", phone: "", bloodGroup: "", preferredDate: "" });
      onOpenChange(false);
    }, 600);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-destructive" />
            Blood Donation Camp Registration
          </DialogTitle>
          <DialogDescription>
            April 12 – May 5, 2026 · Hospital Main Hall
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bc-name">Full name *</Label>
            <Input id="bc-name" value={form.name} onChange={update("name")} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="bc-age">Age</Label>
              <Input id="bc-age" type="number" min={18} max={65} value={form.age} onChange={update("age")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bc-blood">Blood group *</Label>
              <Select value={form.bloodGroup} onValueChange={(v) => setForm((f) => ({ ...f, bloodGroup: v }))}>
                <SelectTrigger id="bc-blood">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {BLOOD_GROUPS.map((g) => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bc-phone">Phone *</Label>
            <Input id="bc-phone" type="tel" value={form.phone} onChange={update("phone")} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bc-date">Preferred date *</Label>
            <Input
              id="bc-date"
              type="date"
              min="2026-04-12"
              max="2026-05-05"
              value={form.preferredDate}
              onChange={update("preferredDate")}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Registering..." : "Register"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BloodCampRegistrationDialog;