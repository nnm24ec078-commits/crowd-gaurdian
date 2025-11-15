-- Create enum for priority levels
CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'critical');

-- Create enum for area status
CREATE TYPE area_status AS ENUM ('normal', 'monitoring', 'alert', 'emergency');

-- Create enum for officer status
CREATE TYPE officer_status AS ENUM ('available', 'assigned', 'on_duty', 'off_duty');

-- Create crowd_areas table for storing real-time crowd density data
CREATE TABLE public.crowd_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location_lat DECIMAL(10, 8) NOT NULL,
  location_lng DECIMAL(11, 8) NOT NULL,
  crowd_density INTEGER NOT NULL CHECK (crowd_density >= 0 AND crowd_density <= 100),
  priority priority_level NOT NULL DEFAULT 'low',
  status area_status NOT NULL DEFAULT 'normal',
  camera_id TEXT,
  thermal_reading DECIMAL(5, 2),
  estimated_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create police_officers table
CREATE TABLE public.police_officers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  officer_name TEXT NOT NULL,
  officer_id TEXT NOT NULL UNIQUE,
  status officer_status NOT NULL DEFAULT 'available',
  current_location_lat DECIMAL(10, 8),
  current_location_lng DECIMAL(11, 8),
  contact_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create assignments table for AI-generated officer assignments
CREATE TABLE public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  area_id UUID NOT NULL REFERENCES public.crowd_areas(id) ON DELETE CASCADE,
  officer_id UUID REFERENCES public.police_officers(id) ON DELETE SET NULL,
  officers_required INTEGER NOT NULL,
  officers_assigned INTEGER DEFAULT 0,
  ai_reasoning TEXT,
  assignment_priority priority_level NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.crowd_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.police_officers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for crowd_areas (public read for monitoring dashboard)
CREATE POLICY "Anyone can view crowd areas"
  ON public.crowd_areas FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert crowd areas"
  ON public.crowd_areas FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update crowd areas"
  ON public.crowd_areas FOR UPDATE
  TO authenticated
  USING (true);

-- RLS Policies for police_officers
CREATE POLICY "Anyone can view police officers"
  ON public.police_officers FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert officers"
  ON public.police_officers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update officers"
  ON public.police_officers FOR UPDATE
  TO authenticated
  USING (true);

-- RLS Policies for assignments
CREATE POLICY "Anyone can view assignments"
  ON public.assignments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert assignments"
  ON public.assignments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update assignments"
  ON public.assignments FOR UPDATE
  TO authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX idx_crowd_areas_priority ON public.crowd_areas(priority DESC, crowd_density DESC);
CREATE INDEX idx_crowd_areas_updated ON public.crowd_areas(updated_at DESC);
CREATE INDEX idx_officers_status ON public.police_officers(status);
CREATE INDEX idx_assignments_area ON public.assignments(area_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_crowd_areas_updated_at
  BEFORE UPDATE ON public.crowd_areas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_police_officers_updated_at
  BEFORE UPDATE ON public.police_officers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_assignments_updated_at
  BEFORE UPDATE ON public.assignments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.crowd_areas;
ALTER PUBLICATION supabase_realtime ADD TABLE public.assignments;