-- Clean up all conflicting RLS policies and create simple, non-recursive ones

-- Drop all existing policies for projects
DROP POLICY IF EXISTS "Users can view related projects" ON projects;
DROP POLICY IF EXISTS "Users can insert projects" ON projects;
DROP POLICY IF EXISTS "Users can update own projects" ON projects;
DROP POLICY IF EXISTS "Users can view all projects" ON projects;
DROP POLICY IF EXISTS "Users can manage their own projects" ON projects;

-- Drop all existing policies for project_members
DROP POLICY IF EXISTS "Users can view project members" ON project_members;
DROP POLICY IF EXISTS "Project creators can add members" ON project_members;
DROP POLICY IF EXISTS "Users can view all project members" ON project_members;
DROP POLICY IF EXISTS "Users can manage project members they created" ON project_members;

-- Drop all existing policies for project_orientadores
DROP POLICY IF EXISTS "Users can view project orientadores" ON project_orientadores;
DROP POLICY IF EXISTS "Project creators can add orientadores" ON project_orientadores;
DROP POLICY IF EXISTS "Users can view all project orientadores" ON project_orientadores;
DROP POLICY IF EXISTS "Users can manage project orientadores they created" ON project_orientadores;

-- Create simple policies for projects table
CREATE POLICY "Allow all users to view projects"
ON projects FOR SELECT
USING (true);

CREATE POLICY "Allow users to create projects"
ON projects FOR INSERT
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Allow users to update own projects"
ON projects FOR UPDATE
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Allow users to delete own projects"
ON projects FOR DELETE
USING (created_by = auth.uid());

-- Create simple policies for project_members table
CREATE POLICY "Allow all users to view project members"
ON project_members FOR SELECT
USING (true);

CREATE POLICY "Allow project creators to manage members"
ON project_members FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = project_members.project_id 
    AND projects.created_by = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = project_members.project_id 
    AND projects.created_by = auth.uid()
  )
);

-- Create simple policies for project_orientadores table
CREATE POLICY "Allow all users to view project orientadores"
ON project_orientadores FOR SELECT
USING (true);

CREATE POLICY "Allow project creators to manage orientadores"
ON project_orientadores FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = project_orientadores.project_id 
    AND projects.created_by = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = project_orientadores.project_id 
    AND projects.created_by = auth.uid()
  )
);