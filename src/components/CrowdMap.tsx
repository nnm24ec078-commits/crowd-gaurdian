import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Navigation } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CrowdArea {
  id: string;
  name: string;
  location_lat: number;
  location_lng: number;
  crowd_density: number;
  priority: string;
}

const CrowdMap = () => {
  const [areas, setAreas] = useState<CrowdArea[]>([]);

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    const { data } = await supabase
      .from('crowd_areas')
      .select('*')
      .order('priority', { ascending: false });
    
    setAreas(data || []);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-critical';
      case 'high': return 'bg-high';
      case 'medium': return 'bg-medium';
      case 'low': return 'bg-low';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="relative w-full h-[600px] bg-muted rounded-lg overflow-hidden">
      {/* Map placeholder with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted via-background to-muted" />
      
      {/* Grid overlay for map effect */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />

      {/* Map Info */}
      <div className="absolute top-4 left-4 bg-card/95 backdrop-blur-sm p-4 rounded-lg border border-border shadow-lg max-w-xs">
        <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
          <Navigation className="h-4 w-4" />
          GPS Navigation Ready
        </h3>
        <p className="text-sm text-muted-foreground">
          Map integration would display real-time locations with navigation support.
          Install Mapbox library for full map functionality.
        </p>
      </div>

      {/* Simulated location markers */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full max-w-4xl max-h-[500px]">
          {areas.slice(0, 8).map((area, index) => {
            // Distribute markers across the view
            const x = 20 + (index % 4) * 22;
            const y = 20 + Math.floor(index / 4) * 35;
            
            return (
              <div
                key={area.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <div className={`relative p-2 rounded-full ${getPriorityColor(area.priority)} shadow-lg animate-pulse`}>
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                
                {/* Tooltip on hover */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <div className="bg-card border border-border rounded-lg p-3 shadow-xl min-w-[200px]">
                    <p className="font-semibold text-foreground">{area.name}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">Density:</span>
                      <Badge className={getPriorityColor(area.priority)}>
                        {area.crowd_density}%
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-card/95 backdrop-blur-sm p-4 rounded-lg border border-border shadow-lg">
        <h4 className="text-sm font-semibold text-foreground mb-2">Priority Legend</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-critical" />
            <span className="text-xs text-muted-foreground">Critical</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-high" />
            <span className="text-xs text-muted-foreground">High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-medium" />
            <span className="text-xs text-muted-foreground">Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-low" />
            <span className="text-xs text-muted-foreground">Low</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrowdMap;
