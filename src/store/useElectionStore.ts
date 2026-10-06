import { create } from 'zustand';
import {
  ROLES_ORDER,
  RoleDefinition,
  RoleKey,
  findCandidate,
  findPartyByPrefix,
} from '../data/candidates';
import { urnaSound } from '../utils/sound';

export type ElectionPhase = 'VOTING' | 'SAVING' | 'FINISHED';
export type FlowMode = 'completo' | 'rapido';
export type CameraPreset = 'voting' | 'screen' | 'keypad' | 'free360' | 'back';
export type ActiveModal = 'none' | 'boletim' | 'about';

export interface RecordedVote {
  role: RoleKey;
  roleTitle: string;
  type: 'NOMINAL' | 'LEGENDA' | 'BRANCO' | 'NULO';
  number: string;
  candidateName?: string;
  partySigla?: string;
  timestamp: number;
}

interface StoredBoletim {
  totalVoters: number;
  votes: RecordedVote[];
  lastResetAt: string;
}

const STORAGE_KEY = 'urna3d_boletim_v1';

function loadBoletim(): StoredBoletim {
  if (typeof window === 'undefined') {
    return { totalVoters: 0, votes: [], lastResetAt: new Date().toLocaleString('pt-BR') };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Ignore localStorage parse errors
  }
  return { totalVoters: 0, votes: [], lastResetAt: new Date().toLocaleString('pt-BR') };
}

function saveBoletim(data: StoredBoletim) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore quota errors
  }
}

interface ElectionState {
  flowMode: FlowMode;
  currentRoleIndex: number;
  digits: string;
  isBranco: boolean;
  phase: ElectionPhase;
  savingProgress: number;
  pressedKey: { id: string; timestamp: number } | null;

  // Câmera 3D
  cameraPreset: CameraPreset;

  // Áudio e Acessibilidade
  soundEnabled: boolean;
  voiceEnabled: boolean;

  // UI e Modais
  activeModal: ActiveModal;
  colinhaOpen: boolean;

  // Apuração / Boletim de Urna
  currentVoterVotes: RecordedVote[];
  boletim: StoredBoletim;

  // Getters auxiliares
  getActiveRoles: () => RoleDefinition[];
  getCurrentRole: () => RoleDefinition;

  // Ações da Urna
  pressDigit: (digit: string) => void;
  pressBranco: () => void;
  pressCorrige: () => void;
  pressConfirma: () => void;
  quickTypeNumber: (numStr: string) => void;
  restartVoter: () => void;
  resetZeresima: () => void;

  // Configurações de Fluxo e Visual
  setFlowMode: (mode: FlowMode) => void;
  setCameraPreset: (preset: CameraPreset) => void;
  toggleSound: () => void;
  toggleVoice: () => void;
  setActiveModal: (modal: ActiveModal) => void;
  setColinhaOpen: (open: boolean) => void;
}

export const useElectionStore = create<ElectionState>((set, get) => ({
  flowMode: 'completo',
  currentRoleIndex: 0,
  digits: '',
  isBranco: false,
  phase: 'VOTING',
  savingProgress: 0,
  pressedKey: null,

  cameraPreset: 'voting',

  soundEnabled: true,
  voiceEnabled: false,

  activeModal: 'none',
  colinhaOpen: true,

  currentVoterVotes: [],
  boletim: loadBoletim(),

  getActiveRoles: () => {
    const { flowMode } = get();
    if (flowMode === 'rapido') {
      return ROLES_ORDER.filter((r) => r.key === 'presidente');
    }
    return ROLES_ORDER;
  },

  getCurrentRole: () => {
    const roles = get().getActiveRoles();
    const idx = Math.min(get().currentRoleIndex, roles.length - 1);
    return roles[idx] || ROLES_ORDER[0];
  },

  pressDigit: (digit: string) => {
    const state = get();
    if (state.phase !== 'VOTING') return;

    set({ pressedKey: { id: digit, timestamp: Date.now() } });
    urnaSound.playKeyPress(state.soundEnabled);

    if (state.isBranco) return;

    const currentRole = state.getCurrentRole();
    if (state.digits.length >= currentRole.digits) return;

    const nextDigits = state.digits + digit;
    set({ digits: nextDigits });

    if (state.voiceEnabled) {
      if (nextDigits.length === currentRole.digits) {
        const cand = findCandidate(currentRole.key, nextDigits);
        if (cand) {
          urnaSound.speak(
            `${digit}. Número ${nextDigits.split('').join(' ')}. ${cand.name}, do ${cand.partyName}. Aperte a tecla verde para confirmar.`,
            true
          );
        } else {
          const party = findPartyByPrefix(nextDigits);
          if (
            party &&
            (currentRole.key === 'deputado_federal' || currentRole.key === 'deputado_estadual')
          ) {
            urnaSound.speak(`${digit}. Voto na legenda ${party.sigla}.`, true);
          } else {
            urnaSound.speak(`${digit}. Número errado. Voto nulo.`, true);
          }
        }
      } else {
        urnaSound.speak(digit, true);
      }
    }
  },

  pressBranco: () => {
    const state = get();
    if (state.phase !== 'VOTING') return;

    set({ pressedKey: { id: 'BRANCO', timestamp: Date.now() } });
    urnaSound.playActionKey('branco', state.soundEnabled);

    if (state.digits.length > 0) {
      if (state.voiceEnabled) {
        urnaSound.speak('Para votar em branco, o campo de voto deve estar vazio. Aperte corrige.', true);
      }
      return;
    }

    set({ isBranco: true, digits: '' });
    if (state.voiceEnabled) {
      urnaSound.speak('Voto em branco. Aperte a tecla verde para confirmar.', true);
    }
  },

  pressCorrige: () => {
    const state = get();
    if (state.phase !== 'VOTING') return;

    set({ pressedKey: { id: 'CORRIGE', timestamp: Date.now() } });
    urnaSound.playActionKey('corrige', state.soundEnabled);

    set({ digits: '', isBranco: false });
    if (state.voiceEnabled) {
      const role = state.getCurrentRole();
      urnaSound.speak(`Voto corrigido. Digite seu voto para ${role.title}.`, true);
    }
  },

  pressConfirma: () => {
    const state = get();
    if (state.phase !== 'VOTING') return;

    set({ pressedKey: { id: 'CONFIRMA', timestamp: Date.now() } });

    const currentRole = state.getCurrentRole();
    const isProportional =
      currentRole.key === 'deputado_federal' || currentRole.key === 'deputado_estadual';

    const partyPrefix = findPartyByPrefix(state.digits);
    const canConfirmLegenda = isProportional && state.digits.length >= 2 && Boolean(partyPrefix);
    const isCompleteDigits = state.digits.length === currentRole.digits;

    if (!state.isBranco && !isCompleteDigits && !canConfirmLegenda) {
      urnaSound.playActionKey('corrige', state.soundEnabled);
      if (state.voiceEnabled) {
        urnaSound.speak(
          `Digite os ${currentRole.digits} dígitos para ${currentRole.title} antes de confirmar.`,
          true
        );
      }
      return;
    }

    let recordedVote: RecordedVote;
    if (state.isBranco) {
      recordedVote = {
        role: currentRole.key,
        roleTitle: currentRole.title,
        type: 'BRANCO',
        number: 'BRANCO',
        timestamp: Date.now(),
      };
    } else {
      const cand = findCandidate(currentRole.key, state.digits);
      if (cand) {
        recordedVote = {
          role: currentRole.key,
          roleTitle: currentRole.title,
          type: 'NOMINAL',
          number: cand.number,
          candidateName: cand.name,
          partySigla: cand.partySigla,
          timestamp: Date.now(),
        };
      } else if (isProportional && partyPrefix) {
        recordedVote = {
          role: currentRole.key,
          roleTitle: currentRole.title,
          type: 'LEGENDA',
          number: state.digits,
          candidateName: `VOTO DE LEGENDA (${partyPrefix.sigla})`,
          partySigla: partyPrefix.sigla,
          timestamp: Date.now(),
        };
      } else {
        recordedVote = {
          role: currentRole.key,
          roleTitle: currentRole.title,
          type: 'NULO',
          number: state.digits,
          candidateName: 'VOTO NULO',
          timestamp: Date.now(),
        };
      }
    }

    const updatedVoterVotes = [...state.currentVoterVotes, recordedVote];
    const activeRoles = state.getActiveRoles();
    const isLastRole = state.currentRoleIndex >= activeRoles.length - 1;

    if (!isLastRole) {
      urnaSound.playConfirmIntermediario(state.soundEnabled);
      const nextIndex = state.currentRoleIndex + 1;
      const nextRole = activeRoles[nextIndex];
      set({
        currentRoleIndex: nextIndex,
        digits: '',
        isBranco: false,
        currentVoterVotes: updatedVoterVotes,
      });
      if (state.voiceEnabled && nextRole) {
        setTimeout(() => {
          urnaSound.speak(`Voto confirmado. Agora vote para ${nextRole.title}.`, true);
        }, 280);
      }
    } else {
      set({
        phase: 'SAVING',
        savingProgress: 15,
        currentVoterVotes: updatedVoterVotes,
      });

      const interval = setInterval(() => {
        const cur = get();
        if (cur.phase !== 'SAVING') {
          clearInterval(interval);
          return;
        }
        if (cur.savingProgress < 100) {
          set({ savingProgress: Math.min(100, cur.savingProgress + 35) });
        }
      }, 140);

      setTimeout(() => {
        clearInterval(interval);
        const latestState = get();
        const updatedBoletim: StoredBoletim = {
          totalVoters: latestState.boletim.totalVoters + 1,
          votes: [...latestState.boletim.votes, ...updatedVoterVotes],
          lastResetAt: latestState.boletim.lastResetAt,
        };
        saveBoletim(updatedBoletim);
        urnaSound.playFimEleicao(latestState.soundEnabled);
        if (latestState.voiceEnabled) {
          setTimeout(() => {
            urnaSound.speak('Fim da votação.', true);
          }, 1100);
        }
        set({
          phase: 'FINISHED',
          savingProgress: 100,
          boletim: updatedBoletim,
        });
      }, 520);
    }
  },

  quickTypeNumber: (numStr: string) => {
    const state = get();
    if (state.phase !== 'VOTING') return;

    set({ digits: '', isBranco: false });
    const chars = numStr.split('');
    chars.forEach((ch, idx) => {
      setTimeout(() => {
        const cur = get();
        if (cur.phase === 'VOTING') {
          cur.pressDigit(ch);
        }
      }, idx * 130);
    });
  },

  restartVoter: () => {
    const state = get();
    set({
      currentRoleIndex: 0,
      digits: '',
      isBranco: false,
      phase: 'VOTING',
      savingProgress: 0,
      currentVoterVotes: [],
    });
    if (state.voiceEnabled) {
      const firstRole = state.getActiveRoles()[0];
      urnaSound.speak(`Novo eleitor habilitado. Vote para ${firstRole.title}.`, true);
    }
  },

  resetZeresima: () => {
    const fresh: StoredBoletim = {
      totalVoters: 0,
      votes: [],
      lastResetAt: new Date().toLocaleString('pt-BR'),
    };
    saveBoletim(fresh);
    set({
      boletim: fresh,
      currentRoleIndex: 0,
      digits: '',
      isBranco: false,
      phase: 'VOTING',
      currentVoterVotes: [],
    });
  },

  setFlowMode: (mode: FlowMode) => {
    set({
      flowMode: mode,
      currentRoleIndex: 0,
      digits: '',
      isBranco: false,
      phase: 'VOTING',
      currentVoterVotes: [],
    });
  },

  setCameraPreset: (preset: CameraPreset) => set({ cameraPreset: preset }),
  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
  toggleVoice: () =>
    set((s) => {
      const next = !s.voiceEnabled;
      if (next) {
        const role = s.getCurrentRole();
        urnaSound.speak(`Modo de voz ativado. Vote para ${role.title}.`, true);
      }
      return { voiceEnabled: next };
    }),
  setActiveModal: (modal: ActiveModal) => set({ activeModal: modal }),
  setColinhaOpen: (open: boolean) => set({ colinhaOpen: open }),
}));
