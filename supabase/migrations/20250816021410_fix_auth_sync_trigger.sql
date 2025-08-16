-- Fix auth.users to public.users synchronization trigger
-- This migration ensures that new users are automatically synchronized

-- Drop existing trigger if exists (safety measure)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop existing function if exists (safety measure)  
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create improved function to handle new user synchronization
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Insert into public.users table with improved data extraction
  INSERT INTO public.users (id, email, nome, cpf, telefone, data_nascimento, endereco_completo)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'cpf', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    CASE 
      WHEN NEW.raw_user_meta_data->>'data_nascimento' IS NOT NULL 
      THEN (NEW.raw_user_meta_data->>'data_nascimento')::DATE
      ELSE NULL
    END,
    COALESCE(NEW.raw_user_meta_data->>'endereco_completo', '')
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Create trigger to run the function when a user is created in auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Log the fix
INSERT INTO public.system_logs (action, table_name, new_values, created_at)
VALUES (
  'TRIGGER_FIXED', 
  'auth.users', 
  '{"message": "Fixed auth.users to public.users synchronization trigger"}',
  now()
);
