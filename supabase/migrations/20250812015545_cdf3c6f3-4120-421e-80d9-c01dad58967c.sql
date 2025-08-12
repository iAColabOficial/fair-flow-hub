-- Fix foreign key constraint by updating projects table to reference auth.users instead of public.users
-- and create trigger to automatically create user profiles

-- First, drop the existing foreign key constraint
ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS projects_created_by_fkey;

-- Add new foreign key constraint referencing auth.users
ALTER TABLE public.projects ADD CONSTRAINT projects_created_by_fkey 
  FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create function to automatically create user record when someone signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Insert into public.users table
  INSERT INTO public.users (id, email, nome, cpf, telefone, data_nascimento, endereco_completo)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    '', -- CPF will be filled later by user
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    NULL, -- Birth date will be filled later
    '' -- Address will be filled later
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Create trigger to run the function when a user is created in auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();