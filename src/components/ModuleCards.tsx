import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  FlaskConical, 
  ClipboardCheck, 
  CreditCard, 
  MessageSquare, 
  BarChart3,
  Calendar,
  Award,
  Settings,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Clock
} from "lucide-react";

const modules = [
  {
    title: "User Management",
    description: "Manage student, teacher, and evaluator registrations with role-based permissions",
    icon: Users,
    status: "active",
    stats: { total: "1,247 users", pending: "12 pending approvals" },
    color: "bg-blue-500",
    href: "/users",
    actions: ["View Users", "Pending Approvals", "Add User"],
  },
  {
    title: "Project System",
    description: "Complete project lifecycle from creation to submission with documentation",
    icon: FlaskConical,
    status: "active",
    stats: { total: "156 projects", pending: "23 pending review" },
    color: "bg-green-500",
    href: "/projects",
    actions: ["View Projects", "Review Queue", "Create Project"],
  },
  {
    title: "Evaluation System",
    description: "Automated evaluation distribution with comprehensive grading interface",
    icon: ClipboardCheck,
    status: "in-progress",
    stats: { total: "89 completed", pending: "67 remaining" },
    color: "bg-orange-500",
    href: "/evaluations",
    actions: ["View Evaluations", "Assign Evaluators", "Results"],
  },
  {
    title: "Financial Management",
    description: "ASAAS integration for automatic billing, payments, and financial reports",
    icon: CreditCard,
    status: "active",
    stats: { total: "R$ 24,580", pending: "14 pending payments" },
    color: "bg-purple-500",
    href: "/financial",
    actions: ["View Transactions", "Generate Reports", "Payment Links"],
  },
  {
    title: "Communication Hub",
    description: "Schedule management, notifications, and complete audit logs",
    icon: MessageSquare,
    status: "active",
    stats: { total: "348 messages", pending: "5 scheduled" },
    color: "bg-pink-500",
    href: "/communication",
    actions: ["Send Message", "View Logs", "Schedule"],
  },
  {
    title: "Events & Calendar",
    description: "Manage fair events, deadlines, and important dates",
    icon: Calendar,
    status: "active",
    stats: { total: "12 events", pending: "3 upcoming" },
    color: "bg-indigo-500",
    href: "/events",
    actions: ["View Calendar", "Create Event", "Manage Deadlines"],
  },
  {
    title: "Analytics & BI",
    description: "Comprehensive business intelligence and performance analytics",
    icon: BarChart3,
    status: "active",
    stats: { total: "15 reports", pending: "Weekly report due" },
    color: "bg-cyan-500",
    href: "/analytics",
    actions: ["View Dashboard", "Generate Report", "Export Data"],
  },
  {
    title: "Certificates & Awards",
    description: "Automated certificate generation and award management system",
    icon: Award,
    status: "pending",
    stats: { total: "45 certificates", pending: "Ready for generation" },
    color: "bg-yellow-500",
    href: "/certificates",
    actions: ["Generate Certificates", "View Templates", "Award Winners"],
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "active":
      return <CheckCircle className="w-4 h-4 text-success" />;
    case "in-progress":
      return <Clock className="w-4 h-4 text-warning" />;
    case "pending":
      return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
    default:
      return <CheckCircle className="w-4 h-4 text-success" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "success";
    case "in-progress":
      return "warning";
    case "pending":
      return "secondary";
    default:
      return "secondary";
  }
};

export const ModuleCards = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">System Modules</h2>
          <p className="text-muted-foreground">Manage all aspects of your science fair</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Settings className="w-4 h-4" />
          System Settings
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module, index) => (
          <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-transparent hover:border-l-primary">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${module.color}/10`}>
                    <module.icon className={`w-5 h-5 text-primary`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusIcon(module.status)}
                      <Badge variant={getStatusColor(module.status) as any} className="text-xs">
                        {module.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              <CardDescription className="text-sm mt-2">
                {module.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-medium">{module.stats.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-medium text-primary">{module.stats.pending}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {module.actions.slice(0, 2).map((action, actionIndex) => (
                  <Badge key={actionIndex} variant="outline" className="text-xs">
                    {action}
                  </Badge>
                ))}
                {module.actions.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{module.actions.length - 2} more
                  </Badge>
                )}
              </div>

              <Button 
                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                variant="outline"
              >
                Open Module
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};