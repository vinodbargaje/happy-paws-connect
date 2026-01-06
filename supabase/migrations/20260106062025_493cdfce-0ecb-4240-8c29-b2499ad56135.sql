-- Create caregiver_services table for individual service pricing
CREATE TABLE public.caregiver_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  caregiver_id UUID NOT NULL REFERENCES public.caregiver_profiles(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  hourly_rate NUMERIC,
  daily_rate NUMERIC,
  session_rate NUMERIC,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(caregiver_id, service_name)
);

-- Enable RLS
ALTER TABLE public.caregiver_services ENABLE ROW LEVEL SECURITY;

-- Anyone can view caregiver services (for search/booking)
CREATE POLICY "Anyone can view caregiver services"
ON public.caregiver_services
FOR SELECT
USING (true);

-- Caregivers can manage their own services
CREATE POLICY "Caregivers can insert their own services"
ON public.caregiver_services
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.caregiver_profiles
    WHERE id = caregiver_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Caregivers can update their own services"
ON public.caregiver_services
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.caregiver_profiles
    WHERE id = caregiver_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Caregivers can delete their own services"
ON public.caregiver_services
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.caregiver_profiles
    WHERE id = caregiver_id AND user_id = auth.uid()
  )
);

-- Trigger for updated_at
CREATE TRIGGER update_caregiver_services_updated_at
BEFORE UPDATE ON public.caregiver_services
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();