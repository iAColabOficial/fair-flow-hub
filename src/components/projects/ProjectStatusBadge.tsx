import { Badge } from '@/components/ui/badge';

interface ProjectStatusBadgeProps {
  status: string;
}

const statusConfig = {
  rascunho: { label: 'Rascunho', variant: 'secondary' as const },
  submetido: { label: 'Submetido', variant: 'default' as const },
  selecionado: { label: 'Selecionado', variant: 'secondary' as const },
  confirmado_virtual: { label: 'Confirmado Virtual', variant: 'default' as const },
  finalista: { label: 'Finalista', variant: 'secondary' as const },
  confirmado_presencial: { label: 'Confirmado Presencial', variant: 'default' as const },
  avaliado: { label: 'Avaliado', variant: 'secondary' as const },
  premiado: { label: 'Premiado', variant: 'default' as const },
  desclassificado: { label: 'Desclassificado', variant: 'destructive' as const },
};

export const ProjectStatusBadge = ({ status }: ProjectStatusBadgeProps) => {
  const config = statusConfig[status as keyof typeof statusConfig] || {
    label: status,
    variant: 'secondary' as const,
  };

  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
};