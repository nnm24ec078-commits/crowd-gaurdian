import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Phone, User, MapPin } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Officer {
  id: string;
  officer_name: string;
  officer_id: string;
  status: string;
  current_location_lat: number;
  current_location_lng: number;
  contact_number: string;
}

const OfficerManagement = () => {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [name, setName] = useState("");
  const [officerId, setOfficerId] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchOfficers();
  }, []);

  const fetchOfficers = async () => {
    try {
      const { data, error } = await supabase
        .from('police_officers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOfficers(data || []);
    } catch (error) {
      console.error('Error fetching officers:', error);
    }
  };

  const addOfficer = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get random location for demo (in real app, would use GPS)
      const randomLat = 28.6139 + (Math.random() - 0.5) * 0.1; // Delhi coordinates
      const randomLng = 77.2090 + (Math.random() - 0.5) * 0.1;

      const { error } = await supabase
        .from('police_officers')
        .insert({
          officer_name: name,
          officer_id: officerId,
          contact_number: contact,
          status: 'available',
          current_location_lat: randomLat,
          current_location_lng: randomLng,
        });

      if (error) throw error;

      toast({
        title: "Officer Added",
        description: `${name} has been added to the system`,
      });

      setName("");
      setOfficerId("");
      setContact("");
      fetchOfficers();
    } catch (error: any) {
      console.error('Error adding officer:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add officer",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-success text-success-foreground';
      case 'assigned': return 'bg-high text-high-foreground';
      case 'on_duty': return 'bg-primary text-primary-foreground';
      case 'off_duty': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Officer Form */}
      <form onSubmit={addOfficer} className="space-y-4 p-4 border border-border rounded-lg bg-card">
        <h3 className="font-semibold text-foreground">Add New Officer</h3>
        
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="name">Officer Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="officerId">Officer ID</Label>
            <Input
              id="officerId"
              value={officerId}
              onChange={(e) => setOfficerId(e.target.value)}
              placeholder="PO-001"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact">Contact Number</Label>
            <Input
              id="contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="+91 98765 43210"
              required
            />
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Adding..." : "Add Officer"}
        </Button>
      </form>

      {/* Officers List */}
      <div>
        <h3 className="font-semibold text-foreground mb-4">Registered Officers ({officers.length})</h3>
        <ScrollArea className="h-[400px]">
          <div className="space-y-3 pr-4">
            {officers.map((officer) => (
              <div
                key={officer.id}
                className="p-4 border border-border rounded-lg bg-card hover:bg-accent/5 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-semibold text-foreground">{officer.officer_name}</p>
                      <p className="text-xs text-muted-foreground">ID: {officer.officer_id}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(officer.status)}>
                    {officer.status.replace('_', ' ')}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {officer.contact_number}
                  </div>
                  {officer.current_location_lat && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      GPS Active
                    </div>
                  )}
                </div>
              </div>
            ))}

            {officers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No officers registered yet. Add your first officer above.
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default OfficerManagement;
