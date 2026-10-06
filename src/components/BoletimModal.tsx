import React, { useState } from 'react';
import {
  FileSpreadsheet,
  RotateCcw,
  Trash2,
  X,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { ROLES_ORDER, RoleKey } from '../data/candidates';
import { useElectionStore } from '../store/useElectionStore';

export const BoletimModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    boletim,
    resetZeresima,
    restartVoter,
  } = useElectionStore();

  const [selectedRole, setSelectedRole] = useState<RoleKey>('presidente');

  if (activeModal !== 'boletim') return null;

  const roleVotes = boletim.votes.filter((v) => v.role === selectedRole);
  const totalRoleVotes = roleVotes.length;

  const tallyMap = new Map<
    string,
    { label: string; number: string; party?: string; count: number; type: string }
  >();

  roleVotes.forEach((v) => {
    const key = `${v.type}-${v.number}`;
    const existing = tallyMap.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      tallyMap.set(key, {
        label:
          v.type === 'BRANCO'
            ? 'VOTO EM BRANCO'
            : v.type === 'NULO'
            ? `VOTO NULO (${v.number})`
            : v.candidateName || v.number,
        number: v.number,
        party: v.partySigla,
        count: 1,
        type: v.type,
      });
    }
  });

  const sortedTally = Array.from(tallyMap.values()).sort((a, b) => b.count - a.count);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#04102b]/80 backdrop-blur-md">
      <div className="bg-[#071d49] border border-yellow-400/35 rounded-2xl max-w-2xl w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Faixa superior Brasil */}
        <div className="w-full h-1.5 bg-gradient-to-r from-[#009c3b] via-[#ffdf00] to-[#002776]" />

        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#009c3b]/25 via-[#071d49] to-[#0a2558] border-b border-blue-400/25 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ffdf00]/20 border border-[#ffdf00]/50 flex items-center justify-center text-[#ffdf00]">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white tracking-wide uppercase">
                Boletim de Urna & Apuração
              </h2>
              <p className="text-xs text-blue-200 font-mono">
                JUSTIÇA ELEITORAL • SEÇÃO 0042 • ZERÉSIMA: {boletim.lastResetAt}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal('none')}
            className="p-2 rounded-lg text-blue-200 hover:text-white hover:bg-blue-800/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Resumo de comparecimento */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-[#0b2761]/70 border border-blue-400/30 rounded-xl p-3.5">
              <div className="flex items-center gap-2 text-blue-200 text-xs mb-1">
                <Users className="w-4 h-4 text-[#ffdf00]" />
                <span>Eleitores que Votaram</span>
              </div>
              <p className="text-2xl font-extrabold text-white font-mono">
                {boletim.totalVoters}
              </p>
            </div>

            <div className="bg-[#0b2761]/70 border border-blue-400/30 rounded-xl p-3.5">
              <div className="flex items-center gap-2 text-blue-200 text-xs mb-1">
                <CheckCircle2 className="w-4 h-4 text-[#4ade80]" />
                <span>Total de Votos Registrados</span>
              </div>
              <p className="text-2xl font-extrabold text-white font-mono">
                {boletim.votes.length}
              </p>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-[#0b2761]/70 border border-blue-400/30 rounded-xl p-3.5 flex flex-col justify-between">
              <span className="text-xs text-blue-200">Status da Urna</span>
              <span className="text-xs font-extrabold text-[#ffdf00] uppercase tracking-wider mt-1">
                {boletim.votes.length === 0
                  ? '● ZERÉSIMA CONFIRMADA (0 VOTOS)'
                  : '● APURAÇÃO EM TEMPO REAL'}
              </span>
            </div>
          </div>

          {/* Seletor de Cargo para Apuração */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#ffdf00] mb-2">
              Selecione o Cargo para Visualizar o Boletim:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {ROLES_ORDER.map((r) => (
                <button
                  key={r.key}
                  onClick={() => setSelectedRole(r.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedRole === r.key
                      ? 'bg-[#ffdf00] text-[#002776] shadow font-extrabold'
                      : 'bg-[#0b2761] text-blue-100 hover:bg-[#103887]'
                  }`}
                >
                  {r.title}
                </button>
              ))}
            </div>
          </div>

          {/* Tabela / Barras de Votos */}
          <div className="bg-[#041230]/85 border border-blue-400/25 rounded-xl p-4 space-y-3">
            {sortedTally.length === 0 ? (
              <div className="text-center py-8 text-blue-200 space-y-2">
                <p className="text-sm font-semibold text-white">
                  Nenhum voto computado para este cargo ainda.
                </p>
                <p className="text-xs">
                  Complete uma votação até a tela <strong>FIM</strong> para ver o Boletim de Urna preenchido!
                </p>
              </div>
            ) : (
              sortedTally.map((item) => {
                const pct =
                  totalRoleVotes > 0
                    ? Math.round((item.count / totalRoleVotes) * 100)
                    : 0;
                return (
                  <div key={`${item.type}-${item.number}`} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold px-2 py-0.5 rounded bg-[#0b2761] text-[#ffdf00] border border-yellow-400/30">
                          {item.number}
                        </span>
                        <span className="font-bold text-white">{item.label}</span>
                        {item.party && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#009c3b] text-white font-bold">
                            {item.party}
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-blue-200">
                        <strong className="text-[#ffdf00]">{item.count}</strong> voto(s) ({pct}%)
                      </div>
                    </div>
                    <div className="w-full h-2.5 bg-[#0b2761] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          item.type === 'NOMINAL'
                            ? 'bg-gradient-to-r from-[#009c3b] to-[#ffdf00]'
                            : item.type === 'LEGENDA'
                            ? 'bg-sky-400'
                            : 'bg-slate-400'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Rodapé */}
        <div className="px-6 py-4 bg-[#051538] border-t border-blue-400/25 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={resetZeresima}
            className="px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-400/40 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Emitir Nova Zerésima (Zerar Votos)
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                restartVoter();
                setActiveModal('none');
              }}
              className="px-4 py-2 rounded-xl bg-[#009c3b] hover:bg-green-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-lg transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Novo Eleitor (Votar Novamente)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
