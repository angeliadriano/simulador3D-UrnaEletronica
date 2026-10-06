import React from 'react';
import {
  FileSpreadsheet,
  Info,
  Speech,
  Volume2,
  VolumeX,
  Vote,
} from 'lucide-react';
import { useElectionStore } from '../store/useElectionStore';
import { PORTFOLIO_CONFIG } from '../config/portfolio';

export const TopBarHUD: React.FC = () => {
  const {
    flowMode,
    setFlowMode,
    soundEnabled,
    toggleSound,
    voiceEnabled,
    toggleVoice,
    setActiveModal,
    boletim,
  } = useElectionStore();

  return (
    <header className="fixed top-0 left-0 right-0 z-20 pointer-events-none">
      {/* Faixa superior fina com as cores do Brasil (Verde, Amarelo e Azul) */}
      <div className="w-full h-1 bg-gradient-to-r from-[#009c3b] via-[#ffdf00] to-[#002776]" />

      <div className="p-2.5 md:px-5 md:py-3 flex flex-wrap items-center justify-between gap-2">
        {/* Bloco Esquerdo: Identidade do Projeto + Seletor de Fluxo */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setActiveModal('about')}
            className="group flex items-center gap-2.5 bg-[#071d49]/90 hover:bg-[#0b2b6b]/95 backdrop-blur-xl border border-yellow-400/35 rounded-xl px-3.5 py-2 shadow-lg transition-all"
            title="Sobre o Projeto"
          >
            <div className="w-8 h-8 rounded-lg bg-[#009c3b]/25 border border-[#ffdf00]/50 flex items-center justify-center text-[#ffdf00] group-hover:scale-105 transition-transform">
              <Vote className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <h1 className="text-xs md:text-sm font-extrabold text-white tracking-tight">
                  Urna Eletrônica 3D
                </h1>
              </div>
              <p className="text-[10px] text-blue-200 hidden sm:block">
                por <span className="text-[#ffdf00] font-bold">{PORTFOLIO_CONFIG.authorName}</span>
              </p>
            </div>
          </button>

          {/* Alternador Fluxo Completo (5 cargos) vs Rápido (Só Presidente) */}
          <div className="bg-[#071d49]/90 backdrop-blur-xl border border-blue-400/30 rounded-xl p-1 flex items-center shadow-lg">
            <button
              onClick={() => setFlowMode('completo')}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                flowMode === 'completo'
                  ? 'bg-[#009c3b] text-white shadow ring-1 ring-[#ffdf00]/50'
                  : 'text-blue-100 hover:text-[#ffdf00]'
              }`}
            >
              5 Cargos
            </button>
            <button
              onClick={() => setFlowMode('rapido')}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                flowMode === 'rapido'
                  ? 'bg-[#009c3b] text-white shadow ring-1 ring-[#ffdf00]/50'
                  : 'text-blue-100 hover:text-[#ffdf00]'
              }`}
            >
              Só Presidente
            </button>
          </div>
        </div>

        {/* Bloco Direito: Ferramentas de Áudio, Voz, Boletim e Projeto */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Botão de Som Original da Urna */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Som da Urna Ativado' : 'Som da Urna Silenciado'}
            className={`p-2 md:px-3 md:py-2 rounded-xl backdrop-blur-xl border text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all ${
              soundEnabled
                ? 'bg-[#071d49]/90 border-[#009c3b]/60 text-[#4ade80] hover:bg-[#0b2b6b]'
                : 'bg-[#071d49]/60 border-blue-900 text-blue-300/50 hover:text-blue-200'
            }`}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
            <span className="hidden lg:inline">Som</span>
          </button>

          {/* Botão de Acessibilidade por Voz (Web Speech API) */}
          <button
            onClick={toggleVoice}
            title="Acessibilidade: Voz Sintetizada em Português"
            className={`p-2 md:px-3 md:py-2 rounded-xl backdrop-blur-xl border text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all ${
              voiceEnabled
                ? 'bg-[#009c3b] border-[#ffdf00]/60 text-white'
                : 'bg-[#071d49]/90 border-blue-400/30 text-blue-100 hover:bg-[#0b2b6b]'
            }`}
          >
            <Speech className="w-4 h-4" />
            <span className="hidden lg:inline">Voz</span>
          </button>

          {/* Boletim de Urna / Apuração */}
          <button
            onClick={() => setActiveModal('boletim')}
            className="px-3 py-2 rounded-xl bg-[#ffdf00] hover:bg-yellow-300 text-[#002776] border border-yellow-200 text-xs font-extrabold flex items-center gap-1.5 shadow-lg transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span className="hidden sm:inline">Boletim</span>
            {boletim.totalVoters > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#009c3b] text-white text-[10px] font-mono font-extrabold">
                {boletim.totalVoters}
              </span>
            )}
          </button>

          {/* Sobre o Projeto */}
          <button
            onClick={() => setActiveModal('about')}
            title="Detalhes Técnicos do Projeto"
            className="p-2 md:px-3 md:py-2 rounded-xl bg-[#009c3b] hover:bg-green-600 border border-[#ffdf00]/40 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-lg transition-all"
          >
            <Info className="w-4 h-4 text-[#ffdf00]" />
            <span className="hidden xl:inline">Projeto</span>
          </button>
        </div>
      </div>
    </header>
  );
};
