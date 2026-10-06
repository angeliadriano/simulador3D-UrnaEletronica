# 🗳️ Simulador 3D da Urna Eletrônica Brasileira

Um simulador interativo em 3D da **Urna Eletrônica Brasileira**, feito para funcionar direto no navegador, pelo computador, celular ou tablet, sem precisar baixar nada nem fazer login.

O objetivo do projeto é oferecer uma experiência visual, prática e educativa de como funciona o processo de votação no Brasil, com gráficos em três dimensões, sons característicos e controle total dos ângulos de visão.

---

## 📋 Como Funciona a Experiência

Ao abrir a aplicação, você tem diante de si uma réplica em 3D da cabine de votação. Você pode interagir com ela como se estivesse no dia da eleição:

### 1. Digitação e Controle das Teclas
* **Pelo toque ou mouse:** Você pode clicar ou tocar diretamente nos botões numéricos da urna na tela. As teclas afundam fisicamente ao serem pressionadas.
* **Pelo teclado do computador:** Você também pode usar as teclas do seu próprio teclado físico:
  * **`0` a `9`**: Digita os números do candidato.
  * **`Enter`**: Confirma o voto (tecla verde).
  * **`Backspace` / `Delete`**: Corrige o número digitado (tecla laranja).
  * **`B`** ou **`Espaço`**: Vota em branco (tecla branca).

---

### 2. Modos de Votação
Você pode escolher entre duas opções de fluxo de votação:
* **Modo Completo:** Segue a ordem oficial das eleições gerais brasileiras:
  1. Deputado Federal (4 dígitos)
  2. Deputado Estadual (5 dígitos)
  3. Senador (3 dígitos)
  4. Governador (2 dígitos)
  5. Presidente (2 dígitos)
* **Modo Rápido:** Vai direto para a etapa de votação para **Presidente**, ideal para quem deseja apenas fazer um teste rápido.

---

### 3. Tipos de Voto Aceitos
O simulador reconhece todas as situações reais de voto:
* **Voto Nominal (no Candidato):** Ao digitar o número completo, aparecem na tela a foto do candidato, seu nome, seu partido e a foto do vice/suplente.
* **Voto de Legenda:** Ao digitar apenas os 2 dígitos do partido e pressionar **CONFIRMA**, você vota na legenda do partido.
* **Voto em Branco:** Pressione a tecla **BRANCO** e depois **CONFIRMA**.
* **Voto Nulo:** Se digitar um número que não pertence a nenhum candidato registrado, a tela avisa que o número é inexistente e permite anular o voto com a tecla **CONFIRMA**.

---

### 4. "Colinha" Eleitoral
Para que você não precise adivinhar os números, há um botão de **"Colinha"** na tela. Ao clicar nele, abre-se uma lista com todos os candidatos fictícios cadastrados no simulador, acompanhados de suas fotos, números, cargos e partidos.

---

### 5. Boletim de Urna e Zerésima
O simulador mantém a contagem dos votos realizados no seu navegador:
* **Zerésima:** Mostra o comprovante inicial de que a urna começou a sessão com zero votos.
* **Boletim de Urna:** Gera um relatório completo com o total de eleitores que já votaram na sua sessão e a contagem detalhada de votos de cada candidato e legenda.
* **Reiniciar Urna:** Você pode zerar os votos a qualquer instante para iniciar uma nova simulação.

---

### 6. Ângulos de Câmera e Rotação 360°
Você pode explorar a urna de qualquer ângulo:
* **Giro Livre:** Arraste com o mouse ou deslize o dedo na tela para rodar a urna em 360 graus e dar zoom.
* **Atalhos Rápidos:** Na barra inferior, você pode alternar a visão com um único clique:
  * **Visão Geral:** Posição confortável de votação.
  * **Foco no Visor:** Aproxima a câmera da tela da urna.
  * **Foco no Teclado:** Aproxima a câmera do teclado numérico.
  * **Painel Traseiro:** Gira a urna para inspecionar a parte de trás, onde ficam a chave liga/desliga e os lacres de segurança.

---

### 7. Sons Reais e Leitura por Voz
* **Áudios Característicos:** Inclui o som de clique das teclas, o bip de confirmação intermediária e o tradicional sinal sonoro longo ao término da votação (**FIM**).
* **Acessibilidade por Voz:** Conta com uma opção de narração em português que fala os números e instruções em voz alta, simulando os recursos de acessibilidade da urna real.

---

### 8. Temas de Luz e Visual
Você pode personalizar o ambiente visual através dos botões no topo da tela:
* Trocar a iluminação (Luz de Estúdio, Cabine Eleitoral ou Tema Futurista).
* Ligar o modo "Linhas/Estrutura", que permite ver como a geometria da urna foi desenhada.

---

## 🛡️ Aviso Legal e Educativo

> **Importante:** Este projeto é uma iniciativa independente criada para fins exclusivamente **educativos, artísticos e de entretenimento**. Não possui qualquer relação, filiação, patrocínio ou chancela oficial do **Tribunal Superior Eleitoral (TSE)** ou de qualquer órgão da Justiça Eleitoral brasileira.

---
