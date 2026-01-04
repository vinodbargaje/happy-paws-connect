-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL,
  caregiver_id UUID NOT NULL,
  pet_id UUID NOT NULL,
  service_type TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  total_amount NUMERIC NOT NULL DEFAULT 0,
  notes TEXT,
  owner_notes TEXT,
  caregiver_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add foreign key constraints
ALTER TABLE public.bookings
  ADD CONSTRAINT fk_bookings_owner FOREIGN KEY (owner_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  ADD CONSTRAINT fk_bookings_caregiver FOREIGN KEY (caregiver_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  ADD CONSTRAINT fk_bookings_pet FOREIGN KEY (pet_id) REFERENCES public.pets(id) ON DELETE CASCADE;

-- Create indexes for better query performance
CREATE INDEX idx_bookings_owner_id ON public.bookings(owner_id);
CREATE INDEX idx_bookings_caregiver_id ON public.bookings(caregiver_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_start_date ON public.bookings(start_date);

-- Enable Row Level Security
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Owners can view their own bookings
CREATE POLICY "Owners can view their own bookings"
ON public.bookings
FOR SELECT
USING (auth.uid() = owner_id);

-- Caregivers can view bookings assigned to them
CREATE POLICY "Caregivers can view their assigned bookings"
ON public.bookings
FOR SELECT
USING (auth.uid() = caregiver_id);

-- Owners can create bookings
CREATE POLICY "Owners can create bookings"
ON public.bookings
FOR INSERT
WITH CHECK (auth.uid() = owner_id);

-- Owners can update their own bookings (cancel, add notes)
CREATE POLICY "Owners can update their own bookings"
ON public.bookings
FOR UPDATE
USING (auth.uid() = owner_id);

-- Caregivers can update their assigned bookings (confirm, complete, add notes)
CREATE POLICY "Caregivers can update their assigned bookings"
ON public.bookings
FOR UPDATE
USING (auth.uid() = caregiver_id);

-- Owners can delete their pending bookings
CREATE POLICY "Owners can delete their pending bookings"
ON public.bookings
FOR DELETE
USING (auth.uid() = owner_id AND status = 'pending');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for bookings
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;