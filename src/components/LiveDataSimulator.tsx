import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Play, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LiveDataSimulator = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const { toast } = useToast();

  const locations = [
    { name: "Main Entrance Gate", lat: 28.6139, lng: 77.2090 },
    { name: "Central Plaza", lat: 28.6159, lng: 77.2110 },
    { name: "South Corridor", lat: 28.6119, lng: 77.2070 },
    { name: "North Assembly Area", lat: 28.6179, lng: 77.2130 },
    { name: "East Food Court", lat: 28.6149, lng: 77.2150 },
    { name: "West Exhibition Hall", lat: 28.6129, lng: 77.2050 },
  ];

  const generateCrowdData = () => {
    const location = locations[Math.floor(Math.random() * locations.length)];
    const crowdDensity = Math.floor(Math.random() * 100);
    const estimatedCount = Math.floor(50 + Math.random() * 950);
    const thermalReading = (25 + Math.random() * 15).toFixed(2);

    let priority: 'critical' | 'high' | 'medium' | 'low';
    let status: 'emergency' | 'alert' | 'monitoring' | 'normal';

    if (crowdDensity > 80) {
      priority = 'critical';
      status = 'emergency';
    } else if (crowdDensity > 60) {
      priority = 'high';
      status = 'alert';
    } else if (crowdDensity > 40) {
      priority = 'medium';
      status = 'monitoring';
    } else {
      priority = 'low';
      status = 'normal';
    }

    return {
      ...location,
      crowd_density: crowdDensity,
      priority,
      status,
      thermal_reading: parseFloat(thermalReading),
      estimated_count: estimatedCount,
      camera_id: `CAM-${Math.floor(Math.random() * 100)}`,
    };
  };

  const simulateData = async () => {
    try {
      const data = generateCrowdData();
      
      // Check if area exists
      const { data: existingArea } = await supabase
        .from('crowd_areas')
        .select('id')
        .eq('name', data.name)
        .single();

      let error;
      if (existingArea) {
        // Update existing area
        const result = await supabase
          .from('crowd_areas')
          .update({
            crowd_density: data.crowd_density,
            priority: data.priority,
            status: data.status,
            thermal_reading: data.thermal_reading,
            estimated_count: data.estimated_count,
            camera_id: data.camera_id,
          })
          .eq('id', existingArea.id);
        error = result.error;
      } else {
        // Insert new area
        const result = await supabase
          .from('crowd_areas')
          .insert({
            name: data.name,
            location_lat: data.lat,
            location_lng: data.lng,
            crowd_density: data.crowd_density,
            priority: data.priority,
            status: data.status,
            thermal_reading: data.thermal_reading,
            estimated_count: data.estimated_count,
            camera_id: data.camera_id,
          });
        error = result.error;
      }

      if (error) throw error;

      if (data.priority === 'critical' || data.priority === 'high') {
        toast({
          title: "⚠️ Alert",
          description: `High crowd density detected at ${data.name}`,
          variant: data.priority === 'critical' ? 'destructive' : 'default',
        });
      }
    } catch (error) {
      console.error('Error simulating data:', error);
    }
  };

  const startSimulation = () => {
    setIsSimulating(true);
    toast({
      title: "Simulation Started",
      description: "Generating live crowd data every 5 seconds",
    });

    // Generate initial data
    simulateData();

    // Set up interval for continuous updates
    const interval = setInterval(simulateData, 5000);

    // Store interval ID for cleanup
    (window as any).crowdSimulationInterval = interval;
  };

  const stopSimulation = () => {
    setIsSimulating(false);
    if ((window as any).crowdSimulationInterval) {
      clearInterval((window as any).crowdSimulationInterval);
    }
    toast({
      title: "Simulation Stopped",
      description: "Live data feed has been paused",
    });
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-muted rounded-lg">
        <h4 className="font-medium text-foreground mb-2">Data Simulator</h4>
        <p className="text-sm text-muted-foreground mb-4">
          This simulates surveillance camera and thermal sensor data. In a real deployment, 
          this would connect to actual hardware feeds.
        </p>
        
        {!isSimulating ? (
          <Button onClick={startSimulation} className="w-full gap-2">
            <Play className="h-4 w-4" />
            Start Live Simulation
          </Button>
        ) : (
          <Button onClick={stopSimulation} variant="destructive" className="w-full gap-2">
            <Square className="h-4 w-4" />
            Stop Simulation
          </Button>
        )}
      </div>

      <div className="p-4 bg-card border border-border rounded-lg">
        <h4 className="text-sm font-medium text-foreground mb-2">Simulated Sensors</h4>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex justify-between">
            <span>📹 Surveillance Cameras</span>
            <span className="text-success">6 Active</span>
          </div>
          <div className="flex justify-between">
            <span>🌡️ Thermal Sensors</span>
            <span className="text-success">6 Active</span>
          </div>
          <div className="flex justify-between">
            <span>📊 Data Feed Rate</span>
            <span>5s interval</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveDataSimulator;
