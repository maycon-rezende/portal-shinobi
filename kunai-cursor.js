(() => {
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  if (!finePointer.matches) return;

  const cursor = document.createElement("div");
  cursor.className = "kunai-cursor";
  cursor.setAttribute("aria-hidden", "true");
  cursor.innerHTML = `
    <svg viewBox="0 0 48 48" role="presentation">
      <path d="M24 2 11 15l6 7h14l6-7L24 2Z" fill="#dce2e8" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/>
      <path d="m24 5-9 10 4 5h10l4-5-9-10Z" fill="#8794a1"/>
      <path d="M21 22h6v13l4 3-2 4-5-3-5 3-2-4 4-3V22Z" fill="#303943" stroke="#dce2e8" stroke-width="1.2" stroke-linejoin="round"/>
      <path d="m20 27 7 3m-7 1 7 3" fill="none" stroke="#e53935" stroke-width="2.2" stroke-linecap="round"/>
      <circle cx="24" cy="43" r="3" fill="none" stroke="#dce2e8" stroke-width="2"/>
    </svg>`;
  document.body.append(cursor);
  document.documentElement.classList.add("kunai-cursor-enabled");

  let previousX = 0;
  let previousY = 0;
  let hasPosition = false;
  let attackTimeout;
  const isTextEntry = (target) => target?.closest(
    "textarea, [contenteditable='true'], input:not([type='button']):not([type='submit']):not([type='reset']):not([type='checkbox']):not([type='radio']):not([type='file']):not([type='range'])"
  );

  document.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") return;

    const target = event.target instanceof Element ? event.target : null;
    if (isTextEntry(target)) {
      cursor.classList.remove("is-visible", "is-hovering");
      return;
    }

    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
    cursor.classList.add("is-visible");

    if (hasPosition) {
      const dx = event.clientX - previousX;
      const dy = event.clientY - previousY;
      if (dx !== 0 || dy !== 0) {
        const rotation = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
        cursor.style.setProperty("--kunai-rotation", `${rotation}deg`);
      }
    }

    previousX = event.clientX;
    previousY = event.clientY;
    hasPosition = true;

    cursor.classList.toggle(
      "is-hovering",
      Boolean(target?.closest("a, button, [role='button'], summary, label, select"))
    );
  });

  document.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "touch") return;
    const target = event.target instanceof Element ? event.target : null;
    if (isTextEntry(target)) return;
    cursor.classList.add("is-attacking");
    window.clearTimeout(attackTimeout);
    attackTimeout = window.setTimeout(() => {
      cursor.classList.remove("is-attacking");
    }, 160);
  });

  document.addEventListener("pointerleave", () => {
    cursor.classList.remove("is-visible", "is-hovering");
  });

  window.addEventListener("blur", () => {
    cursor.classList.remove("is-visible", "is-hovering", "is-attacking");
  });
})();
