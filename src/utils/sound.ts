// Motor de Áudio Oficial da Urna Eletrônica Brasileira
// Utiliza as gravações originais da Urna (pré-carregadas em Web Audio API Buffers para latência zero)
// com fallback matemático nas frequências reais medidas (2200 Hz / 2333 Hz).

class UrnaSoundEngine {
  private ctx: AudioContext | null = null;
  private buffers: Record<string, AudioBuffer> = {};
  private loadingPromise: Promise<void> | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      // Inicia o pré-carregamento silencioso dos arquivos WAV/MP3 reais
      this.preloadSounds();
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private async preloadSounds() {
    if (this.loadingPromise) return this.loadingPromise;
    this.loadingPromise = (async () => {
      const soundFiles: Record<string, string> = {
        fim: '/sounds/urna-fim.wav',
        inter: '/sounds/urna-inter.wav',
        tecla: '/sounds/urna-tecla.wav',
        corrige: '/sounds/corrige.mp3',
      };

      const ctx = this.getContext();
      if (!ctx) return;

      await Promise.all(
        Object.entries(soundFiles).map(async ([key, url]) => {
          try {
            const res = await fetch(url);
            if (!res.ok) return;
            const arrayBuffer = await res.arrayBuffer();
            const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
            this.buffers[key] = audioBuffer;
          } catch {
            // Usa fallback caso algum arquivo ainda esteja carregando
          }
        })
      );
    })();
    return this.loadingPromise;
  }

  private playBuffer(key: string, fallbackUrl: string, volume = 0.85): boolean {
    const ctx = this.getContext();
    if (ctx && this.buffers[key]) {
      try {
        const source = ctx.createBufferSource();
        const gainNode = ctx.createGain();
        source.buffer = this.buffers[key];
        gainNode.gain.value = volume;
        source.connect(gainNode);
        gainNode.connect(ctx.destination);
        source.start(0);
        return true;
      } catch {
        // Continua para HTML5 Audio
      }
    }

    // Fallback imediato via HTML5 Audio apontando para o arquivo real em /public/sounds
    try {
      const audio = new Audio(fallbackUrl);
      audio.volume = volume;
      audio.play().catch(() => {});
      // Dispara preload para as próximas chamadas
      this.preloadSounds();
      return true;
    } catch {
      return false;
    }
  }

  public triggerHaptic(durationMs: number | number[] = 18) {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(durationMs);
      } catch {
        // Ignore on unsupported browsers
      }
    }
  }

  /**
   * Som original de tecla pressionada na Urna
   */
  public playKeyPress(enabled = true) {
    this.triggerHaptic(15);
    if (!enabled) return;
    this.playBuffer('tecla', '/sounds/urna-tecla.wav', 0.75);
  }

  /**
   * Bip curto oficial de confirmação intermediária (passagem de um cargo para o próximo)
   */
  public playConfirmIntermediario(enabled = true) {
    this.triggerHaptic([25, 30, 40]);
    if (!enabled) return;
    this.playBuffer('inter', '/sounds/urna-inter.wav', 0.85);
  }

  /**
   * O som ORIGINAL da Urna Eletrônica ao finalizar a votação ("FIM")
   */
  public playFimEleicao(enabled = true) {
    this.triggerHaptic([40, 30, 40, 30, 40, 30, 180]);
    if (!enabled) return;
    this.playBuffer('fim', '/sounds/urna-fim.wav', 0.95);
  }

  /**
   * Som de tecla Corrige / Branco
   */
  public playActionKey(type: 'corrige' | 'branco', enabled = true) {
    this.triggerHaptic(22);
    if (!enabled) return;
    if (type === 'corrige') {
      this.playBuffer('corrige', '/sounds/corrige.mp3', 0.75);
    } else {
      this.playBuffer('tecla', '/sounds/urna-tecla.wav', 0.75);
    }
  }

  /**
   * Sintetizador de voz em Português (Acessibilidade Auditiva)
   */
  public speak(text: string, enabled = false) {
    if (!enabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.12;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore speech errors on restricted devices
    }
  }
}

export const urnaSound = new UrnaSoundEngine();
