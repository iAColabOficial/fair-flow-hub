import { EvaluationCriteria, ProjectCategory, ProjectStage } from '@/types/project';

export const SUBMISSION_CRITERIA: EvaluationCriteria[] = [
  {
    category: ProjectCategory.CATEGORY_I,
    stage: ProjectStage.SUBMISSION,
    criteria: [
      {
        name: 'Método Científico',
        weight: 30,
        description: 'Evidência da aplicação do método científico ou de engenharia, observando-se a relação entre os objetivos propostos e a metodologia empregada na pesquisa, sua fundamentação teórica e justificativa'
      },
      {
        name: 'Clareza das Ideias',
        weight: 30,
        description: 'Clareza na dissertação das ideias no plano de pesquisa'
      },
      {
        name: 'Originalidade',
        weight: 15,
        description: 'Originalidade da pesquisa e relevância do tema'
      },
      {
        name: 'Referências',
        weight: 5,
        description: 'Adequação e coerência das referências que fundamentam a proposta da pesquisa'
      },
      {
        name: 'Objetivo Pedagógico',
        weight: 20,
        description: 'O relato de pesquisa atingiu o objetivo pedagógico estabelecido'
      }
    ]
  },
  {
    category: ProjectCategory.CATEGORY_II,
    stage: ProjectStage.SUBMISSION,
    criteria: [
      {
        name: 'Método Científico',
        weight: 30,
        description: 'Evidência da aplicação do método científico ou de engenharia, observando-se a relação entre os objetivos propostos e a metodologia empregada na pesquisa, sua fundamentação teórica e justificativa'
      },
      {
        name: 'Clareza das Ideias',
        weight: 30,
        description: 'Clareza na dissertação das ideias no plano de pesquisa'
      },
      {
        name: 'Originalidade',
        weight: 15,
        description: 'Originalidade da pesquisa e relevância do tema'
      },
      {
        name: 'Referências',
        weight: 5,
        description: 'Adequação e coerência das referências que fundamentam a proposta da pesquisa'
      },
      {
        name: 'Objetivo Pedagógico',
        weight: 20,
        description: 'O relato de pesquisa atingiu o objetivo pedagógico estabelecido'
      }
    ]
  },
  {
    category: ProjectCategory.CATEGORY_III,
    stage: ProjectStage.SUBMISSION,
    criteria: [
      {
        name: 'Método Científico',
        weight: 35,
        description: 'Evidência da aplicação do método científico ou de engenharia, observando-se a relação entre os objetivos propostos e a metodologia empregada na pesquisa, sua fundamentação teórica e justificativa'
      },
      {
        name: 'Clareza das Ideias',
        weight: 25,
        description: 'Clareza na dissertação das ideias no plano de pesquisa'
      },
      {
        name: 'Originalidade',
        weight: 15,
        description: 'Originalidade da pesquisa e relevância do tema'
      },
      {
        name: 'Referências',
        weight: 10,
        description: 'Adequação e coerência das referências que fundamentam a proposta da pesquisa'
      },
      {
        name: 'Capacidade Argumentativa',
        weight: 15,
        description: 'A capacidade argumentativa deve ser usada para apresentar uma pesquisa de forma convincente, destacando sua relevância e embasamento'
      }
    ]
  }
];

export const VIRTUAL_CRITERIA: EvaluationCriteria[] = [
  {
    category: ProjectCategory.CATEGORY_I,
    stage: ProjectStage.VIRTUAL_EVALUATION,
    criteria: [
      {
        name: 'Método Científico',
        weight: 30,
        description: 'Método Científico ou de Engenharia: soluções dos problemas levantados, materiais e métodos empregados, coerência entre os resultados parciais/totais entre os objetivos propostos'
      },
      {
        name: 'Conhecimento',
        weight: 38,
        description: 'Conhecimento teórico sobre o tema, segurança e convicção nos resultados, considerando também o domínio dos participantes sobre o conteúdo'
      },
      {
        name: 'Comunicação Escrita',
        weight: 12,
        description: 'Relatório sucinto e resumo'
      },
      {
        name: 'Comunidade',
        weight: 12,
        description: 'O impacto social e/ou ambiental e/ou econômico da pesquisa, bem como a criatividade e inovação no seu desenvolvimento'
      },
      {
        name: 'Apresentação',
        weight: 8,
        description: 'Vídeo apresentado, clareza (oralidade), objetividade e organização da apresentação e a participação de todos os estudantes envolvidos'
      }
    ]
  }
];

export const PRESENTIAL_CRITERIA: EvaluationCriteria[] = [
  {
    category: ProjectCategory.CATEGORY_I,
    stage: ProjectStage.PRESENTIAL_EVALUATION,
    criteria: [
      {
        name: 'Apresentação Oral',
        weight: 50,
        description: 'Apresentação oral no estande, de forma clara (oralidade), objetiva (sugestão de duração máxima de 10 minutos) e com devida sequência lógica'
      },
      {
        name: 'Método Científico',
        weight: 30,
        description: 'Materiais e métodos empregados, fundamentação teórica, solução do problema, resultados e conclusão da pesquisa'
      },
      {
        name: 'Comunicação Escrita',
        weight: 20,
        description: 'Relatório sucinto da pesquisa, banner (pôster) de apresentação e registro da pesquisa (diário de bordo, portfólios, etc…)'
      }
    ]
  }
];

export function getCriteriaByCategory(category: ProjectCategory, stage: ProjectStage): EvaluationCriteria | undefined {
  let criteriaList: EvaluationCriteria[] = [];
  
  switch (stage) {
    case ProjectStage.SUBMISSION:
      criteriaList = SUBMISSION_CRITERIA;
      break;
    case ProjectStage.VIRTUAL_EVALUATION:
      criteriaList = VIRTUAL_CRITERIA;
      break;
    case ProjectStage.PRESENTIAL_EVALUATION:
      criteriaList = PRESENTIAL_CRITERIA;
      break;
  }
  
  return criteriaList.find(criteria => criteria.category === category);
}