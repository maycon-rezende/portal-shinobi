const botoesFiltro = document.querySelectorAll(".filtros-botoes button");
const memorias = document.querySelectorAll(".memoria");
const buscaMemorias = document.getElementById("buscarMemorias");
const memoriasResultado = document.getElementById("memoriasResultado");
const filtroInicial = document.querySelector(".filtros-botoes button[aria-pressed='true']");
let filtroAtivo = filtroInicial?.dataset.filtro || "todos";

const atualizarMemorias = () => {
  const termo = buscaMemorias?.value.trim().toLocaleLowerCase("pt-BR") || "";
  let visiveis = 0;

  memorias.forEach(memoria => {
    const grupo = memoria.dataset.grupo;
    const imagem = memoria.querySelector("img");
    const legenda = memoria.querySelector(".legenda-sobreposta")?.textContent || "";
    const correspondeGrupo = filtroAtivo === "todos" || grupo === filtroAtivo;
    const texto = `${imagem?.alt || ""} ${legenda} ${grupo || ""}`.toLocaleLowerCase("pt-BR");
    const correspondeBusca = !termo || texto.includes(termo);
    const mostrar = correspondeGrupo && correspondeBusca;

    memoria.hidden = !mostrar;
    if (mostrar) visiveis += 1;
  });

  if (memoriasResultado) {
    memoriasResultado.textContent = `${visiveis} ${visiveis === 1 ? "memória encontrada" : "memórias encontradas"}.`;
  }
};

botoesFiltro.forEach(botao => {
  botao.addEventListener("click", () => {
    filtroAtivo = botao.dataset.filtro || "todos";
    botoesFiltro.forEach(btn => {
      btn.setAttribute("aria-pressed", String(btn === botao));
    });
    atualizarMemorias();
  });
});

buscaMemorias?.addEventListener("input", atualizarMemorias);
atualizarMemorias();

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const legenda = document.getElementById("legendaLightbox");
const fechar = document.querySelector(".lightbox .fechar");

if (lightbox instanceof HTMLDialogElement && lightboxImg && legenda && fechar) {
  let imagemAtiva = null;

  const abrirLightbox = img => {
    imagemAtiva = img;
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt;
    const sobreposta = img.parentElement?.querySelector(".legenda-sobreposta");
    legenda.textContent = sobreposta?.textContent.trim() || img.alt;
    lightbox.showModal();
    fechar.focus();
  };

  document.querySelectorAll("[data-ampliar]").forEach(img => {
    img.addEventListener("click", () => abrirLightbox(img));
    img.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        abrirLightbox(img);
      }
    });
  });

  fechar.addEventListener("click", () => lightbox.close());
  lightbox.addEventListener("click", event => {
    if (event.target === lightbox) lightbox.close();
  });
  lightbox.addEventListener("close", () => {
    imagemAtiva?.focus();
    imagemAtiva = null;
  });
}

// 🌙 Modo Noturno
document.getElementById("ativarNoturno")?.addEventListener("click", () => {
  document.body.classList.toggle("modo-noturno");
});

// 🌀 Animação ao rolar
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visivel");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });

  document.querySelectorAll(".memoria").forEach(el => {
    observer.observe(el);
  });
} else {
  document.querySelectorAll(".memoria").forEach(el => {
    el.classList.add("visivel");
  });
}

// 💫 Chakra flutuante
window.addEventListener("load", () => {
  const canvas = document.getElementById("chakraCanvas");
  if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let animationFrame = 0;
  function ajustarCanvas() {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  }

  ajustarCanvas();
  window.addEventListener("resize", ajustarCanvas);

  const quantidadeParticulas = window.innerWidth < 640 ? 45 : 90;
  const particulas = Array.from({ length: quantidadeParticulas }, () => ({
    x: Math.random() * width,
    y: height + Math.random() * 200,
    r: Math.random() * 2 + 1,
    speed: Math.random() * 1.5 + 1,
    opacity: Math.random() * 0.4 + 0.1
  }));

  function animarChakra() {
    animationFrame = 0;
    if (document.hidden) return;

    ctx.clearRect(0, 0, width, height);
    particulas.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(144,202,249,${p.opacity})`;
      ctx.fill();
      p.y -= p.speed;
      if (p.y < -10) {
        p.y = height + Math.random() * 100;
        p.x = Math.random() * width;
      }
    });
    animationFrame = requestAnimationFrame(animarChakra);
  }

  const iniciarAnimacao = () => {
    if (!document.hidden && !animationFrame) {
      animationFrame = requestAnimationFrame(animarChakra);
    }
  };

  document.addEventListener("visibilitychange", iniciarAnimacao);
  iniciarAnimacao();
});


  