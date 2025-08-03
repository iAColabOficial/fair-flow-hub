import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Search, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RoleType, User, UserRole, UserProfile } from '@/types/database';

interface UserWithDetails extends User {
  user_profiles?: UserProfile[];
  user_roles: UserRole[];
}

const AssignRolesPage = () => {
  const [users, setUsers] = useState<UserWithDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<RoleType>('autor');
  const [loading, setLoading] = useState(false);

  const roleOptions: { value: RoleType; label: string }[] = [
    { value: 'autor', label: 'Autor' },
    { value: 'orientador', label: 'Orientador' },
    { value: 'coorientador', label: 'Coorientador' },
    { value: 'avaliador', label: 'Avaliador' },
    { value: 'voluntario', label: 'Voluntário' },
    { value: 'feira_afiliada', label: 'Feira Afiliada' },
    { value: 'coordenador', label: 'Coordenador' },
    { value: 'coordenador_admin', label: 'Coordenador Admin' },
    { value: 'diretor', label: 'Diretor' },
    { value: 'financeiro', label: 'Financeiro' },
    { value: 'admin_staff', label: 'Admin Staff' },
  ];

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          user_profiles(*),
          user_roles!user_roles_user_id_fkey(*)
        `)
        .order('nome');

      if (error) throw error;

      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.cpf.includes(searchTerm)
  );

  const handleAssignRole = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role_type: selectedRole,
          status: 'ativo'
        });

      if (error) {
        if (error.code === '23505') {
          toast.error('Usuário já possui esta permissão');
        } else {
          throw error;
        }
      } else {
        toast.success('Permissão atribuída com sucesso!');
        fetchUsers();
      }
    } catch (error) {
      console.error('Error assigning role:', error);
      toast.error('Erro ao atribuir permissão');
    }
  };

  const handleRevokeRole = async (userRoleId: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ status: 'inativo' })
        .eq('id', userRoleId);

      if (error) throw error;

      toast.success('Permissão revogada com sucesso!');
      fetchUsers();
    } catch (error) {
      console.error('Error revoking role:', error);
      toast.error('Erro ao revogar permissão');
    }
  };

  const getRoleLabel = (roleType: RoleType) => {
    return roleOptions.find(opt => opt.value === roleType)?.label || roleType;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Atribuir Permissões</h1>
          <p className="text-muted-foreground">Gerencie as permissões dos usuários do sistema</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Atribuir Nova Permissão
          </CardTitle>
          <CardDescription>
            Selecione uma permissão para atribuir aos usuários
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Buscar Usuário</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nome, email ou CPF..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <Label htmlFor="role">Permissão</Label>
              <Select value={selectedRole} onValueChange={(value: RoleType) => setSelectedRole(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usuários Cadastrados</CardTitle>
          <CardDescription>
            {filteredUsers.length} usuário(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="text-muted-foreground">Carregando usuários...</div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-muted-foreground">Nenhum usuário encontrado</div>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium">{user.nome}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                    <div className="text-sm text-muted-foreground">{user.cpf}</div>
                    {user.user_profiles && user.user_profiles.length > 0 && (
                      <div className="text-sm text-muted-foreground">
                        {user.user_profiles[0].instituicao}
                      </div>
                    )}
                    <div className="flex gap-1 flex-wrap">
                      {user.user_roles
                        .filter(role => role.status === 'ativo')
                        .map((role) => (
                        <Badge key={role.id} variant="secondary" className="text-xs">
                          {getRoleLabel(role.role_type)}
                          <button
                            onClick={() => handleRevokeRole(role.id)}
                            className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button
                    onClick={() => handleAssignRole(user.id)}
                    size="sm"
                    disabled={user.user_roles.some(
                      role => role.role_type === selectedRole && role.status === 'ativo'
                    )}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Atribuir {getRoleLabel(selectedRole)}
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssignRolesPage;