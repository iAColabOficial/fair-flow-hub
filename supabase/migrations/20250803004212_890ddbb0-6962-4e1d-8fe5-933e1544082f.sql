-- Create the admin user in auth.users with password
-- Note: This approach uses the admin API to create a user with password
SELECT extensions.http_post(
  'https://jdfgpurijchvhymbwffk.supabase.co/auth/v1/admin/users',
  '{"email": "profe.leandrorodrigues@gmail.com", "password": "admin123", "email_confirm": true}',
  'application/json',
  ARRAY[
    extensions.http_header('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpkZmdwdXJpamNodmh5bWJ3ZmZrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODQ3NjkyNCwiZXhwIjoyMDY0MDUyOTI0fQ.GrF7gBm5QVPF-TlAmKD0dUu1G3dqPMDbH0b7xq1iEDE'),
    extensions.http_header('Content-Type', 'application/json')
  ]
);

-- Alternative: Update the existing user record to match what we want
UPDATE users 
SET email = 'profe.leandrorodrigues@gmail.com',
    cpf = '03876258952',
    nome = 'Leandro Rodrigues',
    telefone = '(47) 99999-9999',
    endereco_completo = 'Jaraguá do Sul, SC',
    email_verified = true,
    is_active = true
WHERE email = 'profe.leandrorodrigues@gmail.com';