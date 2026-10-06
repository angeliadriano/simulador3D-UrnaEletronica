import React, { useEffect } from 'react';
import { Scene3D } from './components/Scene3D';
import { TopBarHUD } from './components/TopBarHUD';
import { BottomCameraDock } from './components/BottomCameraDock';
import { CandidateColinhaDrawer } from './components/CandidateColinhaDrawer';
import { BoletimModal } from './components/BoletimModal';
import { PortfolioAboutModal } from './components/PortfolioAboutModal';
import { useElectionStore } from './store/useElectionStore';

export const App: React.FC = () => {
  const {
    pressDigit,
    pressBranco,
    pressCorrige,
    pressConfirma,
    activeModal,
    phase,
    restartVoter,
  } = useElectionStore();

  // Sincronia em tempo real com o teclado físico do computador/notebook
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeModal !== 'none') {
        if (e.key === 'Escape') {
          useElectionStore.getState().setActiveModal('none');
        }
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        pressDigit(e.key);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (phase === 'FINISHED') {
          restartVoter();
        } else {
          pressConfirma();
        }
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        pressCorrige();
      } else if (e.key === 'b' || e.key === 'B' || e.key === ' ') {
        e.preventDefault();
        pressBranco();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal, phase, pressDigit, pressBranco, pressCorrige, pressConfirma, restartVoter]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#082052] select-none">
      {/* Barra Superior de Controles e Identidade */}
      <TopBarHUD />

      {/* Palco 3D Interativo (Three.js / React Three Fiber) */}
      <Scene3D />

      {/* Colinha de Candidatos / Santinho Digital Interativo */}
      <CandidateColinhaDrawer />

      {/* Dock Inferior de Câmeras 3D */}
      <BottomCameraDock />

      {/* Modais: Boletim de Urna e Sobre/Compartilhar */}
      <BoletimModal />
      <PortfolioAboutModal />
    </main>
  );
};

export default App;
