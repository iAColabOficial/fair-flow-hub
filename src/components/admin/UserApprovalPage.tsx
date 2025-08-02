import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Search, Check, X, Clock, User, Mail, Building } from "lucide-react";
import { FebicRole } from "@/hooks/useUserRole";

interface PendingUser {
  id: string;
  user_id: string;
  role: FebicRole;
  status: string;
  created_at: string;
  notes?: string;
  profiles: {
    full_name: string;
    email: string;
    phone?: string;
    cpf?: string;
    instituicao?: string;
  };
}

export const UserApprovalPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [notes, setNotes] = useState("");
  const queryClient = useQueryClient();

  // Buscar usuários pendentes
  const { data: pendingUsers = [], isLoading } = useQuery({
    queryKey: ['pending-users'],
    queryFn: async (): Promise<PendingUser[]> => {
      // Buscar user_roles pendentes
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('status', 'pendente')
        .order('created_at', { ascending: false });

      if (rolesError) throw rolesError;

      if (!userRoles || userRoles.length === 0) return [];

      // Buscar profiles dos usuários
      const userIds = userRoles.map(role => role.user_id);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone, cpf, instituicao')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Combinar dados
      return userRoles.map(role => {
        const profile = profiles?.find(p => p.id === role.user_id);
        return {
          id: role.id,
          user_id: role.user_id,
          role: role.role as FebicRole,
          status: role.status,
          created_at: role.created_at,
          notes: role.notes,
          profiles: {
            full_name: profile?.full_name || 'Nome não encontrado',
            email: profile?.email || 'Email não encontrado',
            phone: profile?.phone,
            cpf: profile?.cpf,
            instituicao: profile?.instituicao,
          }
        };
      });
    }
  });

  // Mutation para aprovar/rejeitar usuário
  const handleUserAction = useMutation({
    mutationFn: async ({ userId, action, notes }: { userId: string; action: 'approve' | 'reject'; notes?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const newStatus = action === 'approve' ? 'ativo' : 'inativo';
      
      const { error: updateError } = await supabase
        .from('user_roles')
        .update({
          status: newStatus,
          approved_at: new Date().toISOString(),
          approved_by: user.id,
          notes: notes || null
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Enviar notificação para o usuário
      const { data: targetUserRole } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('id', userId)
        .single();

      if (targetUserRole) {
        await supabase
          .from('user_notifications')
          .insert({
            user_id: targetUserRole.user_id,
            title: action === 'approve' ? 'Conta Aprovada!' : 'Solicitação Rejeitada',
            message: action === 'approve' 
              ? 'Sua conta foi aprovada e você já pode acessar todas as funcionalidades do sistema.'
              : `Sua solicitação foi rejeitada. ${notes ? `Motivo: ${notes}` : 'Entre em contato conosco para mais informações.'}`,
            type: action === 'approve' ? 'success' : 'error'
          });
      }

      // Log da ação
      await supabase
        .from('activity_logs')
        .insert({
          user_id: user.id,
          action: `user_${action}`,
          details: {
            target_user_id: userId,
            action: action,
            notes: notes
          }
        });

      return { action, userId };
    },
    onSuccess: (result) => {
      toast.success(
        result.action === 'approve' 
          ? 'Usuário aprovado com sucesso!' 
          : 'Usuário rejeitado com sucesso!'
      );
      queryClient.invalidateQueries({ queryKey: ['pending-users'] });
      setSelectedUser(null);
      setActionType(null);
      setNotes("");
    },
    onError: (error) => {
      toast.error('Erro ao processar ação: ' + error.message);
    }
  });

  const filteredUsers = pendingUsers.filter(user =>
    user.profiles.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.profiles.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleLabel = (role: FebicRole) => {
    const roleLabels: Record<FebicRole, string> = {
      autor: 'Autor/Estudante',
      orientador: 'Orientador',
      coorientador: 'Coorientador',
      avaliador: 'Avaliador',
      admin_staff: 'Administrador',
      coordenador_admin: 'Coordenador Admin',
      coordenador: 'Coordenador',
      diretor: 'Diretor',
      financeiro: 'Financeiro',
      feira_afiliada: 'Feira Afiliada',
      voluntario: 'Voluntário'
    };
    return roleLabels[role] || role;
  };

  const getRoleColor = (role: FebicRole) => {
    const colors: Record<string, string> = {
      autor: 'bg-blue-100 text-blue-800',
      orientador: 'bg-green-100 text-green-800',
      avaliador: 'bg-purple-100 text-purple-800',
      admin_staff: 'bg-red-100 text-red-800',
      coordenador: 'bg-yellow-100 text-yellow-800',
      financeiro: 'bg-pink-100 text-pink-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const handleAction = (user: PendingUser, action: 'approve' | 'reject') => {
    setSelectedUser(user);
    setActionType(action);
  };

  const confirmAction = () => {
    if (selectedUser && actionType) {
      handleUserAction.mutate({
        userId: selectedUser.id,
        action: actionType,
        notes
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Aprovação de Usuários</h2>
          <p className="text-muted-foreground">
            Gerencie solicitações de acesso pendentes
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {pendingUsers.length} pendente(s)
        </Badge>
      </div>

      {/* Busca */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, email ou role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de usuários */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários Pendentes</CardTitle>
          <CardDescription>
            Usuários aguardando aprovação para acessar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm ? "Nenhum usuário encontrado" : "Nenhum usuário pendente"}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Role Solicitado</TableHead>
                  <TableHead>Instituição</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{user.profiles.full_name}</div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {user.profiles.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(user.role)}>
                        {getRoleLabel(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Building className="w-3 h-3 mr-1 text-muted-foreground" />
                        {user.profiles.instituicao || 'Não informado'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(user.created_at).toLocaleDateString('pt-BR')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleAction(user, 'approve')}
                          disabled={handleUserAction.isPending}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Aprovar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAction(user, 'reject')}
                          disabled={handleUserAction.isPending}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Rejeitar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog de confirmação */}
      <Dialog open={!!selectedUser && !!actionType} onOpenChange={() => {
        setSelectedUser(null);
        setActionType(null);
        setNotes("");
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Aprovar' : 'Rejeitar'} Usuário
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve' 
                ? `Deseja aprovar o acesso de ${selectedUser?.profiles.full_name} como ${selectedUser ? getRoleLabel(selectedUser.role) : ''}?`
                : `Deseja rejeitar a solicitação de ${selectedUser?.profiles.full_name}?`
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="notes">Observações {actionType === 'reject' ? '(obrigatório)' : '(opcional)'}</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={
                  actionType === 'approve' 
                    ? "Adicione observações sobre a aprovação..."
                    : "Explique o motivo da rejeição..."
                }
                required={actionType === 'reject'}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setSelectedUser(null);
              setActionType(null);
              setNotes("");
            }}>
              Cancelar
            </Button>
            <Button 
              onClick={confirmAction}
              disabled={handleUserAction.isPending || (actionType === 'reject' && !notes.trim())}
              variant={actionType === 'approve' ? 'default' : 'destructive'}
            >
              {handleUserAction.isPending ? 'Processando...' : 
               actionType === 'approve' ? 'Aprovar' : 'Rejeitar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};