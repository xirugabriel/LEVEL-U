/* ================================
   ⚙ MODO DESENVOLVEDOR
   true = pula direto para o TUTORIAL
   false = jogo normal (intro+nome+selo+prólogo)
================================ */
const DEV_SKIP = false;

/* ===============================================
   Quando o DEV_SKIP estiver ON → pula p/ tutorial
================================================ */
if (DEV_SKIP) {
  window.addEventListener("load", () => {
    setTimeout(() => {
      document.getElementById("intro-screen")?.classList.add("hidden");
      document.getElementById("prelogue-screen")?.classList.add("hidden");
      document.getElementById("fade-layer")?.classList.add("hidden");
      document.getElementById("game-screen")?.classList.add("hidden");

      mostrarTutorial();   // << Agora pula para o TUTORIAL

      // Se quiser testar o efeito bala também com skip:
      // efeitoFlash(() => mostrarTutorial());
    }, 200);
  });
}

const PROLOGO = [
  `Há muitos séculos, em um reino esquecido, existia uma ordem ancestral chamada Os Guardiões da Chama.
Essa chama não era fogo comum — era a Essência que une destinos e outras vidas futuras e passadas.`,

  `Toda vez que duas almas eram escolhidas para compartilhar um caminho especial, a chama despertava, criando um “Círculo de Provas”, um jogo místico dividido em níveis, que apenas poderiam ser vencidos quando ambas as almas estivessem alinhadas.`,

  `A lenda diz que só o Guardião escolhido podia autorizar a jornada, pois era ele quem carregava o selo — um poder que permitia abrir passagens, dissipar ilusões e revelar enigmas impossíveis.`,

  `Agora, a chama despertou novamente…
E escolheu você.`
];

// PEGANDO OS ELEMENTOS
const inputName = document.getElementById("player-name");
const startBtn = document.getElementById("start-btn");
const introScreen = document.getElementById("intro-screen");
const gameScreen = document.getElementById("game-screen");
const playerNameDisplay = document.getElementById("player-name-display");
const fadeLayer = document.getElementById("fade-layer");
const prologueText = document.getElementById("prologue-text");
const startGameBtn = document.getElementById("start-game-btn");
const prelogueScreen = document.getElementById("prelogue-screen");
const continueToPrologueBtn = document.getElementById("continue-to-prologue");
const prelogueOptions = document.querySelectorAll(".prelogue-option");
const pergaminho = document.querySelector(".pergaminho-container");

// ✅ HABILITA/DESABILITA BOTÃO CONFORME DIGITA O NOME
if (inputName && startBtn) {
  inputName.addEventListener("input", () => {
    const value = inputName.value.trim();
    startBtn.disabled = value.length === 0;
  });
}

// 🧷 EFEITO DE DIGITAÇÃO COM CALLBACK
function typeText(element, text, speed = 40, onComplete) {
  element.textContent = "";
  let i = 0;

  const interval = setInterval(() => {
    element.textContent += text[i];
    i++;

    if (i >= text.length) {
      clearInterval(interval);
      if (typeof onComplete === "function") onComplete();
    }
  }, speed);
}

// 🔮 MOSTRAR PRÓLOGO (TELA PRETA COM TEXTO)
function mostrarPrologo() {
  if (!fadeLayer || !prologueText) return;

  fadeLayer.classList.remove("hidden");

  requestAnimationFrame(() => {
    fadeLayer.classList.add("visible");
    createParticles();
  });

  const fadeDuration = 1000;

  setTimeout(() => {
    prologueText.style.opacity = 1;
    mostrarParagrafos(0);
  }, fadeDuration);
}

function mostrarParagrafos(index = 0) {
  if (index >= PROLOGO.length) {
    efeitoFlash(() => {
        mostrarTutorial();
    });
    return;
}

  prologueText.textContent = "";
  prologueText.style.opacity = 0;

  setTimeout(() => {
    prologueText.style.opacity = 1;
  }, 50);

  const speed = 95;
  typeText(prologueText, PROLOGO[index], speed, () => {
    const leitura = 1800;

    setTimeout(() => {
      prologueText.style.opacity = 0;

      setTimeout(() => {
        mostrarParagrafos(index + 1);
      }, 700);
    }, leitura);
  });
}

// 🎴 ESCOLHA DO SELO (PROTEÇÃO / INTUIÇÃO / CORAGEM)
if (prelogueOptions && prelogueOptions.length > 0) {
  prelogueOptions.forEach((btn) => {
    btn.addEventListener("click", () => {
      prelogueOptions.forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");

      const escolha = btn.getAttribute("data-choice");
      localStorage.setItem("levelu_choice", escolha);
    });
  });
}

// 👉 BOTÃO "INICIAR PROVAÇÃO" (SAI DA ESCOLHA E VAI PRO PRÓLOGO)
if (continueToPrologueBtn) {
  continueToPrologueBtn.addEventListener("click", () => {
    if (prelogueScreen) prelogueScreen.classList.add("hidden");
    mostrarPrologo();
  });
}

// 🔥 BOTÃO "INICIAR JORNADA" (VALIDA NOME E ABRE ESCOLHA DO SELO)
if (startBtn) {
  startBtn.addEventListener("click", () => {
    const name = inputName.value.trim();
    const hint = document.querySelector(".hint");

    if (!name) return;

    const normalized = name.toLowerCase();

    // nomes aceitos
    if (
      normalized !== "mozao" &&
      normalized !== "mozão" &&
      normalized !== "amorzão"
    ) {
      if (hint) {
        hint.textContent =
          "❌ A chama rejeita este nome. Apenas o verdadeiro escolhido pode continuar.";
        hint.classList.add("hint-error");
      }

      if (introScreen) {
        introScreen.classList.add("card-shake");
        setTimeout(() => {
          introScreen.classList.remove("card-shake");
        }, 500);
      }

      return;
    }

    // nome aceito
    if (hint) {
      hint.textContent = "⚔️ O jogo só começa quando o seu nome for aceito.";
      hint.classList.remove("hint-error");
    }

    localStorage.setItem("levelu_player_name", name);
    if (playerNameDisplay) playerNameDisplay.textContent = name;

    // 🌗 TRANSIÇÃO + TROCA DE TELAS
screenTransition(() => {
  if (introScreen) introScreen.classList.add("hidden");
  if (prelogueScreen) prelogueScreen.classList.remove("hidden");
});
  });
}

// ANIMAÇÃO DE ABERTURA DA PÁGINA
window.addEventListener("load", () => {
  setTimeout(() => {
    document.body.classList.add("page-ready");

    const overlay = document.querySelector(".intro-overlay");
    if (overlay) {
      setTimeout(() => {
        overlay.remove();
      }, 1400);
    }
  }, 80);
});

// bloqueia pinch-zoom no iOS
document.addEventListener(
  "gesturestart",
  function (e) {
    e.preventDefault();
  },
  { passive: false }
);

// bloqueia zoom de double-tap
let lastTouchEnd = 0;
document.addEventListener(
  "touchend",
  function (e) {
    const now = new Date().getTime();
    if (now - lastTouchEnd <= 300) {
      e.preventDefault();
    }
    lastTouchEnd = now;
  },
  { passive: false }
);

// ✨ PARTICULAS DO FUNDO DO PRÓLOGO
function createParticles() {
  const container = document.querySelector("#fade-layer .particle-layer");
  if (!container) return;

  for (let i = 0; i < 25; i++) {
    const p = document.createElement("div");
    p.classList.add("particle");

    p.style.left = Math.random() * 100 + "vw";
    p.style.top = Math.random() * 100 + "vh";
    p.style.animationDelay = Math.random() * 4 + "s";

    const size = Math.random() * 4 + 3;
    p.style.width = size + "px";
    p.style.height = size + "px";

    container.appendChild(p);
  }
}

function screenTransition(callback) {
  const overlay = document.getElementById("transition-overlay");

  // Se der algum BO, só troca de tela seco pra não travar nada
  if (!overlay) {
    callback();
    return;
  }

  const FADE = 900; // tempo do fade (bate com o CSS ~0.9s)

  // 1) ESCURECE
  overlay.classList.add("active");

  // 2) QUANDO JÁ ESTÁ ESCURO → TROCA A TELA
  setTimeout(() => {
    callback();
    // aqui ainda está tudo preto
  }, FADE);

  // 3) DEPOIS COMEÇA A CLAREAR
  setTimeout(() => {
    overlay.classList.remove("active");
  }, FADE + 50);
}

let vidas = 3;
let levelAtual = 1;

function mostrarTutorialInicial() {
  const tutorial = document.createElement("div");
  tutorial.className = "screen tutorial-screen";
  tutorial.innerHTML = `
    <div class="tutorial-box">
      <h2>⚔ Como funciona o Ritual</h2>
      <p>
        Você terá <b>3 tentativas</b> para vencer cada desafio.<br><br>
        Se falhar todas as chances, o destino reinicia e você deve começar do zero.<br><br>
        Está pronta para provar seu valor?
      </p>
      <button id="start-level-1" class="arcade-start-btn">INICIAR NÍVEL 1</button>
    </div>
  `;

  document.body.appendChild(tutorial);

 document.getElementById("start-level-1").onclick = () => {
  screenTransition(iniciarLevel1);
};
}

function abrirLevel(num) {
  levelAtual = num;
  vidas = 3; // reset ao entrar no nível

  // aqui exibimos a tela do nível que já existe no seu HTML
  document.getElementById("level-title").textContent = "Nível 1 — O Primeiro Chamado";
  document.getElementById("level-subtitle").textContent = "O início da travessia";
  document.getElementById("level-description").textContent =
    "Descreva aqui o desafio real que ela deverá realizar...";

  document.getElementById("level-screen").classList.remove("hidden");
}

/* ============================
   📌 Tela inicial de dinâmica
============================ */
function mostrarTutorial() {
  document.getElementById("tutorial-screen").classList.remove("hidden");
  }

/* ⚡ FUNÇÃO DO FLASH CINEMÁTICO */
function efeitoFlash(callback) {
  const flash = document.getElementById("flash-effect");

  flash.classList.remove("hidden");
  flash.classList.add("show");

  setTimeout(() => {
    flash.classList.remove("show");
    flash.classList.add("hidden");

    if (typeof callback === "function") callback();
  }, 900); // igual ao tempo da animação
}

const mapScreen = document.getElementById("map-screen");
const levelScreen = document.getElementById("level-screen");
const levelTitleEl = document.getElementById("level-title");
const levelSubtitleEl = document.getElementById("level-subtitle");
const levelDescEl = document.getElementById("level-description");
const levelBackBtn = document.getElementById("level-back");
const levelCompleteBtn = document.getElementById("level-complete");
const senhaBox = document.getElementById("senha-container");

// 🔥 TELA DE TUTORIAL → NÍVEL 1
const tutorialScreen = document.getElementById("tutorial-screen");
const tutorialStartLevelBtn = document.getElementById("start-level-1");

/* 🔥 FORÇAR BOTÃO DO TUTORIAL A CHAMAR O NÍVEL 1 CORRETAMENTE */
document.getElementById("start-level-1").onclick = () => {
  screenTransition(iniciarLevel1);
};

/* ============================
   🔐 NÍVEL 1 — SENHA
============================ */

const MAX_VIDAS = 3;
let vidasRestantes = MAX_VIDAS;
const senhaCorreta = "mozao"; // <-- edite se quiser trocar
const hudCountLevel = document.getElementById("level-hud-count");
const hudHeartsLevel = document.querySelectorAll("#level-hearts .life-orb");

function atualizaHudVidas() {
  if (hudCountLevel) {
    hudCountLevel.textContent = `${vidasRestantes} / ${MAX_VIDAS}`;
  }

  if (hudHeartsLevel.length) {
    hudHeartsLevel.forEach((orb, index) => {
      orb.style.opacity = index < vidasRestantes ? "1" : "0.25";
      orb.style.filter = index < vidasRestantes ? "none" : "grayscale(100%)";
    });
  }
}

function iniciarLevel1() {
   gerarParticulasFogo(25);   // quantidade inicial de partículas 🔥
  vidasRestantes = MAX_VIDAS;   // volta para 3
  atualizaHudVidas();           // mostra 3 / 3 no HUD

  tutorialScreen.classList.add("hidden");
  levelScreen.classList.remove("hidden");
  senhaBox.classList.remove("hidden");
}

/* validação da senha */
document.getElementById("btn-validar-senha").addEventListener("click", () => {
  const input = document.getElementById("input-senha").value.trim().toLowerCase();
  const feedback = document.getElementById("senha-feedback");
  const senhaCorreta = "segredo";

  /* ====================== ACERTO ====================== */
  if (input === senhaCorreta) {

    // ⭐ animação visual do pergaminho
    pergaminho.classList.add("acerto-ritual");

    // mensagem de acerto
    feedback.textContent = "✨ A chama reconhece sua essência — você acertou!";
    feedback.style.color = "#ffbf40ff";

    // ⭐ partículas douradas ao acertar
    gerarParticulasSucesso();

    // ação após animação
    setTimeout(() => {
      alert("Nível concluído! 🔥");
      // aqui depois vai para o mapa / próximo nível
    }, 1200);

  
  /* ====================== ERRO ======================== */
  } else {
    vidasRestantes--;
    atualizaHudVidas();

    // ⭐ animação de erro
    pergaminho.classList.add("erro-ritual");

    // mensagem de erro
    feedback.textContent = `❌ Errado... Tentativas restantes: ${vidasRestantes}`;
    feedback.style.color = "#ff0000ff";

    // remove a animação para permitir repetir
    setTimeout(() => pergaminho.classList.remove("erro-ritual"), 400);

    // vida acabou
    if (vidasRestantes <= 0) {
    mostrarDerrota();
    return;
}
  }
});

document.getElementById("start-level-1").onclick = iniciarLevel1;

/* ===========================================================
      GERADOR DE PARTÍCULAS DE FOGO
   =========================================================== */

function gerarParticulasFogo(qtd = 50) {
  const container = document.createElement("div");
  container.classList.add("fire-particles");
  document.getElementById("level-screen").appendChild(container);

  for (let i = 0; i < qtd; i++) criarParticula(container);
}

function criarParticula(container) {
  const part = document.createElement("div");
  part.classList.add("fire-particle");

  part.style.left = Math.random()*100+"vw";
  part.style.bottom = "-10px";
  part.style.animationDuration = (4 + Math.random()*3) + "s";

  container.appendChild(part);

  setTimeout(() => {
    part.remove();
    criarParticula(container);
  }, part.style.animationDuration.replace("s","") * 1000);
}

function gerarParticulasSucesso(){
  const layer = document.createElement("div");
  layer.className = "level-success-fire";
  document.body.appendChild(layer);

  for(let i=0;i<30;i++){
    let p = document.createElement("span");
    p.style.left = (50 + (Math.random()*40-20))+"%";
    p.style.top = (55 + Math.random()*10)+"%";
    p.style.animationDelay = (Math.random()*0.5)+"s";
    layer.appendChild(p);
  }

  setTimeout(()=> layer.remove(),1800);
}

function mostrarDerrota(){
  const tela = document.getElementById("derrota-overlay");
  tela.classList.add("mostrar");

  gerarParticulasDerrota(); // partículas vermelhas subindo
}

document.getElementById("btn-derrota-recomecar").onclick = ()=>{
  location.reload(); // no futuro você pode voltar pro mapa
}


/* partículas de derrota */
function gerarParticulasDerrota(){
  const layer = document.createElement("div");
  layer.className = "perdido-fire";
  document.body.appendChild(layer);

  for(let i=0;i<80;i++){
    let p=document.createElement("span");
    p.style.left=(50+(Math.random()*70-35))+"%";
    p.style.top=(50+(Math.random()*20-10))+"%";
    layer.appendChild(p);
    p.style.animationDelay = Math.random()+"s";
  }

  setTimeout(()=>layer.remove(),2000);
}

/* =========================
   HOTFIX TRANSIÇÃO + LEVEL 1
   (não precisa apagar overlays)
========================= */
(() => {
  // pega TODOS overlays (mesmo com ID duplicado)
  function getOverlays() {
    const list = document.querySelectorAll("#transition-overlay");
    return list.length ? list : [];
  }

  // força uma transição única e confiável
  // TRANSIÇÃO 100% SINCRONIZADA (sem setTimeout)
window.screenTransition = async function screenTransition(callback) {
  const overlays = Array.from(document.querySelectorAll("#transition-overlay"));

  // se não achar overlay, só troca
  if (!overlays.length) {
    try { callback?.(); } catch (e) { console.error(e); }
    return;
  }

  // garante que estão visíveis e na frente
  overlays.forEach(o => {
    o.style.opacity = "0";
    o.style.pointerEvents = "all";
    o.style.willChange = "opacity";
  });

  // 1) Fade IN até preto
  const fadeIn = overlays.map(o =>
    o.animate(
      [{ opacity: 0 }, { opacity: 1 }],
      { duration: 380, easing: "ease-in", fill: "forwards" }
    ).finished
  );

  await Promise.allSettled(fadeIn);

  // 2) Troca de tela exatamente no preto
  try { callback?.(); } catch (e) { console.error(e); }

  // 3) Segura um tiquinho (pra não “piscar”)
  await new Promise(r => setTimeout(r, 60));

  // 4) Fade OUT
  const fadeOut = overlays.map(o =>
    o.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      { duration: 420, easing: "ease-out", fill: "forwards" }
    ).finished
  );

  await Promise.allSettled(fadeOut);

  overlays.forEach(o => {
    o.style.pointerEvents = "none";
    o.style.willChange = "";
  });
};

  // tutorial não pode quebrar o JS
  window.mostrarTutorial = function mostrarTutorial() {
    document.getElementById("tutorial-screen")?.classList.remove("hidden");
  };

  // sempre pegar os elementos DENTRO do level-screen (porque IDs estão duplicados no HTML)
  function bindSenhaNoLevel() {
    const level = document.getElementById("level-screen");
    if (!level) return;

    const btn = level.querySelector("#btn-validar-senha");
    const input = level.querySelector("#input-senha");
    const feedback = level.querySelector("#senha-feedback");

    if (!btn || !input || !feedback) return;

    // evita múltiplos listeners
    btn.onclick = null;

    btn.addEventListener("click", () => {
      const senhaCorreta = "segredo";
      const valor = (input.value || "").trim().toLowerCase();

      if (valor === senhaCorreta) {
        feedback.textContent = "✅ Ritual aceito. O caminho se abre...";
        feedback.style.opacity = "1";
        screenTransition(iniciarVideoFinal);
      } else {
        feedback.textContent = "❌ A senha ainda não é digna...";
        feedback.style.opacity = "1";
      }
    });
  }

  // substitui iniciarLevel1 pra não quebrar com #senha-container (que não existe)
  window.iniciarLevel1 = function iniciarLevel1() {
    const tutorial = document.getElementById("tutorial-screen");
    const level = document.getElementById("level-screen");

    // reset vidas se existir no teu código
    try {
      if (typeof MAX_VIDAS !== "undefined") window.vidasRestantes = MAX_VIDAS;
      if (typeof atualizaHudVidas === "function") atualizaHudVidas();
      if (typeof gerarParticulasFogo === "function") gerarParticulasFogo(25);
    } catch (e) {
      console.warn("Vidas/partículas (ignorado):", e);
    }

    tutorial?.classList.add("hidden");
    level?.classList.remove("hidden");

    bindSenhaNoLevel();
  };

  // garante o clique do botão do tutorial com CAPTURE (passa na frente de outros handlers)
  document.addEventListener("DOMContentLoaded", () => {
    const tut = document.getElementById("tutorial-screen");
    const btn = tut?.querySelector("#start-level-1");

    if (!btn) return;

    btn.addEventListener(
      "click",
      (ev) => {
        ev.preventDefault();
        ev.stopImmediatePropagation(); // mata os outros onclicks duplicados
        screenTransition(iniciarLevel1);
      },
      true // capture: roda antes do resto
    );
  });
})();

/* =========================
   NÍVEL 2 — RUNAS
========================= */
function iniciarLevel2() {
  const level1 = document.getElementById("level-screen");
  const level2 = document.getElementById("level2-screen");

  level1?.classList.add("hidden");
  level2?.classList.remove("hidden");

  bindLevel2();
}

function bindLevel2() {
  const level2 = document.getElementById("level2-screen");
  if (!level2) return;

  const runesWrap = level2.querySelector("#l2-runes");
  const seqEl = level2.querySelector("#l2-seq");
  const feedback = level2.querySelector("#l2-feedback");
  const resetBtn = level2.querySelector("#l2-reset");
  const winBtn = level2.querySelector("#l2-win");

  // ordem correta (você pode mudar depois)
  const correct = ["ᚨ", "ᚱ", "ᚾ", "ᛟ"];
  let chosen = [];

  function render() {
    seqEl.textContent = chosen.length ? chosen.join(" ") : "—";
  }

  function reset() {
    chosen = [];
    feedback.textContent = "";
    winBtn.classList.add("hidden");
    level2.querySelectorAll(".rune-btn").forEach(b => b.classList.remove("disabled"));
    render();
  }

  // evita duplicar listeners
  runesWrap.onclick = null;
  resetBtn.onclick = null;
  winBtn.onclick = null;

  runesWrap.addEventListener("click", (e) => {
    const btn = e.target.closest(".rune-btn");
    if (!btn) return;

    const rune = btn.dataset.rune;
    chosen.push(rune);
    btn.classList.add("disabled");
    render();

    if (chosen.length === correct.length) {
      const ok = chosen.every((r, i) => r === correct[i]);

      if (ok) {
        feedback.textContent = "✅ O selo quebrou. Você passou!";
        winBtn.classList.remove("hidden");
      } else {
        feedback.textContent = "❌ Ordem errada. O selo reinicia...";
        setTimeout(reset, 450);
      }
    }
  });

  resetBtn.addEventListener("click", reset);

  winBtn.addEventListener("click", () => {
    feedback.textContent = "👀 Próximo nível ainda não criado.";
  });

  reset();
}

/* =========================
   LEVEL 2 — DAMAS
========================= */

let board = [];
let selected = null;
let currentPlayer = "white";

function iniciarLevel2(){
  document.getElementById("level-screen")?.classList.add("hidden");
  document.getElementById("level2-screen")?.classList.remove("hidden");

  initBoard();
  renderBoard();
  currentPlayer = "white";
}

function initBoard(){
  board = [];
  for(let r=0;r<8;r++){
    board[r]=[];
    for(let c=0;c<8;c++){
      if(r<3 && (r+c)%2===1) board[r][c]={p:"black",k:false};
      else if(r>4 && (r+c)%2===1) board[r][c]={p:"white",k:false};
      else board[r][c]=null;
    }
  }
}

function renderBoard(){
  const el = document.getElementById("checkers-board");
  el.innerHTML="";

  for(let r=0;r<8;r++){
    for(let c=0;c<8;c++){
      const sq=document.createElement("div");
      sq.className=`square ${(r+c)%2?'dark':'light'}`;
      sq.onclick=()=>onSquareClick(r,c);

      const piece=board[r][c];
      if(piece){
        const p=document.createElement("div");
        p.className=`piece ${piece.p} ${piece.k?'king':''}`;
        if(selected && selected.r===r && selected.c===c) p.classList.add("selected");
        sq.appendChild(p);
      }
      el.appendChild(sq);
    }
  }
}

function onSquareClick(r,c){
  if(currentPlayer!=="white") return;

  if(selected){
    if(movePiece(selected.r,selected.c,r,c)){
      selected=null;
      renderBoard();
      setTimeout(aiMove,600);
    }
  } else if(board[r][c]?.p==="white"){
    selected={r,c};
    renderBoard();
  }
}

function movePiece(r1,c1,r2,c2){
  const piece=board[r1][c1];
  if(!piece || board[r2][c2]) return false;

  const dr=r2-r1, dc=c2-c1;
  const dir=piece.p==="white"?-1:1;

  // movimento simples
  if(Math.abs(dc)===1 && dr===dir){
    board[r2][c2]=piece;
    board[r1][c1]=null;
  }
  // captura
  else if(Math.abs(dc)===2 && Math.abs(dr)===2){
    const mr=r1+dr/2, mc=c1+dc/2;
    if(board[mr][mc] && board[mr][mc].p!==piece.p){
      board[r2][c2]=piece;
      board[r1][c1]=null;
      board[mr][mc]=null;
    } else return false;
  } else return false;

  // coroação
  if(piece.p==="white" && r2===0) piece.k=true;
  if(piece.p==="black" && r2===7) piece.k=true;

  currentPlayer=piece.p==="white"?"black":"white";
  return true;
}

function aiMove(){
  const moves=getAllMoves("black");
  if(!moves.length){
    endGame(true);
    return;
  }
  const move=moves[Math.floor(Math.random()*moves.length)];
  movePiece(move.from.r,move.from.c,move.to.r,move.to.c);
  renderBoard();
}

function getAllMoves(color){
  const moves=[];
  for(let r=0;r<8;r++){
    for(let c=0;c<8;c++){
      const p=board[r][c];
      if(p?.p===color){
        [[1,1],[1,-1],[2,2],[2,-2]].forEach(([dr,dc])=>{
          const r2=r+(color==="black"?dr:-dr);
          const c2=c+dc;
          if(r2>=0&&r2<8&&c2>=0&&c2<8){
            if(movePieceTest(r,c,r2,c2)) moves.push({from:{r,c},to:{r:r2,c:c2}});
          }
        });
      }
    }
  }
  return moves;
}

function movePieceTest(r1,c1,r2,c2){
  if(board[r2]?.[c2]) return false;
  return true;
}

function endGame(win){
  screenTransition(()=>{
    if(win){
      iniciarVideoFinal();
    }else{
      document.getElementById("l2-feedback").textContent="❌ A máquina venceu. Tente novamente.";
    }
  });
}

function iniciarVideoFinal() {
  document.body.innerHTML = `
    <div style="
      position:fixed;
      inset:0;
      background:black;
    ">
      <iframe
        src="https://www.youtube.com/embed/8pKxEfCSee0?autoplay=1&mute=1&playsinline=1"
        allow="autoplay; encrypted-media"
        allowfullscreen
        style="
          width:100vw;
          height:100vh;
          border:none;
        ">
      </iframe>
    </div>
  `;
}
