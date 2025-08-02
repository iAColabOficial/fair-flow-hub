import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { FebicRole } from "@/hooks/useUserRole";

interface User {
  id: string;
  email: string;
  full_name: string;
  instituicao: string;
  current_role?: FebicRole;
  current_status?: string;
}

const allRoles: { value: FebicRole; label: string; description: string }[] = [
  { 
    value: 'autor', 
    label: 'Autor/Estudante', 
    description: 'Submete projetos científicos para a feira'
  },
  { 
    value: 'orientador', 
    label: 'Orientador/Professor', 
    description: 'Orienta projetos de estudantes'
  },
  { 
    value: 'coorientador', 
    label: 'Coorientador', 
    description: 'Auxilia na orientação de projetos'
  },
  { 
    value: 'avaliador', 
    label: 'Avaliador', 
    description: 'Avalia projetos submetidos'
  },
  { 
    value: 'admin_staff', 
    label: 'Administrador', 
    description: 'Gerencia o sistema'
  },
  { 
    value: 'coordenador', 
    label: 'Coordenador', 
    description: 'Coordena atividades da feira'
  },
  { 
    value: 'coordenador_admin', 
    label: 'Coordenador Admin', 
    description: 'Coordenador com privilégios administrativos'
  },
  { 
    value: 'diretor', 
    label: 'Diretor', 
    description: 'Direção da feira'
  },
  { 
    value: 'financeiro', 
    label: 'Financeiro', 
    description: 'Gerencia aspectos financeiros'
  },
  { 
    value: 'feira_afiliada', 
    label: 'Feira Afiliada', 
    description: 'Representa feira afiliada'
  },
  { 
    value: 'voluntario', 
    label: 'Voluntário', 
    description: 'Participa como voluntário'
  },
];

const getRoleLabel = (role: FebicRole) => {
  return allRoles.find(r => r.value === role)?.label || role;
};

const getRoleColor = (role: FebicRole) => {
  const colors: Record<FebicRole, string> = {
    autor: 'bg-blue-100 text-blue-800',
    orientador: 'bg-green-100 text-green-800',
    coorientador: 'bg-cyan-100 text-cyan-800',
    avaliador: 'bg-purple-100 text-purple-800',
    admin_staff: 'bg-red-100 text-red-800',
    coordenador: 'bg-orange-100 text-orange-800',
    coordenador_admin: 'bg-red-200 text-red-900',
    diretor: 'bg-gray-100 text-gray-800',
    financeiro: 'bg-yellow-100 text-yellow-800',
    feira_afiliada: 'bg-pink-100 text-pink-800',
    voluntario: 'bg-indigo-100 text-indigo-800',
  };
  return colors[role] || 'bg-gray-100 text-gray-800';
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    ativo: 'bg-green-100 text-green-800',
    pendente: 'bg-yellow-100 text-yellow-800',
    inativo: 'bg-gray-100 text-gray-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const AssignRolesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<FebicRole | "">("");
  const [notes, setNotes] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Buscar usuários
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users-search', searchTerm],
    queryFn: async (): Promise<User[]> => {
      let query = supabase
        .from('profiles')
        .select(`
          id,
          email,
          full_name,
          instituicao,
          user_roles!inner(role, status)
        `);

      if (searchTerm) {
        query = query.or(`email.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query.limit(50);

      if (error) throw error;

      return data.map(user => ({
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        instituicao: user.instituicao,
        current_role: (user.user_roles as any)[0]?.role as FebicRole,
        current_status: (user.user_roles as any)[0]?.status,
      }));
    },
    enabled: true,
  });

  // Atribuir novo cargo
  const assignRoleMutation = useMutation({
    mutationFn: async ({ userId, role, notes }: { userId: string; role: FebicRole; notes: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role,
          status: 'ativo',
          approved_at: new Date().toISOString(),
          approved_by: user.id,
          notes,
        });

      if (error) throw error;

      // Enviar notificação
      await supabase
        .from('user_notifications')
        .insert({
          user_id: userId,
          title: 'Novo cargo atribuído',
          message: `Você recebeu o cargo de ${getRoleLabel(role)}.${notes ? ` Observações: ${notes}` : ''}`,
          type: 'success',
        });
    },
    onSuccess: () => {
      toast.success('Cargo atribuído com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['users-search'] });
      setDialogOpen(false);
      setSelectedUser(null);
      setSelectedRole("");
      setNotes("");
    },
    onError: (error) => {
      console.error('Erro ao atribuir cargo:', error);
      toast.error('Erro ao atribuir cargo');
    },
  });

  const handleAssignRole = () => {
    if (!selectedUser || !selectedRole) return;
    
    assignRoleMutation.mutate({
      userId: selectedUser.id,
      role: selectedRole,
      notes,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Atribuir Cargos</CardTitle>
          <CardDescription>
            Pesquise usuários e atribua novos cargos a eles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {isLoading ? (
              <div className="text-center py-4">Carregando usuários...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Instituição</TableHead>
                    <TableHead>Cargo Atual</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.full_name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.instituicao}</TableCell>
                      <TableCell>
                        {user.current_role && (
                          <Badge className={getRoleColor(user.current_role)}>
                            {getRoleLabel(user.current_role)}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.current_status && (
                          <Badge className={getStatusColor(user.current_status)}>
                            {user.current_status}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Dialog open={dialogOpen && selectedUser?.id === user.id} onOpenChange={(open) => {
                          setDialogOpen(open);
                          if (open) {
                            setSelectedUser(user);
                          } else {
                            setSelectedUser(null);
                            setSelectedRole("");
                            setNotes("");
                          }
                        }}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedUser(user)}
                            >
                              <UserPlus className="h-4 w-4 mr-2" />
                              Atribuir Cargo
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Atribuir Novo Cargo</DialogTitle>
                              <DialogDescription>
                                Atribuir novo cargo para {user.full_name}
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="role">Cargo</Label>
                                <Select value={selectedRole} onValueChange={(value: FebicRole) => setSelectedRole(value)}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione um cargo" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {allRoles.map((role) => (
                                      <SelectItem key={role.value} value={role.value}>
                                        <div className="flex flex-col">
                                          <span className="font-medium">{role.label}</span>
                                          <span className="text-xs text-muted-foreground">{role.description}</span>
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="notes">Observações (opcional)</Label>
                                <Textarea
                                  id="notes"
                                  placeholder="Adicione observações sobre esta atribuição..."
                                  value={notes}
                                  onChange={(e) => setNotes(e.target.value)}
                                />
                              </div>
                            </div>

                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setDialogOpen(false)}
                              >
                                Cancelar
                              </Button>
                              <Button
                                onClick={handleAssignRole}
                                disabled={!selectedRole || assignRoleMutation.isPending}
                              >
                                {assignRoleMutation.isPending ? "Atribuindo..." : "Atribuir Cargo"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                  {users.length === 0 && !isLoading && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        Nenhum usuário encontrado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};