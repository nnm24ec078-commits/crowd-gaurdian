import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Users, Thermometer, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CrowdArea {
  id: string;
  name: string;
  crowd_density: number;
  priority: string;
  status: string;
  thermal_reading: number;
  estimated_count: number;
  location_lat: number;
  location_lng: number;
  updated_at: string;
}

const CrowdAreasList = () => {
  const [areas, setAreas] = useState<CrowdArea[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAreas();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('crowd-areas-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'crowd_areas'
        },
        () => {
          fetchAreas();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAreas = async () => {
    try {
      const { data, error } = await supabase
        .from('crowd_areas')
        .select('*')
        .order('priority', { ascending: false })
        .order('crowd_density', { ascending: false });

      if (error) throw error;
      setAreas(data || []);
    } catch (error) {
      console.error('Error fetching areas:', error);
      toast({
        title: "Error",
        description: "Failed to load crowd areas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const requestOfficers = async (area: CrowdArea) => {
    try {
      const { data, error } = await supabase.functions.invoke('assign-officers', {
        body: {
          areaId: area.id,
          crowdDensity: area.crowd_density,
          estimatedCount: area.estimated_count,
          areaName: area.name,
        }
      });

      if (error) throw error;

      toast({
        title: "Officers Assigned",
        description: `${data.recommendation.officers_required} officers assigned to ${area.name}`,
      });
    } catch (error) {
      console.error('Error requesting officers:', error);
      toast({
        title: "Error",
        description: "Failed to assign officers",
        variant: "destructive",
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-critical text-critical-foreground';
      case 'high': return 'bg-high text-high-foreground';
      case 'medium': return 'bg-medium text-medium-foreground';
      case 'low': return 'bg-low text-low-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading areas...</div>;
  }

  if (areas.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No crowd areas detected. Use the simulator to generate data.
      </div>
    );
  }

  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="space-y-4">
        {areas.map((area) => (
          <div
            key={area.id}
            className="p-4 border border-border rounded-lg bg-card hover:bg-accent/5 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {area.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Last updated: {new Date(area.updated_at).toLocaleTimeString()}
                </p>
              </div>
              <Badge className={getPriorityColor(area.priority)}>
                {area.priority}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Density</p>
                  <p className="text-sm font-semibold text-foreground">{area.crowd_density}%</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Count</p>
                  <p className="text-sm font-semibold text-foreground">{area.estimated_count}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Thermal</p>
                  <p className="text-sm font-semibold text-foreground">{area.thermal_reading}°C</p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => requestOfficers(area)}
              size="sm"
              className="w-full"
              variant={area.priority === 'critical' ? 'destructive' : 'default'}
            >
              Request AI Officer Assignment
            </Button>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default CrowdAreasList;
