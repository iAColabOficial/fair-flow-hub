import { Award, AwardType, ProjectCategory, KnowledgeArea } from '@/types/project';

export const SPECIAL_AWARDS: Award[] = [
  {
    id: 'inclusao-social',
    name: 'Inclusão Social',
    description: 'Prêmio para trabalhos que promovem a inclusão social',
    type: AwardType.SPECIAL_AWARD,
    criteria: 'Trabalhos que se destacam na promoção da inclusão social'
  },
  {
    id: 'inovacao',
    name: 'Inovação',
    description: 'Prêmio para trabalhos inovadores',
    type: AwardType.SPECIAL_AWARD,
    criteria: 'Trabalhos que apresentam soluções inovadoras'
  },
  {
    id: 'melhor-registro',
    name: 'Melhor Registro de Pesquisa',
    description: 'Prêmio para o melhor registro de pesquisa',
    type: AwardType.SPECIAL_AWARD,
    criteria: 'Trabalhos com excelente documentação e registro da pesquisa'
  },
  {
    id: 'relevancia-social',
    name: 'Relevância Social',
    description: 'Prêmio para trabalhos com relevância social',
    type: AwardType.SPECIAL_AWARD,
    criteria: 'Trabalhos que abordam problemas sociais relevantes'
  },
  {
    id: 'sustentabilidade',
    name: 'Sustentabilidade',
    description: 'Prêmio para trabalhos focados em sustentabilidade',
    type: AwardType.SPECIAL_AWARD,
    criteria: 'Trabalhos que promovem práticas sustentáveis'
  },
  {
    id: 'empreendedorismo',
    name: 'Empreendedorismo',
    description: 'Prêmio para trabalhos empreendedores',
    type: AwardType.SPECIAL_AWARD,
    criteria: 'Trabalhos que demonstram potencial empreendedor'
  },
  {
    id: 'novas-tecnologias',
    name: 'Desenvolvimento de Novas Tecnologias',
    description: 'Prêmio para trabalhos que desenvolvem novas tecnologias',
    type: AwardType.SPECIAL_AWARD,
    criteria: 'Trabalhos que apresentam desenvolvimento tecnológico'
  },
  {
    id: 'protagonismo-feminino',
    name: 'Protagonismo Feminino',
    description: 'Prêmio Maria Laura Leite Lopes',
    type: AwardType.SPECIAL_AWARD,
    area: KnowledgeArea.EXACT_EARTH_SCIENCES,
    criteria: 'Pesquisa realizada por pesquisadoras do sexo feminino nas áreas de Matemática, Física, Astronomia, Robótica ou Engenharias'
  },
  {
    id: 'meio-ambiente',
    name: 'Contribuição para o Meio Ambiente',
    description: 'Prêmio para trabalhos que contribuem para o meio ambiente',
    type: AwardType.SPECIAL_AWARD,
    criteria: 'Trabalhos que apresentam soluções ambientais'
  },
  {
    id: 'biotecnologia',
    name: 'Biotecnologia',
    description: 'Prêmio para trabalhos em biotecnologia',
    type: AwardType.SPECIAL_AWARD,
    area: KnowledgeArea.BIOLOGICAL_SCIENCES,
    criteria: 'Trabalhos que utilizam biotecnologia'
  },
  {
    id: 'robotica-ia',
    name: 'Robótica e Inteligência Computacional',
    description: 'Prêmio para trabalhos em robótica e IA',
    type: AwardType.SPECIAL_AWARD,
    area: KnowledgeArea.EXACT_EARTH_SCIENCES,
    criteria: 'Trabalhos que utilizam robótica ou inteligência artificial'
  }
];

export const REGIONAL_AWARDS: Award[] = [
  {
    id: 'cidade-sede',
    name: 'Melhor projeto oriundo da Cidade-Sede',
    description: 'Prêmio para o melhor projeto da cidade-sede',
    type: AwardType.REGIONAL_AWARD,
    criteria: 'Melhor projeto oriundo da cidade que sedia o evento'
  },
  {
    id: 'santa-catarina',
    name: 'Melhor projeto oriundo de Santa Catarina',
    description: 'Prêmio para o melhor projeto de Santa Catarina (excluindo cidade-sede)',
    type: AwardType.REGIONAL_AWARD,
    criteria: 'Melhor projeto oriundo do estado de Santa Catarina'
  },
  {
    id: 'regiao-sul',
    name: 'Melhor Projeto oriundo da Região Sul',
    description: 'Prêmio para o melhor projeto da Região Sul (excluindo Santa Catarina)',
    type: AwardType.REGIONAL_AWARD,
    criteria: 'Melhor projeto oriundo da Região Sul do Brasil'
  },
  {
    id: 'regiao-sudeste',
    name: 'Melhor Projeto oriundo da Região Sudeste',
    description: 'Prêmio para o melhor projeto da Região Sudeste',
    type: AwardType.REGIONAL_AWARD,
    criteria: 'Melhor projeto oriundo da Região Sudeste do Brasil'
  },
  {
    id: 'regiao-nordeste',
    name: 'Melhor Projeto oriundo da Região Nordeste',
    description: 'Prêmio para o melhor projeto da Região Nordeste',
    type: AwardType.REGIONAL_AWARD,
    criteria: 'Melhor projeto oriundo da Região Nordeste do Brasil'
  },
  {
    id: 'regiao-norte',
    name: 'Melhor Projeto oriundo da Região Norte',
    description: 'Prêmio para o melhor projeto da Região Norte',
    type: AwardType.REGIONAL_AWARD,
    criteria: 'Melhor projeto oriundo da Região Norte do Brasil'
  },
  {
    id: 'regiao-centro-oeste',
    name: 'Melhor Projeto oriundo da Região Centro-Oeste',
    description: 'Prêmio para o melhor projeto da Região Centro-Oeste',
    type: AwardType.REGIONAL_AWARD,
    criteria: 'Melhor projeto oriundo da Região Centro-Oeste do Brasil'
  }
];

export const INSTITUTIONAL_AWARDS: Award[] = [
  {
    id: 'escola-publica',
    name: 'Melhor projeto oriundo de Escola Pública',
    description: 'Prêmio para o melhor projeto de escola pública',
    type: AwardType.INSTITUTIONAL_AWARD,
    criteria: 'Melhor projeto oriundo de instituição pública de ensino'
  },
  {
    id: 'escola-particular',
    name: 'Melhor projeto oriundo de Escola Particular',
    description: 'Prêmio para o melhor projeto de escola particular',
    type: AwardType.INSTITUTIONAL_AWARD,
    criteria: 'Melhor projeto oriundo de instituição particular de ensino'
  },
  {
    id: 'orientador-destaque',
    name: 'Orientador Destaque',
    description: 'Prêmio para o orientador que se destaca',
    type: AwardType.SPECIAL_AWARD,
    criteria: 'Orientador que demonstra excelência na orientação de projetos'
  },
  {
    id: 'pequeno-cientista',
    name: 'Prêmio Pequeno Cientista',
    description: 'Prêmio especial para as categorias I e II',
    type: AwardType.SPECIAL_AWARD,
    category: ProjectCategory.CATEGORY_I,
    criteria: 'Trabalho finalista entre as Categorias I e II que se destaca'
  },
  {
    id: 'excelencia-ic',
    name: 'Prêmio de Excelência em Iniciação Científica',
    description: 'Prêmio para os 3 melhores trabalhos gerais',
    type: AwardType.SPECIAL_AWARD,
    criteria: 'Os 03 trabalhos com as melhores pontuações gerais da FEBIC'
  }
];

export const CATEGORY_AWARDS: Award[] = [
  {
    id: 'category-i-winner',
    name: '1º Lugar - Categoria I',
    description: 'Primeiro lugar da Categoria I - Educação Infantil',
    type: AwardType.CATEGORY_WINNER,
    category: ProjectCategory.CATEGORY_I,
    criteria: 'Melhor projeto da Categoria I'
  },
  {
    id: 'category-ii-a-winner',
    name: '1º Lugar - Categoria II-A',
    description: 'Primeiro lugar da Categoria II-A - Ensino Fundamental 1º ao 3º ano',
    type: AwardType.CATEGORY_WINNER,
    category: ProjectCategory.CATEGORY_II_A,
    criteria: 'Melhor projeto da Categoria II-A'
  },
  {
    id: 'category-ii-b-winner',
    name: '1º Lugar - Categoria II-B',
    description: 'Primeiro lugar da Categoria II-B - Ensino Fundamental 4º ao 6º ano',
    type: AwardType.CATEGORY_WINNER,
    category: ProjectCategory.CATEGORY_II_B,
    criteria: 'Melhor projeto da Categoria II-B'
  },
  {
    id: 'category-iii-winner',
    name: '1º Lugar - Categoria III',
    description: 'Primeiro lugar da Categoria III - Ensino Fundamental 7º ao 9º ano',
    type: AwardType.CATEGORY_WINNER,
    category: ProjectCategory.CATEGORY_III,
    criteria: 'Melhor projeto da Categoria III'
  },
  {
    id: 'category-iv-winner',
    name: '1º Lugar - Categoria IV',
    description: 'Primeiro lugar da Categoria IV - Ensino Técnico subsequente',
    type: AwardType.CATEGORY_WINNER,
    category: ProjectCategory.CATEGORY_IV,
    criteria: 'Melhor projeto da Categoria IV'
  },
  {
    id: 'category-v-winner',
    name: '1º Lugar - Categoria V',
    description: 'Primeiro lugar da Categoria V - Educação de Jovens e Adultos',
    type: AwardType.CATEGORY_WINNER,
    category: ProjectCategory.CATEGORY_V,
    criteria: 'Melhor projeto da Categoria V'
  },
  {
    id: 'category-vi-winner',
    name: '1º Lugar - Categoria VI',
    description: 'Primeiro lugar da Categoria VI - Ensino Médio',
    type: AwardType.CATEGORY_WINNER,
    category: ProjectCategory.CATEGORY_VI,
    criteria: 'Melhor projeto da Categoria VI'
  },
  {
    id: 'category-vii-winner',
    name: '1º Lugar - Categoria VII',
    description: 'Primeiro lugar da Categoria VII - Ensino Superior',
    type: AwardType.CATEGORY_WINNER,
    category: ProjectCategory.CATEGORY_VII,
    criteria: 'Melhor projeto da Categoria VII'
  },
  {
    id: 'category-viii-winner',
    name: '1º Lugar - Categoria VIII',
    description: 'Primeiro lugar da Categoria VIII - Pós-graduação',
    type: AwardType.CATEGORY_WINNER,
    category: ProjectCategory.CATEGORY_VIII,
    criteria: 'Melhor projeto da Categoria VIII'
  }
];

export const ALL_AWARDS = [
  ...CATEGORY_AWARDS,
  ...SPECIAL_AWARDS,
  ...REGIONAL_AWARDS,
  ...INSTITUTIONAL_AWARDS
];