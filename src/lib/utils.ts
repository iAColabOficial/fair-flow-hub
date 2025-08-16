import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Função para formatar CPF
export function formatCPF(cpf: string | null | undefined): string {
  if (!cpf) return '';
  
  // Remove todos os caracteres não numéricos
  const numbers = cpf.replace(/\D/g, '');
  
  // Se não tiver 11 dígitos, retorna como está
  if (numbers.length !== 11) return cpf;
  
  // Aplica a máscara: XXX.XXX.XXX-XX
  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Função para formatar telefone
export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return '';
  
  const numbers = phone.replace(/\D/g, '');
  
  if (numbers.length === 11) {
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (numbers.length === 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return phone;
}
