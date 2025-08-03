import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePayments } from '@/hooks/usePayments';
import { Search, DollarSign, AlertTriangle, CheckCircle, FileText, Calendar, CreditCard } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const PaymentManagement = () => {
  const { payments, loading, approvePayment, requestExemption, generateInvoice, getPaymentSummary } = usePayments();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [etapaFilter, setEtapaFilter] = useState('all');

  const summary = getPaymentSummary();

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.projects?.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payment.status_pagamento === statusFilter;
    const matchesEtapa = etapaFilter === 'all' || payment.etapa === etapaFilter;
    
    return matchesSearch && matchesStatus && matchesEtapa;
  });

  const getStatusBadge = (status: string, isExempt: boolean) => {
    if (isExempt) {
      return <Badge variant="secondary">Isento</Badge>;
    }
    
    switch (status) {
      case 'pendente':
        return <Badge variant="outline" className="text-orange-600 border-orange-600">Pendente</Badge>;
      case 'pago':
        return <Badge variant="default" className="bg-green-600">Pago</Badge>;
      case 'vencido':
        return <Badge variant="destructive">Vencido</Badge>;
      case 'fatura_gerada':
        return <Badge variant="outline">Fatura Gerada</Badge>;
      case 'aprovado':
        return <Badge variant="default">Aprovado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-8 w-16" />
              </CardHeader>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Gerenciamento Financeiro</h1>
        <p className="text-muted-foreground">
          Controle de pagamentos e taxas da FEBIC
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Pagamentos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.total}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(summary.totalValue)} no total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagamentos Pendentes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{summary.pendente}</div>
            <p className="text-xs text-muted-foreground">
              {summary.vencido} vencidos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagamentos Realizados</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{summary.pago}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(summary.paidValue)} recebidos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Isenções</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.isento}</div>
            <p className="text-xs text-muted-foreground">
              Pagamentos isentos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Filtre os pagamentos por projeto, status ou etapa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar pagamentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="pago">Pago</SelectItem>
                <SelectItem value="vencido">Vencido</SelectItem>
                <SelectItem value="aprovado">Aprovado</SelectItem>
                <SelectItem value="fatura_gerada">Fatura Gerada</SelectItem>
              </SelectContent>
            </Select>

            <Select value={etapaFilter} onValueChange={setEtapaFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por etapa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as etapas</SelectItem>
                <SelectItem value="virtual">Virtual</SelectItem>
                <SelectItem value="presencial">Presencial</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">
            Todos ({filteredPayments.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pendentes ({filteredPayments.filter(p => p.status_pagamento === 'pendente').length})
          </TabsTrigger>
          <TabsTrigger value="paid">
            Pagos ({filteredPayments.filter(p => p.status_pagamento === 'pago').length})
          </TabsTrigger>
          <TabsTrigger value="exempt">
            Isentos ({filteredPayments.filter(p => p.is_isento).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredPayments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Nenhum pagamento encontrado</h3>
                <p className="text-muted-foreground text-center">
                  Não há pagamentos que correspondam aos filtros aplicados.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredPayments.map((payment) => (
              <Card key={payment.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {payment.projects?.titulo || 'Projeto sem título'}
                      </CardTitle>
                      <CardDescription>
                        Categoria {payment.projects?.categoria} • Etapa {payment.etapa}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(payment.status_pagamento, payment.is_isento)}
                      <Badge variant="outline">
                        {formatCurrency(payment.valor_final)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-sm font-medium">Valor Original</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(payment.valor_original)}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium">Valor Final</p>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(payment.valor_final)}
                        </p>
                      </div>
                      
                      {payment.data_vencimento && (
                        <div>
                          <p className="text-sm font-medium">Data de Vencimento</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(payment.data_vencimento), 'dd/MM/yyyy', { locale: ptBR })}
                          </p>
                        </div>
                      )}
                      
                      {payment.data_pagamento && (
                        <div>
                          <p className="text-sm font-medium">Data de Pagamento</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(payment.data_pagamento), 'dd/MM/yyyy', { locale: ptBR })}
                          </p>
                        </div>
                      )}
                    </div>

                    {payment.motivo_isencao && (
                      <div>
                        <p className="text-sm font-medium">Motivo da Isenção</p>
                        <p className="text-sm text-muted-foreground">
                          {payment.motivo_isencao}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Criado em {format(new Date(payment.created_at), 'dd/MM/yyyy', { locale: ptBR })}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {payment.status_pagamento === 'pendente' && !payment.is_isento && (
                        <>
                          <Button 
                            size="sm" 
                            onClick={() => generateInvoice(payment.id)}
                          >
                            <CreditCard className="h-4 w-4 mr-2" />
                            Gerar Fatura
                          </Button>
                          
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => requestExemption(payment.id, 'Solicitação de isenção')}
                          >
                            Solicitar Isenção
                          </Button>
                        </>
                      )}
                      
                      {payment.status_pagamento === 'fatura_gerada' && (
                        <Button 
                          size="sm"
                          onClick={() => approvePayment(payment.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Confirmar Pagamento
                        </Button>
                      )}
                      
                      {payment.asaas_invoice_url && (
                        <Button asChild size="sm" variant="outline">
                          <a href={payment.asaas_invoice_url} target="_blank" rel="noopener noreferrer">
                            <FileText className="h-4 w-4 mr-2" />
                            Ver Fatura
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Similar content for other tabs */}
        <TabsContent value="pending" className="space-y-4">
          {/* Filter and show only pending payments */}
          {filteredPayments
            .filter(p => p.status_pagamento === 'pendente')
            .map((payment) => (
              <Card key={payment.id}>
                {/* Same card content as above */}
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">
                    Conteúdo similar ao tab "Todos", filtrado para pagamentos pendentes
                  </p>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="paid" className="space-y-4">
          {/* Filter and show only paid payments */}
          {filteredPayments
            .filter(p => p.status_pagamento === 'pago')
            .map((payment) => (
              <Card key={payment.id}>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">
                    Conteúdo similar ao tab "Todos", filtrado para pagamentos realizados
                  </p>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="exempt" className="space-y-4">
          {/* Filter and show only exempt payments */}
          {filteredPayments
            .filter(p => p.is_isento)
            .map((payment) => (
              <Card key={payment.id}>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">
                    Conteúdo similar ao tab "Todos", filtrado para pagamentos isentos
                  </p>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentManagement;