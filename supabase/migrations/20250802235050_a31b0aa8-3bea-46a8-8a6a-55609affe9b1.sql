-- Delete the existing admin user that was created incorrectly
DELETE FROM auth.users WHERE email = 'admin@gmail.com';

-- Clear the profiles and user_roles for this user  
DELETE FROM public.profiles WHERE email = 'admin@gmail.com';
DELETE FROM public.user_roles WHERE user_id = '90b78800-7632-4400-be2b-9d4eb0e2023d';
DELETE FROM public.activity_logs WHERE user_id = '90b78800-7632-4400-be2b-9d4eb0e2023d';

-- We'll create the admin user through the application instead
-- For now, let's ensure the system is ready for manual admin creation