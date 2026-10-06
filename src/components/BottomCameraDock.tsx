import React from 'react';
import {
  Camera,
  Eye,
  FileSpreadsheet,
  Grid,
  Orbit,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import { CameraPreset, useElectionStore } from '../store/useElectionStore';

export const BottomCameraDock: React.FC = () => {
  const {
    cameraPreset,
    setCameraPreset,
    phase,
    restartVoter,
    setActiveModal,
  } = useElectionStore();

  const presets: Array<{
    id: CameraPreset;
    label: string;
    shortLabel: string;
    icon: React.ReactNode;
  }> = [
    {
      id: 'voting',
      label: 'Visão Votação',
      shortLabel: 'Votar',
      icon: <Camera className="w-3.5 h-3.5" />,
    },
    {
      id: 'screen',
      label: 'Foco no Visor',
      shortLabel: 'Visor',
      icon: <Eye className="w-3.5 h-3.5" />,
    },
    {
      id: 'keypad',
      label: 'Foco no Teclado',
      shortLabel: 'Teclado',
      icon: <Grid className="w-3.5 h-3.5" />,
    },
    {
      id: 'free360',
      label: 'Giro 360°',
      shortLabel: '360°',
      icon: <Orbit className="w-3.5 h-3.5" />,
    },
    {
      id: 'back',
      label: 'Lacre Traseiro',
      shortLabel: 'Traseira',
      icon: <ShieldCheck className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <div className="fixed bottom-3 left-0 right-0 z-20 flex flex-col items-center gap-2.5 px-3 pointer-events-none">
      {/* Banner flutuante quando o eleitor finaliza o voto (FIM) */}
      {phase === 'FINISHED' && (
        <div className="pointer-events-auto bg-[#071d49]/95 backdrop-blur-xl border-2 border-[#ffdf00] rounded-2xl px-4 py-2.5 shadow-2xl flex flex-wrap items-center justify-center gap-3 animate-bounce">
          <span className="text-xs font-extrabold text-[#ffdf00] uppercase tracking-wide">
            ✓ Voto Computado com Sucesso!
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={restartVoter}
              className="px-3 py-1.5 rounded-xl bg-[#009c3b] hover:bg-green-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Novo Eleitor
            </button>
            <button
              onClick={() => setActiveModal('boletim')}
              className="px-3 py-1.5 rounded-xl bg-[#ffdf00] hover:bg-yellow-300 text-[#002776] font-extrabold text-xs flex items-center gap-1.5 transition-all"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Ver Apuração
            </button>
          </div>
        </div>
      )}

      {/* Dock de Ângulos de Câmera 3D com visual Brasil */}
      <div className="pointer-events-auto bg-[#071d49]/90 backdrop-blur-xl border border-yellow-400/35 rounded-2xl p-1.5 shadow-2xl flex items-center gap-1 max-w-full overflow-x-auto">
        {presets.map((p) => {
          const active = cameraPreset === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setCameraPreset(p.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                active
                  ? 'bg-[#009c3b] text-white shadow-md ring-1 ring-[#ffdf00]/60'
                  : 'text-blue-100 hover:text-[#ffdf00] hover:bg-[#0b2b6b]/70'
              }`}
            >
              <span className={active ? 'text-[#ffdf00]' : ''}>{p.icon}</span>
              <span className="hidden sm:inline">{p.label}</span>
              <span className="sm:hidden">{p.shortLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
