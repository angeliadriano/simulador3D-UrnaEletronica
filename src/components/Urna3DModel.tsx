import React, { useMemo, useRef, useState } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Html, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { useElectionStore } from '../store/useElectionStore';
import { UrnaScreen } from './UrnaScreen';

// Mapa autêntico de pontos Braille para os números 0-9 (matriz 2x3: pontos 1 a 6)
const BRAILLE_MAP: Record<string, number[]> = {
  '1': [1],
  '2': [1, 2],
  '3': [1, 4],
  '4': [1, 4, 5],
  '5': [1, 5],
  '6': [1, 2, 4],
  '7': [1, 2, 4, 5],
  '8': [1, 2, 5],
  '9': [2, 4],
  '0': [2, 4, 5],
};

/**
 * Gera textura de alta definição para o topo de cada tecla (0-9, BRANCO, CORRIGE, CONFIRMA)
 */
function createKeyCapTexture(
  label: string,
  variant: 'numeric' | 'branco' | 'corrige' | 'confirma'
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 360;
  const ctx = canvas.getContext('2d')!;

  if (variant === 'numeric') {
    const grad = ctx.createLinearGradient(0, 0, 0, 360);
    grad.addColorStop(0, '#323338');
    grad.addColorStop(0.12, '#232428');
    grad.addColorStop(1, '#18181b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 360);

    ctx.strokeStyle = 'rgba(255,255,255,0.16)';
    ctx.lineWidth = 10;
    ctx.strokeRect(12, 12, 488, 336);

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 225px Inter, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, 155, 190);

    const activeDots = BRAILLE_MAP[label] || [];
    for (let dot = 1; dot <= 6; dot++) {
      const col = dot <= 3 ? 0 : 1;
      const row = (dot - 1) % 3;
      const cx = 335 + col * 68;
      const cy = 105 + row * 72;
      const isRaised = activeDots.includes(dot);

      ctx.beginPath();
      ctx.arc(cx, cy, isRaised ? 14 : 9, 0, Math.PI * 2);
      ctx.fillStyle = isRaised ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.12)';
      ctx.fill();
    }
  } else {
    const bgColors = {
      branco: '#f8fafc',
      corrige: '#f05216',
      confirma: '#44c754',
    };
    ctx.fillStyle = bgColors[variant];
    ctx.fillRect(0, 0, 512, 360);

    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = 12;
    ctx.strokeRect(10, 10, 492, 340);

    ctx.fillStyle = '#09090b';
    ctx.font =
      variant === 'confirma'
        ? '900 72px Inter, Arial, sans-serif'
        : '900 76px Inter, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, 256, variant === 'confirma' ? 115 : 120);

    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 2; row++) {
        const cx = 165 + col * 60;
        const cy = (variant === 'confirma' ? 235 : 225) + row * 48;
        ctx.beginPath();
        ctx.arc(cx, cy, 10, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,0.22)';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx - 2, cy - 2, 8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.fill();
      }
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Cria textura fiel para a placa superior "JUSTIÇA ELEITORAL" com o Brasão da República
 */
function createHeaderStripTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 280;
  const ctx = canvas.getContext('2d')!;

  const bgGrad = ctx.createLinearGradient(0, 0, 1024, 280);
  bgGrad.addColorStop(0, '#e5e7eb');
  bgGrad.addColorStop(0.5, '#d5d8dc');
  bgGrad.addColorStop(1, '#c6cbd1');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 280);

  ctx.strokeStyle = '#9ca3af';
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, 1008, 264);

  ctx.save();
  ctx.translate(185, 140);

  ctx.fillStyle = '#1f2937';
  for (let i = 0; i < 24; i++) {
    ctx.save();
    ctx.rotate((i * Math.PI * 2) / 24);
    ctx.beginPath();
    ctx.moveTo(-6, 0);
    ctx.lineTo(0, -96);
    ctx.lineTo(6, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  ctx.strokeStyle = '#111827';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(0, 4, 78, 0.25 * Math.PI, 0.75 * Math.PI, true);
  ctx.stroke();

  ctx.fillStyle = '#374151';
  ctx.strokeStyle = '#111827';
  ctx.lineWidth = 5;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? 74 : 34;
    const angle = (i * Math.PI) / 5 - Math.PI / 2;
    const x = Math.cos(angle) * r;
    const y = Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#d1d5db';
  ctx.beginPath();
  ctx.arc(0, 0, 32, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#111827';
  ctx.beginPath();
  ctx.arc(0, 0, 22, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  [
    [0, -11],
    [0, 11],
    [-10, -1],
    [10, -1],
    [5, 5],
  ].forEach(([sx, sy]) => {
    ctx.beginPath();
    ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = '#1f2937';
  ctx.fillRect(-62, 66, 124, 18);
  ctx.restore();

  ctx.fillStyle = '#111827';
  ctx.font = '800 84px Inter, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('JUSTIÇA', 635, 102);
  ctx.fillText('ELEITORAL', 635, 192);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Cria textura de alta fidelidade da parte traseira da Urna Eletrônica (Modelo UE2015)
 * reproduzindo os lacres azuis, fendas de ventilação, chave verde/vermelha, código de barras UE2015 e conector de áudio verde
 */
function createRearPanelTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1400;
  canvas.height = 600;
  const ctx = canvas.getContext('2d')!;

  // Gabinete plástico ABS branco-gelo na traseira
  ctx.fillStyle = '#eaede8';
  ctx.fillRect(0, 0, 1400, 600);

  // Linhas de divisão dos módulos plásticos traseiros (fidelidade ao molde injetado)
  ctx.strokeStyle = '#c4c9c2';
  ctx.lineWidth = 4;
  // Divisão do compartimento esquerdo
  ctx.strokeRect(170, 35, 340, 415);
  // Divisão central/direita
  ctx.strokeRect(510, 35, 670, 530);
  // Coluna direita externa
  ctx.strokeRect(1180, 35, 195, 530);

  // =========================================================
  // 1. FILEIRA SUPERIOR DE 7 FENDAS HORIZONTAIS DE VENTILAÇÃO
  // =========================================================
  ctx.fillStyle = '#1f2421';
  for (let i = 0; i < 7; i++) {
    const vx = 555 + i * 82;
    ctx.beginPath();
    ctx.roundRect(vx, 58, 56, 14, 7);
    ctx.fill();
  }

  // =========================================================
  // 2. CAVIDADE SUPERIOR DIREITA (CONECTORES E CHAVE I/0)
  // =========================================================
  // Fundo rebaixado da cavidade
  ctx.fillStyle = '#dce0da';
  ctx.strokeStyle = '#adb5ad';
  ctx.lineWidth = 4;
  ctx.fillRect(555, 96, 520, 165);
  ctx.strokeRect(555, 96, 520, 165);

  // 3 fendas verticais à esquerda da cavidade
  ctx.fillStyle = '#262626';
  for (let i = 0; i < 3; i++) {
    ctx.fillRect(585 + i * 18, 118, 7, 92);
  }

  // Parafusos metálicos laterais
  [
    [535, 155],
    [522, 340],
  ].forEach(([sx, sy]) => {
    ctx.fillStyle = '#9ca3af';
    ctx.beginPath();
    ctx.arc(sx, sy, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  // =========================================================
  // 3. ETIQUETA BRANCA "UE2015" + CÓDIGO DE BARRAS + QR CODE
  // =========================================================
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#d1d5db';
  ctx.lineWidth = 2;
  ctx.fillRect(720, 275, 360, 72);
  ctx.strokeRect(720, 275, 360, 72);

  // Texto "UE2015"
  ctx.fillStyle = '#111827';
  ctx.font = '900 30px Inter, Arial, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('UE2015', 734, 314);

  // Barras do código de barras
  ctx.fillStyle = '#111827';
  for (let b = 0; b < 28; b++) {
    const bw = b % 3 === 0 ? 4 : b % 2 === 0 ? 2 : 1.5;
    ctx.fillRect(865 + b * 4.5, 286, bw, 34);
  }
  ctx.font = '700 12px monospace';
  ctx.fillText('PATRIMÔNIO 51.021.438', 862, 334);

  // Mini QR Code à direita da etiqueta
  ctx.fillStyle = '#111827';
  ctx.fillRect(1022, 285, 46, 46);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(1027, 290, 12, 12);
  ctx.fillRect(1051, 290, 12, 12);
  ctx.fillRect(1027, 314, 12, 12);
  ctx.fillRect(1041, 303, 10, 10);

  // =========================================================
  // 4. FILEIRA CENTRAL DE 7 FENDAS HORIZONTAIS DE VENTILAÇÃO
  // =========================================================
  ctx.fillStyle = '#1f2421';
  for (let i = 0; i < 7; i++) {
    const vx = 555 + i * 82;
    ctx.beginPath();
    ctx.roundRect(vx, 366, 56, 14, 7);
    ctx.fill();
  }

  // =========================================================
  // 5. LACRES AZUIS DO TSE (ESQUERDO VERTICAL, INFERIOR E PORTAS USB)
  // =========================================================
  const drawBlueSeal = (
    x: number,
    y: number,
    w: number,
    h: number,
    vertical = false,
    code = '0410097'
  ) => {
    ctx.save();
    const grad = ctx.createLinearGradient(x, y, x + w, y + h);
    grad.addColorStop(0, '#1d70b8');
    grad.addColorStop(0.5, '#2b88d8');
    grad.addColorStop(1, '#155996');
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, w, h);

    ctx.strokeStyle = '#0c3c69';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    // Detalhes gráficos e rubrica do mesário/técnico sobre o lacre
    ctx.fillStyle = '#092c4c';
    if (vertical) {
      ctx.fillRect(x + 6, y + h - 42, w - 12, 32);
      ctx.save();
      ctx.translate(x + w / 2, y + h / 2 - 20);
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = '#e0f2fe';
      ctx.font = 'bold 13px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('JUSTIÇA ELEITORAL • LACRE OFICIAL', 0, -10);
      // Rubrica simulada
      ctx.strokeStyle = '#1e3a8a';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-70, 8);
      ctx.bezierCurveTo(-40, -12, -10, 22, 30, -6);
      ctx.bezierCurveTo(50, -14, 70, 12, 95, 2);
      ctx.stroke();
      ctx.restore();
    } else {
      ctx.fillStyle = '#092c4c';
      ctx.beginPath();
      ctx.arc(x + 18, y + h / 2, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#e0f2fe';
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(code, x + w - 8, y + 18);

      // Rubrica simulada
      ctx.strokeStyle = '#0f2942';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + 35, y + h - 10);
      ctx.quadraticCurveTo(x + w / 2, y + 8, x + w - 18, y + h - 12);
      ctx.stroke();
    }
    ctx.restore();
  };

  // Lacre azul horizontal inferior esquerdo (tampa inferior)
  drawBlueSeal(215, 492, 235, 52, false, '0410097');

  // Dois lacres azuis menores nas portas USB inferiores direitas
  drawBlueSeal(610, 435, 130, 48, false, '0410098');
  drawBlueSeal(805, 435, 130, 48, false, '0410099');

  // Conector P2 de Áudio Verde redondo entre os dois lacres inferiores
  ctx.fillStyle = '#22c55e';
  ctx.beginPath();
  ctx.arc(768, 512, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#111827';
  ctx.beginPath();
  ctx.arc(768, 512, 7, 0, Math.PI * 2);
  ctx.fill();

  // Fendas na coluna extrema direita
  ctx.fillStyle = '#1f2421';
  ctx.fillRect(1235, 315, 12, 55);
  ctx.fillRect(1215, 395, 35, 12);
  ctx.fillRect(1235, 425, 12, 55);
  ctx.fillRect(1215, 500, 35, 12);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Cria textura para o Lacre Azul Vertical 3D aplicado na lateral do compartimento traseiro
 */
function createVerticalBlueSealTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 128, 512);
  grad.addColorStop(0, '#2b88d8');
  grad.addColorStop(0.5, '#1d70b8');
  grad.addColorStop(1, '#155996');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 512);

  ctx.strokeStyle = '#0c3c69';
  ctx.lineWidth = 6;
  ctx.strokeRect(4, 4, 120, 504);

  // Código de barras inferior no lacre vertical
  ctx.fillStyle = '#092c4c';
  ctx.fillRect(14, 420, 100, 70);

  ctx.save();
  ctx.translate(64, 210);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = '#e0f2fe';
  ctx.font = 'bold 20px Inter, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('LACRE OFICIAL TSE • UE2015', 0, -22);

  // Assinatura / Rubrica no lacre
  ctx.strokeStyle = '#0a2540';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(-140, 15);
  ctx.bezierCurveTo(-80, -35, -20, 45, 40, -15);
  ctx.bezierCurveTo(80, -35, 110, 30, 150, 5);
  ctx.stroke();
  ctx.restore();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

interface KeyButton3DProps {
  id: string;
  label: string;
  position: [number, number, number];
  size: [number, number, number];
  variant: 'numeric' | 'branco' | 'corrige' | 'confirma';
  onPress: () => void;
}

const KeyButton3D: React.FC<KeyButton3DProps> = ({
  id,
  label,
  position,
  size,
  variant,
  onPress,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const pressedKey = useElectionStore((s) => s.pressedKey);
  const pressDepthRef = useRef(0);

  const texture = useMemo(() => createKeyCapTexture(label, variant), [label, variant]);
  const brailleDots = variant === 'numeric' ? BRAILLE_MAP[label] || [] : [];

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const isRecentlyPressed =
      pressedKey?.id === id && Date.now() - pressedKey.timestamp < 180;

    const targetZ = isRecentlyPressed ? -0.075 : hovered ? -0.012 : 0;
    pressDepthRef.current = THREE.MathUtils.lerp(
      pressDepthRef.current,
      targetZ,
      Math.min(1, delta * 28)
    );
    groupRef.current.position.z = position[2] + pressDepthRef.current;
  });

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onPress();
  };

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = 'auto';
  };

  const sideColor =
    variant === 'numeric'
      ? '#141417'
      : variant === 'branco'
      ? '#e2e8f0'
      : variant === 'corrige'
      ? '#c2410c'
      : '#15803d';

  const getBrailleDotOffset = (dotIndex: number): [number, number] => {
    const col = dotIndex <= 3 ? 0 : 1;
    const row = (dotIndex - 1) % 3;
    const x = size[0] * 0.14 + col * (size[0] * 0.13);
    const y = size[1] * 0.21 - row * (size[1] * 0.21);
    return [x, y];
  };

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerDown={handlePointerDown}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <RoundedBox args={size} radius={0.024} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial
          color={hovered ? new THREE.Color(sideColor).offsetHSL(0, 0, 0.08) : sideColor}
          roughness={0.38}
          metalness={0.08}
        />
      </RoundedBox>

      <mesh position={[0, 0, size[2] / 2 + 0.003]}>
        <planeGeometry args={[size[0] * 0.92, size[1] * 0.9]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

      {brailleDots.map((dot) => {
        const [bx, by] = getBrailleDotOffset(dot);
        return (
          <mesh key={dot} position={[bx, by, size[2] / 2 + 0.008]} castShadow>
            <sphereGeometry args={[0.012, 10, 10]} />
            <meshStandardMaterial color="#d4d4d8" roughness={0.3} metalness={0.15} />
          </mesh>
        );
      })}

      {label === '5' && (
        <mesh position={[-size[0] * 0.18, -size[1] * 0.36, size[2] / 2 + 0.009]}>
          <boxGeometry args={[0.12, 0.018, 0.014]} />
          <meshStandardMaterial color="#e4e4e7" />
        </mesh>
      )}
    </group>
  );
};

export const Urna3DModel: React.FC = () => {
  const {
    pressDigit,
    pressBranco,
    pressCorrige,
    pressConfirma,
  } = useElectionStore();

  const frontFaceRef = useRef<THREE.Group>(null);
  const htmlContainerRef = useRef<HTMLDivElement>(null);

  const headerTexture = useMemo(() => createHeaderStripTexture(), []);
  const rearTexture = useMemo(() => createRearPanelTexture(), []);
  const verticalSealTexture = useMemo(() => createVerticalBlueSealTexture(), []);

  const W = 6.9; // Largura total da Urna
  const bodyGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(2.2, -1.6); // Canto frontal inferior
    shape.lineTo(2.2, -1.42); // Pequeno lábio vertical frontal
    shape.lineTo(0.1, 1.42); // Face frontal inclinada
    shape.lineTo(-2.05, 1.18); // Teto superior da urna (recua até a traseira)
    shape.lineTo(-2.05, -1.6); // Parede traseira vertical plana (Z = -2.05)
    shape.lineTo(2.2, -1.6); // Base plana inferior

    const geom = new THREE.ExtrudeGeometry(shape, {
      steps: 1,
      depth: W,
      bevelEnabled: false,
    });

    geom.rotateY(-Math.PI / 2);
    geom.translate(W / 2, 0, 0);
    geom.computeVertexNormals();
    return geom;
  }, [W]);

  const slantAngle = Math.atan2(2.1, 2.84);
  const frontMidY = 0.0;
  const frontMidZ = 1.15;

  // Oculta suavemente o visor HTML caso o usuário gire a Urna para ver a traseira
  const localNormal = useMemo(() => new THREE.Vector3(0, 0, 1), []);
  const worldNormal = useMemo(() => new THREE.Vector3(), []);
  const screenWorldPos = useMemo(() => new THREE.Vector3(), []);
  const camToScreen = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera }) => {
    if (!frontFaceRef.current || !htmlContainerRef.current) return;

    worldNormal
      .copy(localNormal)
      .applyQuaternion(frontFaceRef.current.getWorldQuaternion(new THREE.Quaternion()));
    frontFaceRef.current.getWorldPosition(screenWorldPos);
    camToScreen.subVectors(camera.position, screenWorldPos).normalize();

    const dot = worldNormal.dot(camToScreen);
    const isVisibleFront = dot > 0.06;
    htmlContainerRef.current.style.opacity = isVisibleFront ? '1' : '0';
    htmlContainerRef.current.style.pointerEvents = isVisibleFront ? 'auto' : 'none';
  });

  const keypadCenterX = 1.88;
  const colSpacing = 0.56;
  const numericKeys: Array<{ digit: string; pos: [number, number, number] }> = [
    { digit: '1', pos: [keypadCenterX - colSpacing, 0.34, 0.09] },
    { digit: '2', pos: [keypadCenterX, 0.34, 0.09] },
    { digit: '3', pos: [keypadCenterX + colSpacing, 0.34, 0.09] },
    { digit: '4', pos: [keypadCenterX - colSpacing, -0.08, 0.09] },
    { digit: '5', pos: [keypadCenterX, -0.08, 0.09] },
    { digit: '6', pos: [keypadCenterX + colSpacing, -0.08, 0.09] },
    { digit: '7', pos: [keypadCenterX - colSpacing, -0.5, 0.09] },
    { digit: '8', pos: [keypadCenterX, -0.5, 0.09] },
    { digit: '9', pos: [keypadCenterX + colSpacing, -0.5, 0.09] },
    { digit: '0', pos: [keypadCenterX, -0.92, 0.09] },
  ];

  const bottomGrooveXPositions = [-2.95, -2.15, -1.35, -0.55, 0.25, 1.05, 1.85, 2.65];

  return (
    <group position={[0, -0.15, 0]}>
      {/* ================================================================= */}
      {/* 1. CORPO EM CUNHA TRAPEZOIDAL DA URNA (BRANCO GELO / CINZA CLARO) */}
      {/* ================================================================= */}
      <mesh geometry={bodyGeometry} castShadow receiveShadow>
        <meshStandardMaterial color="#eaece7" roughness={0.38} metalness={0.04} />
      </mesh>

      {/* Abas laterais de acabamento nas bordas esquerda e direita */}
      <RoundedBox
        args={[0.12, 3.52, 0.14]}
        radius={0.03}
        position={[-W / 2 + 0.05, 0.0, 1.15]}
        rotation={[-slantAngle, 0, 0]}
        castShadow
      >
        <meshStandardMaterial color="#f1f3ef" roughness={0.35} />
      </RoundedBox>
      <RoundedBox
        args={[0.12, 3.52, 0.14]}
        radius={0.03}
        position={[W / 2 - 0.05, 0.0, 1.15]}
        rotation={[-slantAngle, 0, 0]}
        castShadow
      >
        <meshStandardMaterial color="#f1f3ef" roughness={0.35} />
      </RoundedBox>

      {/* Lacre azul lateral na fresta esquerda do gabinete (como aparece à esquerda na foto!) */}
      <mesh position={[W / 2 + 0.01, -0.35, -1.1]} rotation={[0.45, Math.PI / 2, 0]}>
        <planeGeometry args={[0.18, 1.25]} />
        <meshBasicMaterial color="#1d70b8" />
      </mesh>

      {/* Os 8 frisos verticais característicos no lábio frontal inferior da Urna */}
      {bottomGrooveXPositions.map((gx, idx) => (
        <mesh key={idx} position={[gx, -1.5, 2.21]}>
          <boxGeometry args={[0.045, 0.2, 0.04]} />
          <meshStandardMaterial color="#9ca3af" roughness={0.6} />
        </mesh>
      ))}

      {/* Pés de borracha inferiores nos cantos */}
      {[
        [-3.0, -1.66, 1.7],
        [3.0, -1.66, 1.7],
        [-3.0, -1.66, -1.85],
        [3.0, -1.66, -1.85],
      ].map(([fx, fy, fz], idx) => (
        <RoundedBox
          key={idx}
          args={[0.45, 0.12, 0.45]}
          radius={0.02}
          position={[fx, fy, fz]}
          receiveShadow
        >
          <meshStandardMaterial color="#1f2937" roughness={0.85} />
        </RoundedBox>
      ))}

      {/* ================================================================= */}
      {/* 2. PLANO FRONTAL INCLINADO (TELA LCD + BRASÃO + TECLADO FÍSICO)   */}
      {/* ================================================================= */}
      <group
        ref={frontFaceRef}
        position={[0, frontMidY, frontMidZ]}
        rotation={[-slantAngle, 0, 0]}
      >
        <RoundedBox
          args={[W - 0.04, 3.5, 0.04]}
          radius={0.02}
          position={[0, 0, 0]}
          receiveShadow
        >
          <meshStandardMaterial color="#eef0ec" roughness={0.36} metalness={0.03} />
        </RoundedBox>

        {/* Moldura chanfrada interna do visor */}
        <RoundedBox
          args={[3.72, 2.66, 0.035]}
          radius={0.02}
          position={[-1.22, 0.04, 0.015]}
        >
          <meshStandardMaterial color="#cfd3ce" roughness={0.45} />
        </RoundedBox>

        {/* Fundo do visor LCD */}
        <mesh position={[-1.22, 0.04, 0.036]}>
          <planeGeometry args={[3.56, 2.48]} />
          <meshBasicMaterial color="#f4f6f0" />
        </mesh>

        {/* Tela LCD HTML acoplada ao plano inclinado da Urna */}
        <Html
          transform
          distanceFactor={2.74}
          position={[-1.22, 0.04, 0.042]}
          zIndexRange={[10, 0]}
        >
          <div
            ref={htmlContainerRef}
            className="transition-opacity duration-150 pointer-events-none"
          >
            <UrnaScreen />
          </div>
        </Html>

        {/* Placa superior "JUSTIÇA ELEITORAL" com Brasão */}
        <RoundedBox
          args={[2.22, 0.62, 0.035]}
          radius={0.015}
          position={[keypadCenterX, 1.08, 0.018]}
        >
          <meshStandardMaterial color="#d1d5db" roughness={0.35} />
        </RoundedBox>

        <mesh position={[keypadCenterX, 1.08, 0.038]}>
          <planeGeometry args={[2.16, 0.57]} />
          <meshBasicMaterial map={headerTexture} toneMapped={false} />
        </mesh>

        {/* Painel grafite escuro do teclado */}
        <RoundedBox
          args={[2.22, 2.28, 0.04]}
          radius={0.02}
          position={[keypadCenterX, -0.42, 0.02]}
          receiveShadow
        >
          <meshStandardMaterial color="#2b2c30" roughness={0.72} metalness={0.08} />
        </RoundedBox>

        {/* Teclas numéricas 3D (1 a 9 + 0) */}
        {numericKeys.map(({ digit, pos }) => (
          <KeyButton3D
            key={digit}
            id={digit}
            label={digit}
            position={pos}
            size={[0.46, 0.32, 0.14]}
            variant="numeric"
            onPress={() => pressDigit(digit)}
          />
        ))}

        {/* Teclas de Ação (BRANCO, CORRIGE, CONFIRMA) */}
        <KeyButton3D
          id="BRANCO"
          label="BRANCO"
          position={[keypadCenterX - 0.66, -1.32, 0.09]}
          size={[0.58, 0.34, 0.14]}
          variant="branco"
          onPress={pressBranco}
        />

        <KeyButton3D
          id="CORRIGE"
          label="CORRIGE"
          position={[keypadCenterX, -1.32, 0.09]}
          size={[0.58, 0.34, 0.14]}
          variant="corrige"
          onPress={pressCorrige}
        />

        <KeyButton3D
          id="CONFIRMA"
          label="CONFIRMA"
          position={[keypadCenterX + 0.66, -1.26, 0.1]}
          size={[0.58, 0.46, 0.15]}
          variant="confirma"
          onPress={pressConfirma}
        />
      </group>

      {/* ================================================================= */}
      {/* 3. PARTE TRASEIRA REALISTA (MODELO UE2015 COM LACRES AZUIS TSE)   */}
      {/* ================================================================= */}
      <group position={[0, -0.21, -2.055]} rotation={[0, Math.PI, 0]}>
        {/* Textura base de alta resolução do painel traseiro */}
        <mesh position={[0, 0, 0.005]}>
          <planeGeometry args={[W - 0.06, 2.74]} />
          <meshStandardMaterial map={rearTexture} roughness={0.42} metalness={0.04} />
        </mesh>

        {/* Módulo 3D Sobressalente Esquerdo (Compartimento da Bobina / Mídia com tampa) */}
        <RoundedBox
          args={[1.55, 1.82, 0.28]}
          radius={0.04}
          smoothness={4}
          position={[-1.42, 0.16, 0.14]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#eceee9" roughness={0.38} />
        </RoundedBox>

        {/* Aba horizontal / puxador da tampa do compartimento esquerdo */}
        <RoundedBox
          args={[1.38, 0.08, 0.31]}
          radius={0.02}
          position={[-1.42, -0.18, 0.15]}
          castShadow
        >
          <meshStandardMaterial color="#d4d8d2" roughness={0.45} />
        </RoundedBox>

        {/* Lacre Azul Vertical Oficial do TSE colado na fresta esquerda do compartimento */}
        <RoundedBox
          args={[0.26, 1.68, 0.3]}
          radius={0.02}
          position={[-2.18, 0.08, 0.155]}
          castShadow
        >
          <meshBasicMaterial map={verticalSealTexture} toneMapped={false} />
        </RoundedBox>

        {/* Moldura plástica transparente sobre o lacre azul inferior esquerdo */}
        <RoundedBox
          args={[1.18, 0.28, 0.06]}
          radius={0.015}
          position={[-1.36, -1.02, 0.03]}
        >
          <meshStandardMaterial
            color="#38bdf8"
            transparent
            opacity={0.28}
            roughness={0.2}
          />
        </RoundedBox>

        {/* Chave Liga/Desliga 3D (Botão Gangorra Verde "I" e Vermelho/Laranja "0") */}
        <group position={[1.46, 0.56, 0.03]}>
          {/* Moldura preta da chave */}
          <RoundedBox args={[0.3, 0.44, 0.06]} radius={0.015}>
            <meshStandardMaterial color="#1f2937" roughness={0.6} />
          </RoundedBox>
          {/* Metade Superior Verde (I - Ligado) */}
          <RoundedBox
            args={[0.22, 0.18, 0.08]}
            radius={0.01}
            position={[0, 0.09, 0.02]}
            rotation={[-0.18, 0, 0]}
          >
            <meshStandardMaterial color="#16a34a" roughness={0.35} />
          </RoundedBox>
          {/* Metade Inferior Laranja-Avermelhada (0 - Desligado) */}
          <RoundedBox
            args={[0.22, 0.18, 0.08]}
            radius={0.01}
            position={[0, -0.09, 0.008]}
            rotation={[0.12, 0, 0]}
          >
            <meshStandardMaterial color="#ea580c" roughness={0.35} />
          </RoundedBox>
        </group>

        {/* Conector e Cabo de Energia Preto saindo da cavidade traseira (igual à foto) */}
        <group position={[0.28, 0.68, 0.04]}>
          <RoundedBox args={[0.24, 0.2, 0.14]} radius={0.02} castShadow>
            <meshStandardMaterial color="#18181b" roughness={0.5} />
          </RoundedBox>
          {/* Cabo curvando para a direita/baixo */}
          <mesh position={[0.75, -0.34, 0.12]} rotation={[0, 0, -1.18]} castShadow>
            <cylinderGeometry args={[0.042, 0.042, 1.75, 12]} />
            <meshStandardMaterial color="#18181b" roughness={0.6} />
          </mesh>
        </group>

        {/* Coluna vertical saliente na extrema direita com cabo secundário */}
        <RoundedBox
          args={[0.85, 2.68, 0.14]}
          radius={0.03}
          position={[2.95, 0.0, 0.07]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#e5e8e2" roughness={0.4} />
        </RoundedBox>
        {/* Segundo cabo preto saindo do orifício superior direito */}
        <mesh position={[2.75, 0.85, 0.16]} rotation={[0.35, 0, 0]}>
          <sphereGeometry args={[0.075, 12, 12]} />
          <meshStandardMaterial color="#18181b" />
        </mesh>
        <mesh position={[2.92, -0.05, 0.22]} rotation={[0, 0, -0.18]} castShadow>
          <cylinderGeometry args={[0.048, 0.048, 1.9, 12]} />
          <meshStandardMaterial color="#18181b" roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
};
