export function fireConfetti() {
  if (typeof window === "undefined") return;
  import("canvas-confetti").then((confetti) => {
    const defaults = {
      spread: 60,
      ticks: 100,
      gravity: 0.6,
      decay: 0.94,
      startVelocity: 30,
      colors: ["#47655E", "#D4BB06", "#C8E6DF", "#8069bf", "#1A1A1A"],
    };

    confetti.default({
      ...defaults,
      particleCount: 40,
      origin: { y: 0.6 },
    });

    setTimeout(() => {
      confetti.default({
        ...defaults,
        particleCount: 25,
        angle: 60,
        origin: { x: 0, y: 0.5 },
      });
    }, 150);

    setTimeout(() => {
      confetti.default({
        ...defaults,
        particleCount: 25,
        angle: 120,
        origin: { x: 1, y: 0.5 },
      });
    }, 300);
  });
}
