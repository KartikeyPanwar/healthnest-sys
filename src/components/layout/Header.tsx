import { Bell, HelpCircle, LogOut, Menu, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface HeaderProps {
  toggleSidebar: () => void;
}

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const { signOut, user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New Patient Registration",
      description: "Sarah Johnson has registered as a new patient",
      time: "5 minutes ago",
      read: false,
    },
    {
      id: "2",
      title: "Appointment Reminder",
      description: "Dr. Smith has 3 appointments scheduled for today",
      time: "1 hour ago",
      read: false,
    },
    {
      id: "3",
      title: "Lab Results Available",
      description: "Lab results for patient #12345 are now available",
      time: "3 hours ago",
      read: false,
    },
  ]);
  
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const navigate = useNavigate();
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    setNotifications(updatedNotifications);
    toast({
      title: "Notifications marked as read",
      description: "All notifications have been marked as read."
    });
  };
  
  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
  };
  
  const handleProfileClick = () => {
    navigate("/profile");
  };
  
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background px-4 shadow-sm">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2 md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-primary">HealthNest</h1>
          <span className="ml-2 rounded-full bg-medical-green px-2 py-1 text-xs font-medium text-white">
            HMS
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Help Center Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setHelpDialogOpen(true)}
          className="relative"
        >
          <HelpCircle className="h-5 w-5" />
        </Button>
        
        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-white">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs"
                  onClick={markAllAsRead}
                >
                  Mark all as read
                </Button>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No notifications
              </div>
            ) : (
              notifications.map(notification => (
                <DropdownMenuItem 
                  key={notification.id}
                  className="cursor-pointer flex flex-col items-start py-3"
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-center w-full">
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${notification.read ? '' : 'font-semibold'}`}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.time}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                    )}
                  </div>
                  <p className="text-xs mt-1 text-muted-foreground">
                    {notification.description}
                  </p>
                </DropdownMenuItem>
              ))
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-sm text-center cursor-pointer"
              onClick={() => navigate("/notifications")}
            >
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleProfileClick}>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/settings")}>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={async () => { await signOut(); navigate("/login"); }}>
              <LogOut className="mr-2 h-4 w-4" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Help Center Dialog */}
      <Dialog open={helpDialogOpen} onOpenChange={setHelpDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Help Center</DialogTitle>
            <DialogDescription>
              Need assistance with HealthNest? Here's how you can get help.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h3 className="font-medium">Quick Links</h3>
              <div className="grid gap-2">
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={() => {
                    toast({
                      title: "Documentation opened",
                      description: "Opening user documentation"
                    });
                    setHelpDialogOpen(false);
                  }}
                >
                  User Documentation
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={() => {
                    toast({
                      title: "Video tutorials",
                      description: "Opening video tutorials"
                    });
                    setHelpDialogOpen(false);
                  }}
                >
                  Video Tutorials
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={() => {
                    toast({
                      title: "FAQ accessed",
                      description: "Opening frequently asked questions"
                    });
                    setHelpDialogOpen(false);
                  }}
                >
                  Frequently Asked Questions
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Contact Support</h3>
              <Button 
                className="w-full"
                onClick={() => {
                  toast({
                    title: "Support ticket created",
                    description: "A support representative will contact you shortly"
                  });
                  setHelpDialogOpen(false);
                }}
              >
                Create Support Ticket
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
