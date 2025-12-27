-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('owner', 'caregiver', 'admin');

-- Create enum for subscription plans
CREATE TYPE public.subscription_tier AS ENUM ('free', 'basic', 'premium');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  city TEXT,
  pincode TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Create subscription_plans table
CREATE TABLE public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  tier subscription_tier NOT NULL DEFAULT 'free',
  razorpay_subscription_id TEXT,
  razorpay_payment_id TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create caregiver_profiles table (additional info for caregivers)
CREATE TABLE public.caregiver_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  years_experience INTEGER DEFAULT 0,
  service_radius INTEGER DEFAULT 5,
  languages TEXT[] DEFAULT '{}',
  services_offered TEXT[] DEFAULT '{}',
  hourly_rate DECIMAL(10,2),
  daily_rate DECIMAL(10,2),
  bio TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_background_checked BOOLEAN DEFAULT false,
  rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  portfolio_images TEXT[] DEFAULT '{}',
  availability JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pets table
CREATE TABLE public.pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  pet_type TEXT NOT NULL,
  breed TEXT,
  age INTEGER,
  weight DECIMAL(5,2),
  sex TEXT,
  medical_conditions TEXT,
  vaccination_status TEXT,
  behavior_notes TEXT,
  feeding_schedule TEXT,
  temperament TEXT,
  special_needs TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.caregiver_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Profiles policies
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Public profiles are viewable by authenticated users" 
  ON public.profiles FOR SELECT 
  TO authenticated
  USING (true);

-- User roles policies
CREATE POLICY "Users can view their own roles" 
  ON public.user_roles FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own role during signup" 
  ON public.user_roles FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Subscription plans policies
CREATE POLICY "Users can view their own subscription" 
  ON public.subscription_plans FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription" 
  ON public.subscription_plans FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription" 
  ON public.subscription_plans FOR UPDATE 
  USING (auth.uid() = user_id);

-- Caregiver profiles policies
CREATE POLICY "Anyone can view caregiver profiles" 
  ON public.caregiver_profiles FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Caregivers can update their own profile" 
  ON public.caregiver_profiles FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Caregivers can insert their own profile" 
  ON public.caregiver_profiles FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Pets policies
CREATE POLICY "Owners can view their own pets" 
  ON public.pets FOR SELECT 
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can insert their own pets" 
  ON public.pets FOR INSERT 
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their own pets" 
  ON public.pets FOR UPDATE 
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their own pets" 
  ON public.pets FOR DELETE 
  USING (auth.uid() = owner_id);

CREATE POLICY "Authenticated users can view all pets for bookings" 
  ON public.pets FOR SELECT 
  TO authenticated
  USING (true);

-- Trigger for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscription_plans_updated_at
  BEFORE UPDATE ON public.subscription_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_caregiver_profiles_updated_at
  BEFORE UPDATE ON public.caregiver_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pets_updated_at
  BEFORE UPDATE ON public.pets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'phone', '')
  );
  
  -- Insert role based on user metadata
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    (NEW.raw_user_meta_data ->> 'role')::app_role
  );
  
  -- Create free subscription by default
  INSERT INTO public.subscription_plans (user_id, tier)
  VALUES (NEW.id, 'free');
  
  -- If caregiver, create caregiver profile
  IF (NEW.raw_user_meta_data ->> 'role') = 'caregiver' THEN
    INSERT INTO public.caregiver_profiles (user_id)
    VALUES (NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();