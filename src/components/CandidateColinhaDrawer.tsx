import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import {
  ROLES_ORDER,
  RoleKey,
  getCandidatesByRole,
  PARTIES,
} from '../data/candidates';
import { useElectionStore } from '../store/useElectionStore';

export const CandidateColinhaDrawer: React.FC = () => {
  const {
    colinhaOpen,
    setColinhaOpen,
    getCurrentRole,
    quickTypeNumber,
    phase,
    pressConfirma,
    pressCorrige,
    pressBranco,
    restartVoter,
  } = useElectionStore();

  const currentRole = getCurrentRole();
  const [selectedTab, setSelectedTab] = useState<RoleKey>(currentRole.key);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setColinhaOpen(false);
    }
  }, [setColinhaOpen]);

  useEffect(() => {
    setSelectedTab(currentRole.key);
  }, [currentRole.key]);

  const candidates = getCandidatesByRole(selectedTab);
  const isCurrentVotingRole = selectedTab === currentRole.key && phase === 'VOTING';

  return (
    <div className="fixed z-20 right-3 bottom-16 md:bottom-auto md:top-16 md:right-4 w-[calc(100vw-1.5rem)] sm:w-[320px] pointer-events-auto">
      <div className="bg-[#071d49]/92 backdrop-blur-xl border border-yellow-400/35 rounded-2xl shadow-2xl overflow-hidden transition-all duration-200">
        {/* Cabeçalho da Colinha com identidade Brasil */}
        <button
          onClick={() => setColinhaOpen(!colinhaOpen)}
          className="w-full px-3.5 py-2.5 flex items-center justify-between bg-gradient-to-r from-[#009c3b]/35 via-[#0a2558] to-[#071d49] hover:from-[#009c3b]/45 transition-colors border-b border-yellow-400/20"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#009c3b]/30 border border-[#ffdf00]/50 flex items-center justify-center text-[#ffdf00]">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#ffdf00]">
                  Colinha de Candidatos
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#009c3b] text-white font-bold">
                  {currentRole.digits} díg.
                </span>
              </div>
              <p className="text-[11px] text-blue-100 font-medium">
                Cargo: <strong className="text-white">{currentRole.title}</strong>
              </p>
            </div>
          </div>
          <div className="text-[#ffdf00] hover:text-white p-1">
            {colinhaOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </div>
        </button>

        {/* Conteúdo Retrátil */}
        {colinhaOpen && (
          <div className="p-2.5 space-y-2.5 max-h-[48vh] md:max-h-[66vh] overflow-y-auto">
            {/* Seletor de Abas por Cargo */}
            <div className="flex gap-1 overflow-x-auto pb-1">
              {ROLES_ORDER.map((role) => {
                const active = selectedTab === role.key;
                const isVotingNow = currentRole.key === role.key && phase === 'VOTING';
                return (
                  <button
                    key={role.key}
                    onClick={() => setSelectedTab(role.key)}
                    className={`px-2 py-1 rounded-lg text-[10.5px] font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                      active
                        ? 'bg-[#ffdf00] text-[#002776] shadow-sm font-extrabold'
                        : 'bg-[#0b2b6b]/80 text-blue-100 hover:bg-[#103887]'
                    }`}
                  >
                    {isVotingNow && (
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          active ? 'bg-[#009c3b]' : 'bg-[#ffdf00] animate-pulse'
                        }`}
                      />
                    )}
                    {role.title}
                  </button>
                );
              })}
            </div>

            {/* Lista de Candidatos do Cargo Selecionado */}
            <div className="space-y-1.5">
              {candidates.map((cand) => {
                const party = PARTIES[cand.partyNumber];
                return (
                  <div
                    key={`${cand.role}-${cand.number}`}
                    onClick={() => {
                      if (isCurrentVotingRole) {
                        quickTypeNumber(cand.number);
                      }
                    }}
                    className={`group flex items-center justify-between p-2 rounded-xl border transition-all ${
                      isCurrentVotingRole
                        ? 'bg-[#0b2761]/70 hover:bg-[#0f3178] border-blue-400/30 hover:border-[#ffdf00]/70 cursor-pointer'
                        : 'bg-[#051538]/50 border-blue-900/40 opacity-80'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={cand.avatarSvg}
                        alt={cand.name}
                        className="w-9 h-11 rounded-lg object-cover border border-yellow-400/40 shrink-0 bg-blue-950"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-extrabold px-1.5 py-0.5 rounded bg-[#04102b] text-[#ffdf00] border border-[#ffdf00]/40">
                            {cand.number}
                          </span>
                          <span
                            className="text-[9.5px] font-bold px-1.5 py-0.5 rounded text-white"
                            style={{ backgroundColor: party?.color || '#009c3b' }}
                          >
                            {cand.partySigla}
                          </span>
                        </div>
                        <p className="text-[11px] font-bold text-white truncate mt-0.5">
                          {cand.name}
                        </p>
                      </div>
                    </div>

                    {isCurrentVotingRole && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          quickTypeNumber(cand.number);
                        }}
                        title="Digitar automaticamente na Urna 3D"
                        className="ml-1.5 shrink-0 px-2.5 py-1.5 rounded-lg bg-[#009c3b] hover:bg-[#ffdf00] text-white hover:text-[#002776] border border-[#ffdf00]/40 text-[10.5px] font-extrabold flex items-center gap-1 transition-all shadow"
                      >
                        <Zap className="w-3 h-3" />
                        <span>Votar</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Ações Rápidas de Apoio */}
            {phase === 'VOTING' ? (
              <div className="pt-1.5 border-t border-blue-400/20">
                <div className="flex items-center justify-between text-[10px] text-blue-200 mb-1.5 px-0.5">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#ffdf00]" />
                    Clique nas teclas 3D da Urna ou abaixo:
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={pressBranco}
                    className="py-1.5 px-2 rounded-lg bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-[10.5px] shadow transition-transform active:scale-95"
                  >
                    BRANCO
                  </button>
                  <button
                    onClick={pressCorrige}
                    className="py-1.5 px-2 rounded-lg bg-orange-500 hover:bg-orange-400 text-slate-950 font-extrabold text-[10.5px] shadow transition-transform active:scale-95"
                  >
                    CORRIGE
                  </button>
                  <button
                    onClick={pressConfirma}
                    className="py-1.5 px-2 rounded-lg bg-[#009c3b] hover:bg-green-500 text-white font-extrabold text-[10.5px] shadow flex items-center justify-center gap-1 transition-transform active:scale-95"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    CONFIRMA
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-2 border-t border-blue-400/20">
                <button
                  onClick={restartVoter}
                  className="w-full py-2 px-3 rounded-xl bg-[#ffdf00] hover:bg-yellow-300 text-[#002776] font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Votar Novamente (Novo Eleitor)
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
