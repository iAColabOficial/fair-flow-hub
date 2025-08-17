import React, { useState } from 'react';
import { Search, X, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUsers, useOrientadores, useAutores, User } from '@/hooks/useUsers';
import { useDebounce } from '@/hooks/useDebounce';

interface UserSearchSelectProps {
  selectedUsers: User[];
  onUsersChange: (users: User[]) => void;
  maxUsers?: number;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  // NOVA PROP: Para especificar se é busca de orientadores
  searchType?: 'users' | 'orientadores' | 'autores';
}

export function UserSearchSelect({
  selectedUsers,
  onUsersChange,
  maxUsers,
  placeholder,
  label,
  disabled = false,
  searchType = 'users' // Default para users (não quebra código existente)
}: UserSearchSelectProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 300);
  
  // MODIFICAÇÃO: Usar hook apropriado baseado no searchType
  const { data: users = [], isLoading } = searchType === 'orientadores' 
    ? useOrientadores(debouncedSearch)
    : searchType === 'autores'
    ? useAutores(debouncedSearch)
    : useUsers(debouncedSearch);

  // MODIFICAÇÃO: Placeholder dinâmico baseado no tipo de busca
  const defaultPlaceholder = searchType === 'orientadores' 
    ? "Buscar orientador por CPF..." 
    : searchType === 'autores'
    ? "Buscar autores por CPF..."
    : "Buscar usuários...";

  const handleUserSelect = (user: User) => {
    if (selectedUsers.find(u => u.id === user.id)) return;
    
    if (maxUsers && selectedUsers.length >= maxUsers) return;
    
    onUsersChange([...selectedUsers, user]);
    setSearchTerm('');
    setIsSearchOpen(false);
  };

  const handleUserRemove = (userId: string) => {
    onUsersChange(selectedUsers.filter(u => u.id !== userId));
  };

  const availableUsers = users.filter((user): user is User => 
    user && typeof user === 'object' && 'id' in user && 'nome' in user && 'email' in user && 'cpf' in user &&
    !selectedUsers.find(selected => selected.id === user.id)
  );

  const canAddMore = !maxUsers || selectedUsers.length < maxUsers;

  // MODIFICAÇÃO: Tamanho mínimo da busca baseado no tipo
  const minSearchLength = (searchType === 'orientadores' || searchType === 'autores') ? 3 : 2;

  return (
    <div className="space-y-3">
      {label && <label className="text-sm font-medium">{label}</label>}
      
      {/* Selected Users */}
      {selectedUsers.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedUsers.map((user) => (
            <Badge key={user.id} variant="secondary" className="pr-1">
              <span className="mr-1">{user.nome}</span>
              <button
                type="button"
                onClick={() => handleUserRemove(user.id)}
                className="text-muted-foreground hover:text-foreground"
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Search Input */}
      {canAddMore && !disabled && (
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder={placeholder || defaultPlaceholder}
              className="pl-10"
            />
          </div>

          {/* Search Results */}
          {isSearchOpen && searchTerm.length >= minSearchLength && (
            <Card className="absolute z-10 w-full mt-1 max-h-60 overflow-y-auto">
              <CardContent className="p-2">
                {isLoading ? (
                  <div className="text-center py-2 text-muted-foreground">
                    Buscando...
                  </div>
                ) : availableUsers.length === 0 ? (
                  <div className="text-center py-2 text-muted-foreground">
                    {searchType === 'orientadores' 
                      ? 'Nenhum orientador encontrado' 
                      : searchType === 'autores'
                      ? 'Nenhum autor encontrado'
                      : 'Nenhum usuário encontrado'}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {availableUsers.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => handleUserSelect(user)}
                        className="w-full text-left p-2 rounded hover:bg-accent transition-colors"
                      >
                        <div className="font-medium">{user.nome}</div>
                          <div className="text-sm text-muted-foreground">
                            {/* MODIFICAÇÃO: Mostrar CPF mascarado ou completo baseado na busca */}
                            {(searchType === 'orientadores' || searchType === 'autores')
                              ? `CPF: ${debouncedSearch && debouncedSearch.replace(/[^0-9]/g, '').length >= 11 
                                  ? user.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
                                  : `***.***.***-${user.cpf.slice(-2)}`}`
                              : user.email}
                          </div>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Max users reached message */}
      {maxUsers && selectedUsers.length >= maxUsers && (
        <div className="text-sm text-muted-foreground">
          Máximo de {maxUsers} usuários atingido
        </div>
      )}

      {/* Click outside to close */}
      {isSearchOpen && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setIsSearchOpen(false)}
        />
      )}
    </div>
  );
}