// src/components/ui/estado-cidade-select.tsx
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EstadoCidadeSelectProps {
  selectedEstado?: string;
  selectedCidade?: string;
  onEstadoChange: (estado: string) => void;
  onCidadeChange: (cidade: string) => void;
}

interface Estado {
  id: number;
  sigla: string;
  nome: string;
}

interface Cidade {
  id: number;
  nome: string;
}

const ESTADOS_BRASILEIROS = [
  { id: 12, sigla: 'AC', nome: 'Acre' },
  { id: 27, sigla: 'AL', nome: 'Alagoas' },
  { id: 16, sigla: 'AP', nome: 'Amapá' },
  { id: 13, sigla: 'AM', nome: 'Amazonas' },
  { id: 29, sigla: 'BA', nome: 'Bahia' },
  { id: 23, sigla: 'CE', nome: 'Ceará' },
  { id: 53, sigla: 'DF', nome: 'Distrito Federal' },
  { id: 32, sigla: 'ES', nome: 'Espírito Santo' },
  { id: 52, sigla: 'GO', nome: 'Goiás' },
  { id: 21, sigla: 'MA', nome: 'Maranhão' },
  { id: 51, sigla: 'MT', nome: 'Mato Grosso' },
  { id: 50, sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { id: 31, sigla: 'MG', nome: 'Minas Gerais' },
  { id: 15, sigla: 'PA', nome: 'Pará' },
  { id: 25, sigla: 'PB', nome: 'Paraíba' },
  { id: 41, sigla: 'PR', nome: 'Paraná' },
  { id: 26, sigla: 'PE', nome: 'Pernambuco' },
  { id: 22, sigla: 'PI', nome: 'Piauí' },
  { id: 33, sigla: 'RJ', nome: 'Rio de Janeiro' },
  { id: 24, sigla: 'RN', nome: 'Rio Grande do Norte' },
  { id: 43, sigla: 'RS', nome: 'Rio Grande do Sul' },
  { id: 11, sigla: 'RO', nome: 'Rondônia' },
  { id: 14, sigla: 'RR', nome: 'Roraima' },
  { id: 42, sigla: 'SC', nome: 'Santa Catarina' },
  { id: 35, sigla: 'SP', nome: 'São Paulo' },
  { id: 28, sigla: 'SE', nome: 'Sergipe' },
  { id: 17, sigla: 'TO', nome: 'Tocantins' }
];

export function EstadoCidadeSelect({ 
  selectedEstado, 
  selectedCidade, 
  onEstadoChange, 
  onCidadeChange 
}: EstadoCidadeSelectProps) {
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [loadingCidades, setLoadingCidades] = useState(false);

  // Buscar cidades da API do IBGE quando estado for selecionado
  useEffect(() => {
    if (!selectedEstado) {
      setCidades([]);
      return;
    }

    const fetchCidades = async () => {
      setLoadingCidades(true);
      try {
        const estadoInfo = ESTADOS_BRASILEIROS.find(e => e.sigla === selectedEstado);
        if (!estadoInfo) return;

        const response = await fetch(
          `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoInfo.id}/municipios`
        );
        
        if (!response.ok) throw new Error('Erro ao buscar cidades');
        
        const cidadesData: Cidade[] = await response.json();
        setCidades(cidadesData.sort((a, b) => a.nome.localeCompare(b.nome)));
      } catch (error) {
        console.error('Erro ao buscar cidades:', error);
        setCidades([]);
      } finally {
        setLoadingCidades(false);
      }
    };

    fetchCidades();
  }, [selectedEstado]);

  const handleEstadoChange = (estado: string) => {
    onEstadoChange(estado);
    onCidadeChange(''); // Reset cidade quando estado muda
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Estado */}
      <div>
        <Select value={selectedEstado} onValueChange={handleEstadoChange}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o estado" />
          </SelectTrigger>
          <SelectContent>
            {ESTADOS_BRASILEIROS.map((estado) => (
              <SelectItem key={estado.sigla} value={estado.sigla}>
                {estado.sigla} - {estado.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Cidade */}
      <div>
        <Select 
          value={selectedCidade} 
          onValueChange={onCidadeChange}
          disabled={!selectedEstado || loadingCidades}
        >
          <SelectTrigger>
            <SelectValue placeholder={
              loadingCidades ? "Carregando cidades..." :
              selectedEstado ? "Selecione a cidade" : 
              "Primeiro selecione o estado"
            } />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {cidades.map((cidade) => (
              <SelectItem key={cidade.id} value={cidade.nome}>
                {cidade.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}