# 🗳️ Simulador 3D — Urna Eletrônica Brasileira (WebGL / React Three Fiber)

Simulador 3D interativo e responsivo da **Urna Eletrônica Brasileira**, projetado para rodar diretamente no navegador (Desktop e Mobile) sem necessidade de login ou banco de dados externo. Desenvolvido como vitrine técnica de **Computação Gráfica na Web (WebGL)**, **Engenharia de Estado Reativo** e **Síntese de Áudio Nativa**.

---

## ✨ Destaques Técnicos do Projeto

1. **Modelagem 3D 100% Procedural PBR (`React Three Fiber` + `Three.js`)**
   - Gabinete trapezoidal construído matematicamente com `ExtrudeGeometry` e `RoundedBox` (carregamento instantâneo de 0ms no celular, sem arquivos `.glb` pesados).
   - Teclas físicas independentes com curso de mola (`lerp` a 60fps), texturas geradas em tempo real via `CanvasTexture` e **pontos táteis em Braille 3D reais** em todas as teclas numéricas (`0-9`) mais o traço tátil na tecla `5`.
   - Painel traseiro detalhado com **Lacre de Segurança Oficial**, número de série e especificações para inspeção em **360°**.

2. **Áudio Oficial Sintetizado via `Web Audio API` (Zero MP3)**
   - Clique mecânico e bip das teclas numéricas.
   - Bip de confirmação intermediária entre cargos.
   - O icônico som **"PILILILILI"** ao finalizar a votação (`FIM`), sintetizado por osciladores harmônicos alternando frequências exatas (`2590 Hz` e `1945 Hz`).
   - **Acessibilidade por Voz (`Web Speech API`)**: leitura opcional em Português (`pt-BR`) dos dígitos, candidatos e instruções.
   - **Feedback Háptico (`Web Vibration API`)**: vibração tátil ao tocar nas teclas em dispositivos móveis compatíveis.

3. **Fluxo Eleitoral Oficial Completo + "Colinha" Tech/Dev**
   - Suporta o fluxo completo de **5 cargos** (*Deputado Federal*, *Deputado Estadual*, *Senador*, *Governador* e *Presidente*) ou o **Modo Rápido** (*Só Presidente*).
   - Suporte a **Voto Nominal**, **Voto de Legenda**, **Voto em Branco** e **Voto Nulo**, com retratos `3x4` vetoriais de alta definição para titulares, vices e suplentes.
   - **Boletim de Urna e Zerésima**: apuração em tempo real dos votos da sessão persistida no navegador (`localStorage`).

4. **UX Responsiva (Desktop & Celular) + Modo Raio-X (Dev Inspector)**
   - **Camera Rig Adaptativo**: ajusta automaticamente o enquadramento para telas verticais (celulares) ou horizontais (monitores), com atalhos cinematográficos (*Visão Votação*, *Foco no Visor*, *Foco no Teclado*, *Giro 360°* e *Lacre Traseiro*).
   - **Modo Raio-X 3D (`Wireframe`)** e 3 temas de iluminação (*Estúdio*, *Cyber 3D*, *Cabine Eleitoral*).

---

## 🚀 Como Executar Localmente

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor de desenvolvimento
npm run dev

# 3. Gerar build de produção otimizado
npm run build
```

---

## 🎨 Personalizando Seus Créditos (LinkedIn / GitHub)

Edite o arquivo [`src/config/portfolio.ts`](./src/config/portfolio.ts) para atualizar seu nome, cargo e links exibidos no cabeçalho e no modal de compartilhamento:

```ts
export const PORTFOLIO_CONFIG = {
  authorName: 'Seu Nome',
  authorRole: 'Full-Stack & Creative 3D Web Developer',
  linkedinUrl: 'https://www.linkedin.com/in/seu-perfil/',
  githubUrl: 'https://github.com/seu-usuario',
  // ...
};
```
