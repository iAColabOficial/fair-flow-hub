import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export interface ProjectPayment {
  id: string;
  project_id: string;
  etapa: string;
  valor_original: number;
  valor_final: number;
  is_isento: boolean;
  motivo_isencao?: string;
  payment_method?: string;
  status_pagamento: string;
  data_vencimento?: string;
  data_pagamento?: string;
  solicitado_by: string;
  liberado_by?: string;
  created_at: string;
  updated_at: string;
  asaas_payment_id?: string;
  asaas_invoice_url?: string;
  projects?: {
    titulo: string;
    categoria: string;
  };
}

export const usePayments = () => {
  const [payments, setPayments] = useState<ProjectPayment[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchPayments = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('project_pagamentos')
        .select(`
          *,
          projects(titulo, categoria)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar pagamentos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createPayment = async (paymentData: Partial<ProjectPayment>) => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('project_pagamentos')
        .insert({
          ...(paymentData as any),
          solicitado_by: user.id,
        });

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Pagamento criado com sucesso",
      });
      
      fetchPayments();
      return true;
    } catch (error) {
      console.error('Error creating payment:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar pagamento",
        variant: "destructive",
      });
      return false;
    }
  };

  const updatePayment = async (id: string, updates: Partial<ProjectPayment>) => {
    try {
      const { error } = await supabase
        .from('project_pagamentos')
        .update(updates as any)
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Pagamento atualizado com sucesso",
      });
      
      fetchPayments();
      return true;
    } catch (error) {
      console.error('Error updating payment:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar pagamento",
        variant: "destructive",
      });
      return false;
    }
  };

  const approvePayment = async (id: string) => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('project_pagamentos')
        .update({
          status_pagamento: 'pago' as any,
          liberado_by: user.id,
          data_pagamento: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Pagamento aprovado com sucesso",
      });
      
      fetchPayments();
      return true;
    } catch (error) {
      console.error('Error approving payment:', error);
      toast({
        title: "Erro",
        description: "Erro ao aprovar pagamento",
        variant: "destructive",
      });
      return false;
    }
  };

  const requestExemption = async (id: string, motivo: string) => {
    try {
      const { error } = await supabase
        .from('project_pagamentos')
        .update({
          is_isento: true,
          motivo_isencao: motivo,
          status_pagamento: 'isento',
        })
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Solicitação de isenção enviada com sucesso",
      });
      
      fetchPayments();
      return true;
    } catch (error) {
      console.error('Error requesting exemption:', error);
      toast({
        title: "Erro",
        description: "Erro ao solicitar isenção",
        variant: "destructive",
      });
      return false;
    }
  };

  const generateInvoice = async (id: string) => {
    try {
      // Aqui seria a integração com o ASAAS ou outro gateway de pagamento
      // Por enquanto, vamos simular a geração de fatura
      
      const { error } = await supabase
        .from('project_pagamentos')
        .update({
          status_pagamento: 'pendente' as any,
          asaas_payment_id: `mock_${Date.now()}`,
          asaas_invoice_url: `https://mock-invoice-url.com/${id}`,
        })
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Fatura gerada com sucesso",
      });
      
      fetchPayments();
      return true;
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast({
        title: "Erro",
        description: "Erro ao gerar fatura",
        variant: "destructive",
      });
      return false;
    }
  };

  const getPaymentSummary = () => {
    const summary = {
      total: payments.length,
      pendente: payments.filter(p => p.status_pagamento === 'pendente').length,
      pago: payments.filter(p => p.status_pagamento === 'pago').length,
      isento: payments.filter(p => p.is_isento).length,
      vencido: payments.filter(p => 
        p.data_vencimento && 
        new Date(p.data_vencimento) < new Date() && 
        p.status_pagamento === 'pendente'
      ).length,
      totalValue: payments.reduce((sum, p) => sum + p.valor_final, 0),
      paidValue: payments
        .filter(p => p.status_pagamento === 'pago')
        .reduce((sum, p) => sum + p.valor_final, 0),
    };

    return summary;
  };

  useEffect(() => {
    fetchPayments();
  }, [user]);

  return {
    payments,
    loading,
    fetchPayments,
    createPayment,
    updatePayment,
    approvePayment,
    requestExemption,
    generateInvoice,
    getPaymentSummary,
  };
};