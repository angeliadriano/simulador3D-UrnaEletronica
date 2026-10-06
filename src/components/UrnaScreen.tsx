import React from 'react';
import { useElectionStore } from '../store/useElectionStore';
import { findCandidate, findPartyByPrefix } from '../data/candidates';

export const UrnaScreen: React.FC = () => {
  const {
    digits,
    isBranco,
    phase,
    savingProgress,
    getCurrentRole,
    currentRoleIndex,
    getActiveRoles,
  } = useElectionStore();

  const currentRole = getCurrentRole();
  const activeRoles = getActiveRoles();
  const isProportional =
    currentRole.key === 'deputado_federal' || currentRole.key === 'deputado_estadual';

  const partyPrefix = findPartyByPrefix(digits);
  const isComplete = digits.length === currentRole.digits;
  const candidate = isComplete ? findCandidate(currentRole.key, digits) : undefined;

  const isLegendaOnly =
    isProportional && digits.length >= 2 && Boolean(partyPrefix) && !candidate;
  const isNulo =
    !isBranco &&
    ((isProportional && digits.length >= 2 && !partyPrefix) ||
      (!isProportional && isComplete && !candidate));

  const showInstructions =
    isBranco || isComplete || (isProportional && digits.length >= 2);

  // Tela GRAVANDO...
  if (phase === 'SAVING') {
    return (
      <div className="w-[520px] h-[360px] bg-[#f4f6f0] text-black font-sans flex flex-col items-center justify-center p-8 border-2 border-neutral-400 select-none relative overflow-hidden shadow-inner">
        <div className="w-full max-w-[360px] flex flex-col items-center gap-3">
          <div className="w-full h-7 border-2 border-black bg-white p-0.5">
            <div
              className="h-full bg-emerald-600 transition-all duration-150"
              style={{ width: `${savingProgress}%` }}
            />
          </div>
          <span className="text-xl font-bold tracking-widest uppercase">
            Gravando...
          </span>
        </div>
      </div>
    );
  }

  // Tela FIM
  if (phase === 'FINISHED') {
    return (
      <div className="w-[520px] h-[360px] bg-[#f4f6f0] text-black font-sans flex flex-col justify-between p-5 border-2 border-neutral-400 select-none relative overflow-hidden shadow-inner">
        <div className="flex items-center justify-between text-xs font-mono text-neutral-600">
          <span>JUSTIÇA ELEITORAL • SIMULADOR 3D</span>
          <span>SEÇÃO 0042 • ZONA 001</span>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <h1 className="text-[118px] leading-none font-extrabold tracking-tight text-black">
            FIM
          </h1>
        </div>

        <div className="flex items-end justify-between">
          <span className="text-[11px] text-neutral-500 font-medium">
            Voto computado no Boletim de Urna
          </span>
          <span className="text-2xl font-bold text-neutral-400 tracking-wider">
            VOTOU
          </span>
        </div>
      </div>
    );
  }

  // Tela de VOTAÇÃO
  return (
    <div className="w-[520px] h-[360px] bg-[#f4f6f0] text-black font-sans flex flex-col justify-between border-2 border-neutral-400 select-none relative overflow-hidden shadow-inner">
      {/* Corpo Superior da Tela */}
      <div className="flex-1 flex justify-between p-4 pb-2 relative">
        {/* Coluna Esquerda: Textos e Caixas de Dígitos */}
        <div className="flex-1 flex flex-col justify-start pr-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[13px] font-semibold tracking-wide text-neutral-800 uppercase">
              SEU VOTO PARA
            </span>
            <span className="text-[10px] font-mono bg-neutral-200 px-1.5 py-0.5 rounded text-neutral-700">
              Etapa {currentRoleIndex + 1}/{activeRoles.length}
            </span>
          </div>

          {/* Título do Cargo */}
          <h2 className="text-[26px] font-extrabold text-black leading-tight mb-3 pl-4">
            {currentRole.title}
          </h2>

          {/* Caso VOTO EM BRANCO */}
          {isBranco ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-[34px] font-extrabold tracking-wide text-black animate-blink text-center">
                VOTO EM BRANCO
              </p>
            </div>
          ) : (
            <>
              {/* Linha dos Quadrados de Número */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[14px] font-semibold w-16">Número:</span>
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: currentRole.digits }).map((_, idx) => {
                    const char = digits[idx] ?? '';
                    const isCursor = idx === digits.length;
                    return (
                      <div
                        key={idx}
                        className="w-9 h-11 border-2 border-black bg-white flex items-center justify-center text-[26px] font-bold leading-none shadow-sm"
                      >
                        {char ? (
                          <span>{char}</span>
                        ) : isCursor ? (
                          <span className="w-4 h-0.5 bg-black animate-blink mt-5" />
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Informações de CandidatoEncontrado */}
              {candidate && (
                <div className="space-y-1.5 text-[14px] leading-snug mt-0.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-semibold text-neutral-800">Nome:</span>
                    <span className="font-extrabold text-[16px] text-black">
                      {candidate.name}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-semibold text-neutral-800">Partido:</span>
                    <span className="font-bold text-black">
                      {candidate.partySigla}
                    </span>
                    <span className="text-[12px] text-neutral-700 truncate">
                      — {candidate.partyName}
                    </span>
                  </div>

                  {candidate.vice && (
                    <div className="flex items-baseline gap-1.5 pt-0.5">
                      <span className="font-semibold text-neutral-800">
                        {candidate.vice.roleLabel}:
                      </span>
                      <span className="font-bold text-[13px] text-black">
                        {candidate.vice.name}
                      </span>
                    </div>
                  )}

                  {candidate.suplente1 && (
                    <div className="text-[12px] leading-tight pt-0.5 space-y-0.5">
                      <div className="font-bold text-black">
                        {candidate.suplente1.name}
                      </div>
                      {candidate.suplente2 && (
                        <div className="font-bold text-black">
                          {candidate.suplente2.name}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Caso Voto de Legenda (Deputado Federal / Estadual) */}
              {!candidate && isLegendaOnly && partyPrefix && (
                <div className="space-y-2 mt-1">
                  <div className="flex items-baseline gap-1.5 text-[14px]">
                    <span className="font-semibold text-neutral-800">Partido:</span>
                    <span className="font-extrabold text-black">
                      {partyPrefix.sigla} — {partyPrefix.name}
                    </span>
                  </div>
                  <div className="pt-2">
                    <p className="text-[22px] font-extrabold tracking-wide text-neutral-800 animate-blink">
                      {isComplete ? 'VOTO DE LEGENDA' : '(VOTO NA LEGENDA)'}
                    </p>
                  </div>
                </div>
              )}

              {/* Caso VOTO NULO */}
              {isNulo && (
                <div className="space-y-2 mt-1">
                  <p className="text-[18px] font-bold text-black">NÚMERO ERRADO</p>
                  <p className="text-[32px] font-extrabold tracking-wide text-black animate-blink pl-6">
                    VOTO NULO
                  </p>
                </div>
              )}

              {/* Dica sutil quando ainda está em branco sem teclas */}
              {digits.length === 0 && !isBranco && (
                <div className="mt-4 text-[12px] text-neutral-600 bg-neutral-200/70 rounded px-2.5 py-2 border border-neutral-300 max-w-[310px]">
                  Digite os <strong>{currentRole.digits} dígitos</strong> no teclado 3D ao lado (ou no teclado do seu PC) ou consulte a <strong>Colinha de Candidatos</strong>.
                </div>
              )}
            </>
          )}
        </div>

        {/* Coluna Direita: Fotos 3x4 do Candidato e Vice/Suplentes */}
        {candidate && !isBranco && (
          <div className="flex flex-col items-end justify-start gap-1.5 ml-2 shrink-0">
            {/* Retrato Principal */}
            <div className="border-2 border-black bg-white flex flex-col items-center shadow-sm">
              <img
                src={candidate.avatarSvg}
                alt={candidate.name}
                className="w-[96px] h-[114px] object-cover"
                draggable={false}
              />
              <span className="w-full text-center text-[10px] font-bold py-0.5 bg-white border-t border-black uppercase">
                {currentRole.title}
              </span>
            </div>

            {/* Retrato do Vice ou Suplentes */}
            {candidate.vice && (
              <div className="border border-black bg-white flex flex-col items-center shadow-sm">
                <img
                  src={candidate.vice.avatarSvg}
                  alt={candidate.vice.name}
                  className="w-[68px] h-[78px] object-cover"
                  draggable={false}
                />
                <span className="w-full text-center text-[8.5px] font-bold py-0.5 bg-white border-t border-black">
                  {candidate.vice.roleLabel}
                </span>
              </div>
            )}

            {candidate.suplente1 && (
              <div className="flex gap-1">
                <div className="border border-black bg-white flex flex-col items-center">
                  <img
                    src={candidate.suplente1.avatarSvg}
                    alt={candidate.suplente1.name}
                    className="w-[50px] h-[58px] object-cover"
                    draggable={false}
                  />
                  <span className="w-full text-center text-[8px] font-bold bg-white border-t border-black">
                    1º Supl.
                  </span>
                </div>
                {candidate.suplente2 && (
                  <div className="border border-black bg-white flex flex-col items-center">
                    <img
                      src={candidate.suplente2.avatarSvg}
                      alt={candidate.suplente2.name}
                      className="w-[50px] h-[58px] object-cover"
                      draggable={false}
                    />
                    <span className="w-full text-center text-[8px] font-bold bg-white border-t border-black">
                      2º Supl.
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rodapé de Instruções Clássico do TSE */}
      <div
        className={`h-[72px] border-t-2 border-black px-4 py-1.5 flex flex-col justify-center text-[12.5px] leading-tight transition-opacity duration-150 ${
          showInstructions ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <span className="font-semibold">Aperte a tecla:</span>
        <span className="font-bold pl-4">
          VERDE para <span className="underline">CONFIRMAR</span> este voto
        </span>
        <span className="font-bold pl-4">
          LARANJA para <span className="underline">REINICIAR</span> este voto
        </span>
      </div>
    </div>
  );
};
