-- Create policies for users table to allow authenticated users to read user data

-- Policy to allow authenticated users to view all user profiles
CREATE POLICY "Authenticated users can view all users" 
ON public.users 
FOR SELECT 
TO authenticated 
USING (true);

-- Policy to allow users to update their own profile
CREATE POLICY "Users can update their own profile" 
ON public.users 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = id);

-- Policy to allow users to view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.users 
FOR SELECT 
TO authenticated 
USING (auth.uid() = id);