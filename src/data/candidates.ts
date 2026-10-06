export type RoleKey =
  | 'deputado_federal'
  | 'deputado_estadual'
  | 'senador'
  | 'governador'
  | 'presidente';

export interface RoleDefinition {
  key: RoleKey;
  title: string;
  digits: number;
  hasVice?: boolean;
  hasSuplentes?: boolean;
}

export interface Party {
  number: string;
  sigla: string;
  name: string;
  slogan: string;
  color: string;
}

export interface SubCandidate {
  name: string;
  roleLabel: string;
  avatarSvg: string;
}

export interface Candidate {
  number: string;
  name: string;
  partyNumber: string;
  partySigla: string;
  partyName: string;
  role: RoleKey;
  avatarSvg: string;
  vice?: SubCandidate;
  suplente1?: SubCandidate;
  suplente2?: SubCandidate;
}

export const ROLES_ORDER: RoleDefinition[] = [
  {
    key: 'deputado_federal',
    title: 'Deputado Federal',
    digits: 4,
  },
  {
    key: 'deputado_estadual',
    title: 'Deputado Estadual',
    digits: 5,
  },
  {
    key: 'senador',
    title: 'Senador',
    digits: 3,
    hasSuplentes: true,
  },
  {
    key: 'governador',
    title: 'Governador',
    digits: 2,
    hasVice: true,
  },
  {
    key: 'presidente',
    title: 'Presidente',
    digits: 2,
    hasVice: true,
  },
];

export const PARTIES: Record<string, Party> = {
  '42': {
    number: '42',
    sigla: 'PCL',
    name: 'Partido do Código Limpo',
    slogan: 'Refatorando o Brasil sem Gambiarra',
    color: '#10b981',
  },
  '99': {
    number: '99',
    sigla: 'PDS',
    name: 'Partido do Deploy na Sexta',
    slogan: 'Coragem, Café Forte e Testes em Produção',
    color: '#f59e0b',
  },
  '10': {
    number: '10',
    sigla: 'UFS',
    name: 'União Full-Stack Brasileira',
    slogan: 'Do Banco de Dados ao Pixel Perfeito',
    color: '#3b82f6',
  },
  '20': {
    number: '20',
    sigla: 'FIA',
    name: 'Frente da Inteligência Artificial',
    slogan: 'Mais GPU, Menos Alucinação',
    color: '#8b5cf6',
  },
  '77': {
    number: '77',
    sigla: 'POS',
    name: 'Partido Open Source',
    slogan: 'Código Aberto e Pull Request Aprovado',
    color: '#ec4899',
  },
};

/**
 * Gera retratos SVG estilizados em alta definição (Data URI) para os candidatos
 * garantindo carregamento instantâneo (0ms) e estética oficial de foto 3x4 na tela da Urna.
 */
function createAvatarDataUri(config: {
  bgTop: string;
  bgBottom: string;
  skin: string;
  hairColor: string;
  hairStyle: 'short' | 'curly' | 'bun' | 'long' | 'bald';
  shirtColor: string;
  tieColor?: string;
  glasses?: boolean;
  beard?: boolean;
  headset?: boolean;
  initials: string;
}): string {
  const {
    bgTop,
    bgBottom,
    skin,
    hairColor,
    hairStyle,
    shirtColor,
    tieColor,
    glasses,
    beard,
    headset,
    initials,
  } = config;

  let hairPath = '';
  if (hairStyle === 'short') {
    hairPath = `<path d="M55 72 C55 40, 145 40, 145 72 C145 55, 130 48, 100 48 C70 48, 55 55, 55 72 Z" fill="${hairColor}" />`;
  } else if (hairStyle === 'curly') {
    hairPath = `
      <circle cx="65" cy="58" r="18" fill="${hairColor}" />
      <circle cx="88" cy="48" r="20" fill="${hairColor}" />
      <circle cx="114" cy="48" r="20" fill="${hairColor}" />
      <circle cx="135" cy="58" r="18" fill="${hairColor}" />
    `;
  } else if (hairStyle === 'long') {
    hairPath = `
      <path d="M50 75 C48 35, 152 35, 150 75 L156 145 L136 145 L136 75 C136 52, 64 52, 64 75 L64 145 L44 145 Z" fill="${hairColor}" />
    `;
  } else if (hairStyle === 'bun') {
    hairPath = `
      <circle cx="100" cy="34" r="16" fill="${hairColor}" />
      <path d="M56 74 C56 42, 144 42, 144 74 C144 56, 128 48, 100 48 C72 48, 56 56, 56 74 Z" fill="${hairColor}" />
    `;
  }

  const beardSvg = beard
    ? `<path d="M66 104 C66 135, 134 135, 134 104 C130 116, 118 122, 100 122 C82 122, 70 116, 66 104 Z" fill="${hairColor}" opacity="0.88" />`
    : '';

  const glassesSvg = glasses
    ? `
      <g stroke="#1e293b" stroke-width="3.5" fill="rgba(255,255,255,0.18)">
        <rect x="67" y="76" width="26" height="18" rx="4" />
        <rect x="107" y="76" width="26" height="18" rx="4" />
        <line x1="93" y1="84" x2="107" y2="84" />
      </g>
    `
    : '';

  const headsetSvg = headset
    ? `
      <path d="M52 88 C52 44, 148 44, 148 88" fill="none" stroke="#0f172a" stroke-width="5" />
      <rect x="45" y="78" width="10" height="24" rx="5" fill="#0f172a" />
      <rect x="145" y="78" width="10" height="24" rx="5" fill="#0f172a" />
    `
    : '';

  const tieSvg = tieColor
    ? `<polygon points="95,148 105,148 108,195 100,208 92,195" fill="${tieColor}" />`
    : '';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240" width="200" height="240">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${bgTop}" />
        <stop offset="100%" stop-color="${bgBottom}" />
      </linearGradient>
    </defs>
    <rect width="200" height="240" fill="url(#bg)" />
    <!-- Ombros / Terno -->
    <path d="M22 240 C22 172, 62 152, 100 152 C138 152, 178 172, 178 240 Z" fill="${shirtColor}" />
    <!-- Gola branca -->
    <polygon points="76,152 100,180 124,152" fill="#f8fafc" />
    ${tieSvg}
    <!-- Pescoço -->
    <rect x="84" y="124" width="32" height="34" rx="10" fill="${skin}" />
    <!-- Rosto -->
    <rect x="60" y="50" width="80" height="84" rx="36" fill="${skin}" />
    <!-- Olhos -->
    <circle cx="80" cy="85" r="4.5" fill="#0f172a" />
    <circle cx="120" cy="85" r="4.5" fill="#0f172a" />
    <!-- Sobrancelhas -->
    <path d="M71 74 Q80 70 89 74" stroke="${hairColor}" stroke-width="3" fill="none" stroke-linecap="round" />
    <path d="M111 74 Q120 70 129 74" stroke="${hairColor}" stroke-width="3" fill="none" stroke-linecap="round" />
    <!-- Sorriso -->
    <path d="M86 108 Q100 118 114 108" stroke="#7c2d12" stroke-width="3" fill="none" stroke-linecap="round" />
    ${beardSvg}
    ${hairPath}
    ${glassesSvg}
    ${headsetSvg}
    <!-- Selo discreto no canto -->
    <rect x="150" y="10" width="38" height="22" rx="4" fill="rgba(15,23,42,0.35)" />
    <text x="169" y="25" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">${initials}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const CANDIDATES: Candidate[] = [
  // ==========================================
  // PRESIDENTE (2 DÍGITOS)
  // ==========================================
  {
    number: '42',
    name: 'ROBERTO CLEAN CODE',
    partyNumber: '42',
    partySigla: 'PCL',
    partyName: 'Partido do Código Limpo',
    role: 'presidente',
    avatarSvg: createAvatarDataUri({
      bgTop: '#d1fae5',
      bgBottom: '#6ee7b7',
      skin: '#f1c27d',
      hairColor: '#334155',
      hairStyle: 'short',
      shirtColor: '#0f172a',
      tieColor: '#10b981',
      glasses: true,
      beard: true,
      initials: '42',
    }),
    vice: {
      name: 'ADA ARQUITETA HEXAGONAL',
      roleLabel: 'Vice-Presidente',
      avatarSvg: createAvatarDataUri({
        bgTop: '#e0f2fe',
        bgBottom: '#bae6fd',
        skin: '#ffdbac',
        hairColor: '#7c2d12',
        hairStyle: 'bun',
        shirtColor: '#1e293b',
        glasses: true,
        initials: '42',
      }),
    },
  },
  {
    number: '99',
    name: 'LÉO DEPLOY NA SEXTA',
    partyNumber: '99',
    partySigla: 'PDS',
    partyName: 'Partido do Deploy na Sexta',
    role: 'presidente',
    avatarSvg: createAvatarDataUri({
      bgTop: '#fef3c7',
      bgBottom: '#fde68a',
      skin: '#e0ac69',
      hairColor: '#1e293b',
      hairStyle: 'curly',
      shirtColor: '#78350f',
      tieColor: '#f59e0b',
      headset: true,
      beard: true,
      initials: '99',
    }),
    vice: {
      name: 'CARLA HOTFIX DE MADRUGADA',
      roleLabel: 'Vice-Presidente',
      avatarSvg: createAvatarDataUri({
        bgTop: '#ffedd5',
        bgBottom: '#fed7aa',
        skin: '#8d5524',
        hairColor: '#0f172a',
        hairStyle: 'long',
        shirtColor: '#334155',
        glasses: true,
        initials: '99',
      }),
    },
  },
  {
    number: '10',
    name: 'MARINA FULL-STACK',
    partyNumber: '10',
    partySigla: 'UFS',
    partyName: 'União Full-Stack Brasileira',
    role: 'presidente',
    avatarSvg: createAvatarDataUri({
      bgTop: '#dbeafe',
      bgBottom: '#93c5fd',
      skin: '#c68642',
      hairColor: '#1e1b4b',
      hairStyle: 'long',
      shirtColor: '#1e3a8a',
      tieColor: '#38bdf8',
      glasses: false,
      initials: '10',
    }),
    vice: {
      name: 'TIAGO DEVOPS KUBERNETES',
      roleLabel: 'Vice-Presidente',
      avatarSvg: createAvatarDataUri({
        bgTop: '#e0e7ff',
        bgBottom: '#c7d2fe',
        skin: '#f1c27d',
        hairColor: '#475569',
        hairStyle: 'bald',
        shirtColor: '#0f172a',
        beard: true,
        initials: '10',
      }),
    },
  },
  {
    number: '20',
    name: 'DR. PROMPT NEURAL',
    partyNumber: '20',
    partySigla: 'FIA',
    partyName: 'Frente da Inteligência Artificial',
    role: 'presidente',
    avatarSvg: createAvatarDataUri({
      bgTop: '#ede9fe',
      bgBottom: '#c4b5fd',
      skin: '#ffdbac',
      hairColor: '#64748b',
      hairStyle: 'short',
      shirtColor: '#2e1065',
      tieColor: '#a855f7',
      glasses: true,
      initials: '20',
    }),
    vice: {
      name: 'SOFIA TRANSFORMER LLM',
      roleLabel: 'Vice-Presidente',
      avatarSvg: createAvatarDataUri({
        bgTop: '#f3e8ff',
        bgBottom: '#d8b4fe',
        skin: '#e0ac69',
        hairColor: '#4c1d95',
        hairStyle: 'bun',
        shirtColor: '#1e1b4b',
        initials: '20',
      }),
    },
  },
  {
    number: '77',
    name: 'LINUS TORVALDS BR',
    partyNumber: '77',
    partySigla: 'POS',
    partyName: 'Partido Open Source',
    role: 'presidente',
    avatarSvg: createAvatarDataUri({
      bgTop: '#fce7f3',
      bgBottom: '#f9a8d4',
      skin: '#ffdbac',
      hairColor: '#713f12',
      hairStyle: 'short',
      shirtColor: '#31102f',
      tieColor: '#ec4899',
      glasses: true,
      initials: '77',
    }),
    vice: {
      name: 'BIANCA GIT MERGE',
      roleLabel: 'Vice-Presidente',
      avatarSvg: createAvatarDataUri({
        bgTop: '#ffe4e6',
        bgBottom: '#fda4af',
        skin: '#8d5524',
        hairColor: '#090d16',
        hairStyle: 'curly',
        shirtColor: '#1f2937',
        initials: '77',
      }),
    },
  },

  // ==========================================
  // GOVERNADOR (2 DÍGITOS)
  // ==========================================
  {
    number: '42',
    name: 'CAMILA TYPESCRIPT',
    partyNumber: '42',
    partySigla: 'PCL',
    partyName: 'Partido do Código Limpo',
    role: 'governador',
    avatarSvg: createAvatarDataUri({
      bgTop: '#d1fae5',
      bgBottom: '#a7f3d0',
      skin: '#e0ac69',
      hairColor: '#1e293b',
      hairStyle: 'long',
      shirtColor: '#064e3b',
      glasses: true,
      initials: '42',
    }),
    vice: {
      name: 'BRUNO ZERO ANY',
      roleLabel: 'Vice-Governador',
      avatarSvg: createAvatarDataUri({
        bgTop: '#ecfdf5',
        bgBottom: '#a7f3d0',
        skin: '#f1c27d',
        hairColor: '#334155',
        hairStyle: 'short',
        shirtColor: '#1e293b',
        beard: true,
        initials: '42',
      }),
    },
  },
  {
    number: '99',
    name: 'RAFAEL SEM BACKUP',
    partyNumber: '99',
    partySigla: 'PDS',
    partyName: 'Partido do Deploy na Sexta',
    role: 'governador',
    avatarSvg: createAvatarDataUri({
      bgTop: '#fef3c7',
      bgBottom: '#fcd34d',
      skin: '#c68642',
      hairColor: '#0f172a',
      hairStyle: 'short',
      shirtColor: '#451a03',
      tieColor: '#f59e0b',
      headset: true,
      initials: '99',
    }),
    vice: {
      name: 'PAULA CHMOD 777',
      roleLabel: 'Vice-Governadora',
      avatarSvg: createAvatarDataUri({
        bgTop: '#fffbeb',
        bgBottom: '#fde68a',
        skin: '#ffdbac',
        hairColor: '#9a3412',
        hairStyle: 'bun',
        shirtColor: '#292524',
        initials: '99',
      }),
    },
  },
  {
    number: '10',
    name: 'HENRIQUE REACT FIBER',
    partyNumber: '10',
    partySigla: 'UFS',
    partyName: 'União Full-Stack Brasileira',
    role: 'governador',
    avatarSvg: createAvatarDataUri({
      bgTop: '#dbeafe',
      bgBottom: '#bfdbfe',
      skin: '#8d5524',
      hairColor: '#0f172a',
      hairStyle: 'curly',
      shirtColor: '#1e3a8a',
      tieColor: '#60a5fa',
      glasses: true,
      initials: '10',
    }),
    vice: {
      name: 'LETÍCIA TAILWIND CSS',
      roleLabel: 'Vice-Governadora',
      avatarSvg: createAvatarDataUri({
        bgTop: '#eff6ff',
        bgBottom: '#bfdbfe',
        skin: '#f1c27d',
        hairColor: '#475569',
        hairStyle: 'long',
        shirtColor: '#0f172a',
        initials: '10',
      }),
    },
  },

  // ==========================================
  // SENADOR (3 DÍGITOS)
  // ==========================================
  {
    number: '420',
    name: 'PROF. SOLID TDD',
    partyNumber: '42',
    partySigla: 'PCL',
    partyName: 'Partido do Código Limpo',
    role: 'senador',
    avatarSvg: createAvatarDataUri({
      bgTop: '#d1fae5',
      bgBottom: '#6ee7b7',
      skin: '#8d5524',
      hairColor: '#cbd5e1',
      hairStyle: 'short',
      shirtColor: '#0f172a',
      tieColor: '#10b981',
      glasses: true,
      beard: true,
      initials: '420',
    }),
    suplente1: {
      name: '1º Suplente: ELISA DRY KISS',
      roleLabel: '1º Suplente',
      avatarSvg: createAvatarDataUri({
        bgTop: '#d1fae5',
        bgBottom: '#a7f3d0',
        skin: '#ffdbac',
        hairColor: '#334155',
        hairStyle: 'bun',
        shirtColor: '#1e293b',
        initials: '1ºS',
      }),
    },
    suplente2: {
      name: '2º Suplente: MARCOS CODE REVIEW',
      roleLabel: '2º Suplente',
      avatarSvg: createAvatarDataUri({
        bgTop: '#d1fae5',
        bgBottom: '#a7f3d0',
        skin: '#e0ac69',
        hairColor: '#0f172a',
        hairStyle: 'short',
        shirtColor: '#334155',
        initials: '2ºS',
      }),
    },
  },
  {
    number: '999',
    name: 'GUSTAVO GIT PUSH FORCE',
    partyNumber: '99',
    partySigla: 'PDS',
    partyName: 'Partido do Deploy na Sexta',
    role: 'senador',
    avatarSvg: createAvatarDataUri({
      bgTop: '#fef3c7',
      bgBottom: '#fde68a',
      skin: '#f1c27d',
      hairColor: '#7c2d12',
      hairStyle: 'curly',
      shirtColor: '#1c1917',
      tieColor: '#f59e0b',
      beard: true,
      initials: '999',
    }),
    suplente1: {
      name: '1º Suplente: DIEGO NA MINHA MÁQUINA FUNCIONA',
      roleLabel: '1º Suplente',
      avatarSvg: createAvatarDataUri({
        bgTop: '#fef3c7',
        bgBottom: '#fde68a',
        skin: '#c68642',
        hairColor: '#1e293b',
        hairStyle: 'short',
        shirtColor: '#292524',
        initials: '1ºS',
      }),
    },
    suplente2: {
      name: '2º Suplente: VANESSA CONSOLE LOG',
      roleLabel: '2º Suplente',
      avatarSvg: createAvatarDataUri({
        bgTop: '#fef3c7',
        bgBottom: '#fde68a',
        skin: '#ffdbac',
        hairColor: '#451a03',
        hairStyle: 'long',
        shirtColor: '#44403c',
        initials: '2ºS',
      }),
    },
  },
  {
    number: '100',
    name: 'FERNANDA WEBGL THREEJS',
    partyNumber: '10',
    partySigla: 'UFS',
    partyName: 'União Full-Stack Brasileira',
    role: 'senador',
    avatarSvg: createAvatarDataUri({
      bgTop: '#dbeafe',
      bgBottom: '#93c5fd',
      skin: '#ffdbac',
      hairColor: '#1e3a8a',
      hairStyle: 'bun',
      shirtColor: '#0f172a',
      glasses: true,
      initials: '100',
    }),
    suplente1: {
      name: '1º Suplente: LUCAS SHADER GLSL',
      roleLabel: '1º Suplente',
      avatarSvg: createAvatarDataUri({
        bgTop: '#dbeafe',
        bgBottom: '#bfdbfe',
        skin: '#e0ac69',
        hairColor: '#0f172a',
        hairStyle: 'short',
        shirtColor: '#1e293b',
        initials: '1ºS',
      }),
    },
    suplente2: {
      name: '2º Suplente: NINA CANVAS 60FPS',
      roleLabel: '2º Suplente',
      avatarSvg: createAvatarDataUri({
        bgTop: '#dbeafe',
        bgBottom: '#bfdbfe',
        skin: '#8d5524',
        hairColor: '#090d16',
        hairStyle: 'curly',
        shirtColor: '#1e3a8a',
        initials: '2ºS',
      }),
    },
  },

  // ==========================================
  // DEPUTADO FEDERAL (4 DÍGITOS)
  // ==========================================
  {
    number: '4242',
    name: 'DANIEL REFACTOR SÊNIOR',
    partyNumber: '42',
    partySigla: 'PCL',
    partyName: 'Partido do Código Limpo',
    role: 'deputado_federal',
    avatarSvg: createAvatarDataUri({
      bgTop: '#d1fae5',
      bgBottom: '#6ee7b7',
      skin: '#e0ac69',
      hairColor: '#1e293b',
      hairStyle: 'short',
      shirtColor: '#065f46',
      tieColor: '#34d399',
      glasses: true,
      initials: '4242',
    }),
  },
  {
    number: '9999',
    name: 'CAIO DROP TABLE',
    partyNumber: '99',
    partySigla: 'PDS',
    partyName: 'Partido do Deploy na Sexta',
    role: 'deputado_federal',
    avatarSvg: createAvatarDataUri({
      bgTop: '#fef3c7',
      bgBottom: '#fcd34d',
      skin: '#f1c27d',
      hairColor: '#78350f',
      hairStyle: 'curly',
      shirtColor: '#292524',
      headset: true,
      initials: '9999',
    }),
  },
  {
    number: '1010',
    name: 'JULIANA API RESTFUL',
    partyNumber: '10',
    partySigla: 'UFS',
    partyName: 'União Full-Stack Brasileira',
    role: 'deputado_federal',
    avatarSvg: createAvatarDataUri({
      bgTop: '#dbeafe',
      bgBottom: '#93c5fd',
      skin: '#c68642',
      hairColor: '#0f172a',
      hairStyle: 'long',
      shirtColor: '#1e40af',
      initials: '1010',
    }),
  },
  {
    number: '2020',
    name: 'ALEX AGENTE AUTÔNOMO',
    partyNumber: '20',
    partySigla: 'FIA',
    partyName: 'Frente da Inteligência Artificial',
    role: 'deputado_federal',
    avatarSvg: createAvatarDataUri({
      bgTop: '#ede9fe',
      bgBottom: '#c4b5fd',
      skin: '#8d5524',
      hairColor: '#1e1b4b',
      hairStyle: 'short',
      shirtColor: '#3b0764',
      glasses: true,
      beard: true,
      initials: '2020',
    }),
  },

  // ==========================================
  // DEPUTADO ESTADUAL (5 DÍGITOS)
  // ==========================================
  {
    number: '42123',
    name: 'PATRÍCIA TESTE UNITÁRIO',
    partyNumber: '42',
    partySigla: 'PCL',
    partyName: 'Partido do Código Limpo',
    role: 'deputado_estadual',
    avatarSvg: createAvatarDataUri({
      bgTop: '#d1fae5',
      bgBottom: '#a7f3d0',
      skin: '#ffdbac',
      hairColor: '#7c2d12',
      hairStyle: 'bun',
      shirtColor: '#064e3b',
      glasses: true,
      initials: '42123',
    }),
  },
  {
    number: '99000',
    name: 'FELIPE COMMIT SEM MENSAGEM',
    partyNumber: '99',
    partySigla: 'PDS',
    partyName: 'Partido do Deploy na Sexta',
    role: 'deputado_estadual',
    avatarSvg: createAvatarDataUri({
      bgTop: '#fef3c7',
      bgBottom: '#fde68a',
      skin: '#e0ac69',
      hairColor: '#1e293b',
      hairStyle: 'short',
      shirtColor: '#451a03',
      beard: true,
      initials: '99000',
    }),
  },
  {
    number: '10123',
    name: 'VITOR DOCKER COMPOSE',
    partyNumber: '10',
    partySigla: 'UFS',
    partyName: 'União Full-Stack Brasileira',
    role: 'deputado_estadual',
    avatarSvg: createAvatarDataUri({
      bgTop: '#dbeafe',
      bgBottom: '#bfdbfe',
      skin: '#f1c27d',
      hairColor: '#334155',
      hairStyle: 'short',
      shirtColor: '#1e3a8a',
      tieColor: '#38bdf8',
      initials: '10123',
    }),
  },
  {
    number: '77777',
    name: 'CLARA LINUX KERNEL',
    partyNumber: '77',
    partySigla: 'POS',
    partyName: 'Partido Open Source',
    role: 'deputado_estadual',
    avatarSvg: createAvatarDataUri({
      bgTop: '#fce7f3',
      bgBottom: '#fbcfe8',
      skin: '#8d5524',
      hairColor: '#0f172a',
      hairStyle: 'curly',
      shirtColor: '#500724',
      glasses: true,
      initials: '77777',
    }),
  },
];

export function findCandidate(role: RoleKey, number: string): Candidate | undefined {
  return CANDIDATES.find((c) => c.role === role && c.number === number);
}

export function findPartyByPrefix(number: string): Party | undefined {
  if (number.length < 2) return undefined;
  const prefix = number.slice(0, 2);
  return PARTIES[prefix];
}

export function getCandidatesByRole(role: RoleKey): Candidate[] {
  return CANDIDATES.filter((c) => c.role === role);
}
