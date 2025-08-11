-- Fix infinite recursion in RLS policies for project_members and project_orientadores

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view project members of their projects" ON project_members;
DROP POLICY IF EXISTS "Users can view project orientadores of their projects" ON project_orientadores;
DROP POLICY IF EXISTS "Project members can view their own membership" ON project_members;
DROP POLICY IF EXISTS "Project orientadores can view their own orientation" ON project_orientadores;

-- Create simple, non-recursive policies for project_members
CREATE POLICY "Users can view all project members"
ON project_members FOR SELECT
USING (true);

CREATE POLICY "Users can manage project members they created"
ON project_members FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = project_members.project_id 
    AND projects.created_by = auth.uid()
  )
);

-- Create simple, non-recursive policies for project_orientadores  
CREATE POLICY "Users can view all project orientadores"
ON project_orientadores FOR SELECT
USING (true);

CREATE POLICY "Users can manage project orientadores they created"
ON project_orientadores FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = project_orientadores.project_id 
    AND projects.created_by = auth.uid()
  )
);

-- Ensure projects table has proper policies
DROP POLICY IF EXISTS "Users can view all projects" ON projects;
CREATE POLICY "Users can view all projects"
ON projects FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can manage their own projects" ON projects;
CREATE POLICY "Users can manage their own projects"
ON projects FOR ALL
USING (created_by = auth.uid());