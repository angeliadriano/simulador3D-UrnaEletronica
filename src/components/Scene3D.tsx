import React, { useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, OrbitControls, RoundedBox } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { CameraPreset, useElectionStore } from '../store/useElectionStore';
import { Urna3DModel } from './Urna3DModel';

interface CameraRigProps {
  controlsRef: React.RefObject<OrbitControlsImpl>;
}

const CameraRig: React.FC<CameraRigProps> = ({ controlsRef }) => {
  const { size, camera } = useThree();
  const cameraPreset = useElectionStore((s) => s.cameraPreset);
  const colinhaOpen = useElectionStore((s) => s.colinhaOpen);

  const isTransitioningRef = useRef(false);
  const transitionStartRef = useRef(0);
  const desiredPosRef = useRef(new THREE.Vector3(-0.65, 2.2, 5.5));
  const desiredTargetRef = useRef(new THREE.Vector3(0.15, -0.25, 0.8));

  const computePresetVectors = (
    preset: CameraPreset,
    width: number,
    height: number,
    isDrawerOpen: boolean
  ) => {
    const aspect = width / Math.max(1, height);
    const isPortrait = aspect < 0.85;
    const isDesktopWithDrawer = width >= 1024 && isDrawerOpen;

    // A Urna tem 6.9 unidades de largura (de -3.45 a +3.45).
    // Para caber inteira no celular com margens confortáveis no enquadramento vertical:
    // Com FOV vertical de 40°, a largura visível é 2 * dist * tan(20°) * aspect ≈ 0.728 * dist * aspect.
    // Para uma largura visual segura de ~8.4 unidades: dist = 8.4 / (0.728 * aspect) ≈ 11.54 / aspect.
    const safeAspect = Math.max(0.35, aspect);
    const mobileVotingDist = isPortrait ? Math.max(14, 8.4 / (0.728 * safeAspect)) : 5.35;
    const mobileScreenDist = isPortrait ? Math.max(7, 4.6 / (0.728 * safeAspect)) : 3.6;
    const mobileKeypadDist = isPortrait ? Math.max(6.5, 4.2 / (0.728 * safeAspect)) : 3.35;

    switch (preset) {
      case 'screen':
        return {
          pos: new THREE.Vector3(
            -1.22,
            isPortrait ? 1.35 : 1.75,
            mobileScreenDist
          ),
          target: new THREE.Vector3(-1.22, -0.1, 1.15),
        };
      case 'keypad':
        return {
          pos: new THREE.Vector3(
            1.88,
            isPortrait ? 1.15 : 1.45,
            mobileKeypadDist
          ),
          target: new THREE.Vector3(1.88, -0.45, 1.25),
        };
      case 'back':
        return {
          pos: new THREE.Vector3(
            0,
            0.65,
            isPortrait ? -mobileVotingDist * 0.95 : -5.6
          ),
          target: new THREE.Vector3(0, -0.15, -1.5),
        };
      case 'free360':
        return {
          pos: new THREE.Vector3(
            isPortrait ? -mobileVotingDist * 0.55 : -3.8,
            isPortrait ? mobileVotingDist * 0.22 : 2.4,
            isPortrait ? mobileVotingDist * 0.82 : 5.2
          ),
          target: new THREE.Vector3(0, -0.2, 0.2),
        };
      case 'voting':
      default:
        return {
          pos: new THREE.Vector3(
            isPortrait ? 0 : isDesktopWithDrawer ? -0.2 : -0.65,
            isPortrait ? Math.min(5.5, mobileVotingDist * 0.2) : 2.15,
            isPortrait ? mobileVotingDist : isDesktopWithDrawer ? 5.75 : 5.35
          ),
          target: new THREE.Vector3(
            isPortrait ? 0 : isDesktopWithDrawer ? 0.85 : 0.15,
            isPortrait ? -0.32 : -0.22,
            0.75
          ),
        };
    }
  };

  useEffect(() => {
    const { pos, target } = computePresetVectors(
      cameraPreset,
      size.width,
      size.height,
      colinhaOpen
    );
    desiredPosRef.current.copy(pos);
    desiredTargetRef.current.copy(target);
    isTransitioningRef.current = true;
    transitionStartRef.current = performance.now();
  }, [cameraPreset, size.width, size.height, colinhaOpen]);

  useFrame((_, delta) => {
    if (!isTransitioningRef.current || !controlsRef.current) return;

    const elapsed = performance.now() - transitionStartRef.current;
    const speed = Math.min(1, delta * 7.5);

    camera.position.lerp(desiredPosRef.current, speed);
    controlsRef.current.target.lerp(desiredTargetRef.current, speed);
    controlsRef.current.update();

    const distPos = camera.position.distanceTo(desiredPosRef.current);
    const distTarget = controlsRef.current.target.distanceTo(desiredTargetRef.current);

    if ((distPos < 0.03 && distTarget < 0.03) || elapsed > 900) {
      isTransitioningRef.current = false;
    }
  });

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    const stopTransition = () => {
      isTransitioningRef.current = false;
    };
    controls.addEventListener('start', stopTransition);
    return () => {
      controls.removeEventListener('start', stopTransition);
    };
  }, [controlsRef]);

  return null;
};

export const Scene3D: React.FC = () => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const cameraPreset = useElectionStore((s) => s.cameraPreset);

  return (
    <div className="w-full h-full relative touch-none">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [-0.65, 2.15, 5.35], fov: 40, near: 0.1, far: 140 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        {/* Ambiente fixo no modo Estúdio com identidade visual Brasil */}
        <color attach="background" args={['#082052']} />
        <fog attach="fog" args={['#082052', 45, 120]} />

        {/* Iluminação de Estúdio PBR intensa em 360° (frente e traseira) */}
        <ambientLight intensity={1.15} />
        <hemisphereLight args={['#ffffff', '#64748b', 0.85]} />

        {/* Luz Principal Frontal-Superior */}
        <directionalLight
          position={[3, 9, 8]}
          intensity={1.55}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0005}
        />

        {/* Luz Traseira de Estúdio (ilumina perfeitamente os lacres e detalhes da parte de trás!) */}
        <directionalLight
          position={[-2, 6, -8]}
          intensity={1.25}
          color="#f8fafc"
        />

        {/* Luzes Laterais */}
        <directionalLight position={[8, 4, 2]} intensity={0.45} color="#cbd5e1" />
        <directionalLight position={[-7, 5, 5]} intensity={0.65} color="#f8fafc" />

        {/* Controlador Responsivo de Câmera */}
        <CameraRig controlsRef={controlsRef} />

        {/* Modelo 3D da Urna Eletrônica (Intacto) */}
        <Urna3DModel />

        {/* Bancada de Estúdio com detalhes nas cores do Brasil */}
        <group position={[0, -1.94, 0.1]}>
          <RoundedBox
            args={[11.5, 0.26, 6.8]}
            radius={0.08}
            smoothness={4}
            receiveShadow
          >
            <meshStandardMaterial
              color="#041230"
              roughness={0.42}
              metalness={0.15}
            />
          </RoundedBox>
          {/* Filetes decorativos Verde e Amarelo na borda frontal da bancada */}
          <mesh position={[0, 0.04, 3.41]}>
            <boxGeometry args={[11.2, 0.045, 0.02]} />
            <meshBasicMaterial color="#009c3b" />
          </mesh>
          <mesh position={[0, -0.02, 3.41]}>
            <boxGeometry args={[11.2, 0.035, 0.02]} />
            <meshBasicMaterial color="#ffdf00" />
          </mesh>
        </group>

        {/* Sombra de contato realista sob a Urna */}
        <ContactShadows
          position={[0, -1.79, 0.1]}
          opacity={0.65}
          scale={11}
          blur={2.0}
          far={4}
        />

        {/* Controles Orbitais 3D (Mouse e Touch Pinch/Drag) */}
        <OrbitControls
          ref={controlsRef}
          makeDefault
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={cameraPreset === 'free360'}
          autoRotateSpeed={1.6}
          minDistance={0.8}
          maxDistance={45}
          maxPolarAngle={Math.PI / 2 + 0.05}
          minPolarAngle={0.15}
          dampingFactor={0.07}
          enableDamping
        />
      </Canvas>
    </div>
  );
};
