import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  FlaskConical, 
  ClipboardCheck, 
  CreditCard, 
  MessageSquare, 
  Settings,
  BarChart3,
  Award,
  Calendar,
  FileText,
  Home,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

const navigation = [
  {
    name: "Dashboard",
    icon: Home,
    href: "/",
    current: true,
  },
  {
    name: "User Management",
    icon: Users,
    href: "/users",
    current: false,
    badge: "12",
  },
  {
    name: "Projects",
    icon: FlaskConical,
    href: "/projects",
    current: false,
    badge: "45",
  },
  {
    name: "Evaluations",
    icon: ClipboardCheck,
    href: "/evaluations",
    current: false,
    badge: "8",
  },
  {
    name: "Financial",
    icon: CreditCard,
    href: "/financial",
    current: false,
  },
  {
    name: "Communication",
    icon: MessageSquare,
    href: "/communication",
    current: false,
  },
  {
    name: "Events",
    icon: Calendar,
    href: "/events",
    current: false,
  },
  {
    name: "Reports",
    icon: BarChart3,
    href: "/reports",
    current: false,
  },
  {
    name: "Certificates",
    icon: Award,
    href: "/certificates",
    current: false,
  },
];

const quickActions = [
  {
    name: "New Project",
    icon: FlaskConical,
    href: "/projects/new",
  },
  {
    name: "Add User",
    icon: Users,
    href: "/users/new",
  },
  {
    name: "Create Event",
    icon: Calendar,
    href: "/events/new",
  },
];

export const Sidebar = ({ className }: SidebarProps) => {
  return (
    <div className={cn("pb-12 w-64 bg-card border-r", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-foreground">
              Main Navigation
            </h2>
            <div className="space-y-1">
              {navigation.map((item) => (
                <Button
                  key={item.name}
                  variant={item.current ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 px-4 py-2 h-10",
                    item.current && "bg-primary/10 text-primary border-l-2 border-primary"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="flex-1 text-left">{item.name}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {item.badge}
                    </Badge>
                  )}
                  {!item.current && <ChevronRight className="w-3 h-3 opacity-50" />}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-3 py-2">
          <div className="space-y-1">
            <h2 className="mb-2 px-4 text-sm font-semibold tracking-tight text-muted-foreground">
              Quick Actions
            </h2>
            <div className="space-y-1">
              {quickActions.map((action) => (
                <Button
                  key={action.name}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2 px-4"
                >
                  <action.icon className="w-3 h-3" />
                  {action.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-3 py-2">
          <div className="rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 p-4 border">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Fair Status</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              2024 Science Fair is currently in the evaluation phase
            </p>
            <Button size="sm" variant="gradient" className="w-full">
              View Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};