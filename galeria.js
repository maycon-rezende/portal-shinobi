// 🎯 Filtros por categoria
const botoesFiltro = document.querySelectorAll(".filtros button");
const memorias = document.querySelectorAll(".memoria");

botoesFiltro.forEach(botao => {
  botao.addEventListener("click", () => {
    botoesFiltro.forEach(btn => btn.classList.remove("ativo"));
    botao.classList.add("ativo");

    const filtro = botao.getAttribute("data-filtro");

    memorias.forEach(memoria => {
      const grupo = memoria.getAttribute("data-grupo");
      memoria.style.display = (filtro === "todos" || grupo === filtro) ? "block" : "none";
    });
  });
});

// 🔍 Lightbox
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const legenda = document.getElementById("legendaLightbox");
const fechar = document.querySelector(".lightbox .fechar");

if (lightbox && lightboxImg && legenda) {
  document.querySelectorAll("[data-ampliar]").forEach(img => {
    img.addEventListener("click", () => {
      lightbox.style.display = "flex";
      lightbox.setAttribute("aria-hidden", "false");
      lightboxImg.src = img.src;
      const sobreposta = img.parentElement?.querySelector(".legenda-sobreposta");
      legenda.textContent = sobreposta?.textContent || img.alt;
    });
  });

  const fecharLightbox = () => {
    lightbox.style.display = "none";
    lightbox.setAttribute("aria-hidden", "true");
  };

  fechar?.addEventListener("click", fecharLightbox);
  lightbox.addEventListener("click", event => {
    if (event.target === lightbox) fecharLightbox();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") fecharLightbox();
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
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let width, height;
  function ajustarCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  ajustarCanvas();
  window.addEventListener("resize", ajustarCanvas);

  const particulas = Array.from({ length: 500 }, () => ({
    x: Math.random() * width,
    y: height + Math.random() * 200,
    r: Math.random() * 2 + 1,
    speed: Math.random() * 1.5 + 1,
    opacity: Math.random() * 0.4 + 0.1
  }));

  function animarChakra() {
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
    requestAnimationFrame(animarChakra);
  }

  animarChakra();
});


  