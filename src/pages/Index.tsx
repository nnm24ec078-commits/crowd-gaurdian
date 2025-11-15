import { useState } from "react";
import { AlertTriangle, Users, MapPin, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CrowdAreasList from "@/components/CrowdAreasList";
import OfficerManagement from "@/components/OfficerManagement";
import CrowdMap from "@/components/CrowdMap";
import LiveDataSimulator from "@/components/LiveDataSimulator";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <AlertTriangle className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Crowd Safety Control</h1>
                <p className="text-sm text-muted-foreground">Real-time Stampede Prevention System</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 bg-success/10 rounded-lg">
                <div className="h-2 w-2 bg-success rounded-full animate-pulse" />
                <span className="text-sm font-medium text-success">System Active</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="dashboard" className="gap-2">
              <Activity className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="officers" className="gap-2">
              <Users className="h-4 w-4" />
              Officers
            </TabsTrigger>
            <TabsTrigger value="map" className="gap-2">
              <MapPin className="h-4 w-4" />
              Map View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Areas Monitored
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">12</div>
                  <p className="text-xs text-muted-foreground mt-1">Active surveillance zones</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Critical Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-critical">3</div>
                  <p className="text-xs text-muted-foreground mt-1">Require immediate attention</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Officers Deployed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-success">24</div>
                  <p className="text-xs text-muted-foreground mt-1">Currently on duty</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Priority Areas</CardTitle>
                  <CardDescription>Sorted by crowd density and AI analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <CrowdAreasList />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Live Data Simulator</CardTitle>
                  <CardDescription>Simulates camera and thermal sensor feeds</CardDescription>
                </CardHeader>
                <CardContent>
                  <LiveDataSimulator />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="officers">
            <Card>
              <CardHeader>
                <CardTitle>Police Officer Management</CardTitle>
                <CardDescription>Add and track officers for crowd control deployment</CardDescription>
              </CardHeader>
              <CardContent>
                <OfficerManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="map">
            <Card>
              <CardHeader>
                <CardTitle>Geographic Overview</CardTitle>
                <CardDescription>Real-time location tracking and navigation</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <CrowdMap />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
