import React from 'react';
import {
  Code2,
  Cpu,
  ExternalLink,
  Keyboard,
  ShieldAlert,
  Sparkles,
  X,
} from 'lucide-react';
import { PORTFOLIO_CONFIG } from '../config/portfolio';
import { useElectionStore } from '../store/useElectionStore';

export const PortfolioAboutModal: React.FC = () => {
  const { activeModal, setActiveModal } = useElectionStore();

  if (activeModal !== 'about') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#04102b]/80 backdrop-blur-md">
      <div className="bg-[#071d49] border border-yellow-400/35 rounded-2xl max-w-xl w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Faixa superior Brasil */}
        <div className="w-full h-1.5 bg-gradient-to-r from-[#009c3b] via-[#ffdf00] to-[#002776]" />

        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#009c3b]/25 via-[#071d49] to-[#0a2558] border-b border-blue-400/25 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#009c3b]/30 border border-[#ffdf00]/50 flex items-center justify-center text-[#ffdf00]">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">
                {PORTFOLIO_CONFIG.projectTitle}
              </h2>
            </div>
          </div>
          <button
            onClick={() => setActiveModal('none')}
            className="p-2 rounded-lg text-blue-200 hover:text-white hover:bg-blue-800/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-sm text-blue-100">
          {/* Nota Legal / Disclaimer Educativo */}
          <div className="bg-[#030d22]/90 border border-amber-400/30 rounded-xl p-3 flex items-start gap-2.5 text-[11px] leading-relaxed text-blue-200">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              <strong className="text-amber-300">Nota Legal & Educativa:</strong> Este projeto é uma simulação 3D independente desenvolvida exclusivamente para fins educacionais, artísticos e de demonstração tecnológica (WebGL/React). Não possui filiação, patrocínio ou vínculo com o Tribunal Superior Eleitoral (TSE) ou com a Justiça Eleitoral brasileira.
            </p>
          </div>

          {/* Destaques de Engenharia */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#ffdf00] mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#ffdf00]" />
              Destaques de Engenharia & Arquitetura 3D
            </h3>
            <ul className="space-y-2 bg-[#041230]/80 border border-blue-400/25 rounded-xl p-3.5">
              {PORTFOLIO_CONFIG.techHighlights.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#009c3b] ring-2 ring-[#ffdf00]/50 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Atalhos do Teclado Físico */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#ffdf00] mb-2.5 flex items-center gap-1.5">
              <Keyboard className="w-4 h-4 text-[#4ade80]" />
              Sincronia com Teclado Físico (PC / Notebook)
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#0b2761]/70 border border-blue-400/25 rounded-lg p-2.5 flex items-center justify-between">
                <span className="text-blue-100">Teclas Numéricas</span>
                <kbd className="px-2 py-0.5 bg-[#041230] rounded border border-[#009c3b]/60 font-mono text-[#ffdf00] font-bold">
                  0 - 9
                </kbd>
              </div>
              <div className="bg-[#0b2761]/70 border border-blue-400/25 rounded-lg p-2.5 flex items-center justify-between">
                <span className="text-blue-100">Confirmar Voto</span>
                <kbd className="px-2 py-0.5 bg-[#041230] rounded border border-[#009c3b]/60 font-mono text-[#4ade80] font-bold">
                  Enter
                </kbd>
              </div>
              <div className="bg-[#0b2761]/70 border border-blue-400/25 rounded-lg p-2.5 flex items-center justify-between">
                <span className="text-blue-100">Corrigir Voto</span>
                <kbd className="px-2 py-0.5 bg-[#041230] rounded border border-orange-400/50 font-mono text-orange-400 font-bold">
                  Backspace
                </kbd>
              </div>
              <div className="bg-[#0b2761]/70 border border-blue-400/25 rounded-lg p-2.5 flex items-center justify-between">
                <span className="text-blue-100">Voto em Branco</span>
                <kbd className="px-2 py-0.5 bg-[#041230] rounded border border-blue-300/40 font-mono text-white font-bold">
                  B / Espaço
                </kbd>
              </div>
            </div>
          </div>
        </div>

        {/* Footer com Links do Autor */}
        <div className="px-6 py-4 bg-[#051538] border-t border-blue-400/25 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-extrabold text-[#ffdf00]">
              {PORTFOLIO_CONFIG.authorName}
            </p>
            <p className="text-[11px] text-blue-200 font-medium">
              {PORTFOLIO_CONFIG.authorRole}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={PORTFOLIO_CONFIG.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-[#009c3b] hover:bg-green-600 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-colors"
            >
              <span>LinkedIn</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href={PORTFOLIO_CONFIG.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-[#ffdf00] hover:bg-yellow-300 text-[#002776] text-xs font-extrabold flex items-center gap-1.5 shadow transition-colors"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
