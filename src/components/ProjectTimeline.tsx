
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

const timelineEvents = [
  {
    id: '1',
    project: 'Ocean Beach Residence',
    event: 'Design Phase Completed',
    time: '2 hours ago',
    type: 'milestone'
  },
  {
    id: '2',
    project: 'Downtown Office Complex',
    event: 'Client Review Scheduled',
    time: '4 hours ago',
    type: 'meeting'
  },
  {
    id: '3',
    project: 'Mountain Retreat House',
    event: 'Structural Analysis Updated',
    time: '1 day ago',
    type: 'update'
  },
  {
    id: '4',
    project: 'Sustainable Community Center',
    event: 'Final Approval Received',
    time: '2 days ago',
    type: 'approval'
  },
  {
    id: '5',
    project: 'Industrial Warehouse Expansion',
    event: 'Initial Concept Created',
    time: '3 days ago',
    type: 'milestone'
  }
];

const eventTypeColors = {
  milestone: "bg-green-500/20 text-green-400",
  meeting: "bg-blue-500/20 text-blue-400",
  update: "bg-yellow-500/20 text-yellow-400",
  approval: "bg-purple-500/20 text-purple-400"
};

export const ProjectTimeline = () => {
  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Project Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timelineEvents.map((event) => (
            <div key={event.id} className="flex items-start space-x-3 pb-4 border-b border-gray-700 last:border-b-0">
              <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-white font-medium text-sm">{event.project}</h4>
                  <span className="text-gray-400 text-xs">{event.time}</span>
                </div>
                <p className="text-gray-300 text-sm mt-1">{event.event}</p>
                <Badge className={`text-xs mt-2 ${eventTypeColors[event.type as keyof typeof eventTypeColors]}`}>
                  {event.type}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
