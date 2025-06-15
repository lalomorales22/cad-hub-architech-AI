
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Award, 
  Briefcase, 
  GraduationCap,
  ExternalLink,
  Download,
  Share2,
  Camera,
  Edit3,
  Star,
  TrendingUp
} from "lucide-react";

export const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);

  const stats = [
    { label: "Projects Completed", value: "47", icon: Briefcase, color: "text-cyan-400" },
    { label: "Total Designs", value: "156", icon: Edit3, color: "text-blue-400" },
    { label: "Client Reviews", value: "4.9", icon: Star, color: "text-yellow-400" },
    { label: "Team Collaborations", value: "23", icon: User, color: "text-green-400" },
  ];

  const achievements = [
    { title: "First Project", description: "Completed your first CAD project", date: "Jan 2024", earned: true },
    { title: "Speed Designer", description: "Created 10 projects in one month", date: "Mar 2024", earned: true },
    { title: "AI Explorer", description: "Used Text-to-CAD 100 times", date: "Apr 2024", earned: true },
    { title: "Collaborator", description: "Worked on 5 team projects", date: "May 2024", earned: false },
    { title: "Master Architect", description: "Completed 50 projects", date: "Upcoming", earned: false },
  ];

  const recentProjects = [
    { name: "Ocean Beach Residence", type: "Residential", status: "Completed", image: "🏠" },
    { name: "Downtown Office Complex", type: "Commercial", status: "In Progress", image: "🏢" },
    { name: "Modern Villa Design", type: "Residential", status: "Review", image: "🏡" },
  ];

  return (
    <div className="h-full p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-start space-x-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-gradient-to-br from-cyan-400 to-blue-600 text-white text-xl font-bold">
                    CH
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-gray-700 hover:bg-gray-600"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-2xl font-bold text-white">Corey Hilton</h1>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-white border-gray-600 hover:bg-gray-700"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    {isEditing ? "Save" : "Edit Profile"}
                  </Button>
                </div>
                
                <p className="text-gray-400 mb-2">Senior Architect</p>
                <p className="text-gray-300 mb-4">
                  Passionate architect with 10+ years of experience in sustainable design and modern architecture. 
                  Specializing in residential and commercial projects with a focus on innovative solutions.
                </p>
                
                <div className="flex items-center space-x-6 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    San Francisco, CA
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Joined January 2024
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    corey.hilton@cadhub.com
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                      <span className="text-2xl font-bold text-white">{stat.value}</span>
                    </div>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Activity Chart */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Activity Overview
                </CardTitle>
                <CardDescription>Your activity over the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Projects This Month</span>
                      <span className="text-white">8/10</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">AI Generations Used</span>
                      <span className="text-white">156/200</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Storage Used</span>
                      <span className="text-white">2.4GB/5GB</span>
                    </div>
                    <Progress value={48} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Projects */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Projects</CardTitle>
                <CardDescription>Your latest architectural works</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentProjects.map((project, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-900 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">{project.image}</div>
                        <div>
                          <h4 className="text-white font-medium">{project.name}</h4>
                          <p className="text-gray-400 text-sm">{project.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge 
                          variant={project.status === 'Completed' ? 'default' : 'secondary'}
                          className={project.status === 'Completed' ? 'bg-green-600' : 'bg-yellow-600'}
                        >
                          {project.status}
                        </Badge>
                        <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">All Projects</CardTitle>
                <CardDescription>Complete overview of your architectural portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-400">Project portfolio view coming soon...</p>
                  <Button className="mt-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500">
                    View All Projects
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Achievements & Milestones
                </CardTitle>
                <CardDescription>Track your progress and unlock new achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        achievement.earned ? 'bg-gray-900 border border-cyan-600/20' : 'bg-gray-900/50'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          achievement.earned 
                            ? 'bg-gradient-to-br from-cyan-600 to-blue-600' 
                            : 'bg-gray-700'
                        }`}>
                          <Award className={`h-6 w-6 ${
                            achievement.earned ? 'text-white' : 'text-gray-400'
                          }`} />
                        </div>
                        <div>
                          <h4 className={`font-medium ${
                            achievement.earned ? 'text-white' : 'text-gray-400'
                          }`}>
                            {achievement.title}
                          </h4>
                          <p className="text-gray-400 text-sm">{achievement.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm ${
                          achievement.earned ? 'text-cyan-400' : 'text-gray-500'
                        }`}>
                          {achievement.date}
                        </p>
                        {achievement.earned && (
                          <Badge className="bg-cyan-600 text-white mt-1">Earned</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            {isEditing ? (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Edit Profile</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                      <Input id="firstName" defaultValue="Corey" className="bg-gray-900 border-gray-600 text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                      <Input id="lastName" defaultValue="Hilton" className="bg-gray-900 border-gray-600 text-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-gray-300">Professional Title</Label>
                    <Input id="title" defaultValue="Senior Architect" className="bg-gray-900 border-gray-600 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-gray-300">Bio</Label>
                    <Textarea 
                      id="bio" 
                      defaultValue="Passionate architect with 10+ years of experience in sustainable design and modern architecture."
                      className="bg-gray-900 border-gray-600 text-white" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-gray-300">Location</Label>
                    <Input id="location" defaultValue="San Francisco, CA" className="bg-gray-900 border-gray-600 text-white" />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Profile Actions</CardTitle>
                  <CardDescription>Manage your profile and data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start text-white border-gray-600 hover:bg-gray-700">
                    <Download className="mr-2 h-4 w-4" />
                    Export Profile Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-white border-gray-600 hover:bg-gray-700">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Profile
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-red-400 border-red-600 hover:bg-red-900/20">
                    <User className="mr-2 h-4 w-4" />
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
