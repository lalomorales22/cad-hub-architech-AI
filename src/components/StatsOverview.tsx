
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Clock, CheckCircle, DollarSign } from "lucide-react";
import { mockProjects } from "@/lib/database";

export const StatsOverview = () => {
  const totalProjects = mockProjects.length;
  const activeProjects = mockProjects.filter(p => p.status === 'in-progress').length;
  const completedProjects = mockProjects.filter(p => p.status === 'completed').length;
  const totalValue = mockProjects.reduce((sum, p) => sum + (p.budget || 0), 0);

  const stats = [
    {
      title: "Total Projects",
      value: totalProjects,
      icon: TrendingUp,
      color: "text-cyan-400"
    },
    {
      title: "Active Projects",
      value: activeProjects,
      icon: Clock,
      color: "text-blue-400"
    },
    {
      title: "Completed",
      value: completedProjects,
      icon: CheckCircle,
      color: "text-green-400"
    },
    {
      title: "Total Value",
      value: `$${(totalValue / 1000000).toFixed(1)}M`,
      icon: DollarSign,
      color: "text-yellow-400"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="widget-bg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">{stat.title}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

