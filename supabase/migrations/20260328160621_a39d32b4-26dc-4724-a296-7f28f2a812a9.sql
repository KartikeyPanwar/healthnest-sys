
CREATE TYPE public.app_role AS ENUM ('admin', 'doctor', 'nurse', 'receptionist');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'receptionist');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  gender text NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  dob date NOT NULL,
  blood_type text,
  address text,
  phone text,
  email text,
  emergency_contact jsonb DEFAULT '{}'::jsonb,
  medical_history jsonb DEFAULT '{}'::jsonb,
  insurance_details jsonb DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  registered_date timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.doctors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  gender text NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  department text,
  specialization text,
  qualification text,
  experience integer DEFAULT 0,
  phone text,
  email text,
  address text,
  availability jsonb DEFAULT '{"days":[],"startTime":"09:00","endTime":"17:00"}'::jsonb,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on-leave')),
  joining_date date DEFAULT CURRENT_DATE,
  user_id uuid REFERENCES auth.users(id)
);
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  doctor_id uuid REFERENCES public.doctors(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  time time NOT NULL,
  duration integer DEFAULT 30,
  service text,
  notes text,
  status text NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no-show')),
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.prescriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  doctor_id uuid REFERENCES public.doctors(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  diagnosis text,
  medications jsonb DEFAULT '[]'::jsonb,
  instructions text,
  follow_up jsonb,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.bills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  doctor_id uuid REFERENCES public.doctors(id),
  date date NOT NULL DEFAULT CURRENT_DATE,
  items jsonb DEFAULT '[]'::jsonb,
  subtotal numeric(10,2) DEFAULT 0,
  discount numeric(10,2) DEFAULT 0,
  tax numeric(10,2) DEFAULT 0,
  total numeric(10,2) DEFAULT 0,
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('paid', 'pending', 'overdue', 'partial')),
  payment_method text CHECK (payment_method IN ('cash', 'card', 'insurance', 'bank transfer')),
  insurance_coverage numeric(10,2),
  patient_responsibility numeric(10,2),
  notes text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());
CREATE POLICY "Admins can read all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated can read patients" ON public.patients FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert patients" ON public.patients FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update patients" ON public.patients FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated can read doctors" ON public.doctors FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert doctors" ON public.doctors FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update doctors" ON public.doctors FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated can read appointments" ON public.appointments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert appointments" ON public.appointments FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update appointments" ON public.appointments FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated can read prescriptions" ON public.prescriptions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert prescriptions" ON public.prescriptions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update prescriptions" ON public.prescriptions FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated can read bills" ON public.bills FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert bills" ON public.bills FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update bills" ON public.bills FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Admins can delete patients" ON public.patients FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete doctors" ON public.doctors FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete appointments" ON public.appointments FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete prescriptions" ON public.prescriptions FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete bills" ON public.bills FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
