const { gsap } = window;
const { Back } = window;

export function chickenMovement() {
  const tl = gsap.timeline();

  tl.fromTo(
    '.chicken-move',
    { x: 1080 },
    {
      duration: 2,
      x: -200,
      ease: Back.easeOut.config(1.7),
    },
  );

  tl.to('#mother-chicken', {
    duration: 0.3,
    y: -15,
  }).to('#mother-chicken', {
    duration: 0.3,
    y: 0,
  });

  tl.to('#baby-1', {
    duration: 0.3,
    y: -15,
  }).to('#baby-1', {
    duration: 0.3,
    y: 0,
  });

  tl.to('#baby-2', {
    duration: 0.3,
    y: -15,
  }).to('#baby-2', {
    duration: 0.3,
    y: 0,
  });

  tl.to('#baby-3', {
    duration: 0.3,
    y: -15,
  }).to('#baby-3', {
    duration: 0.3,
    y: 0,
  });

  tl.to('#mother-chicken', {
    duration: 0.3,
    y: -15,
  }).to('#mother-chicken', {
    duration: 0.3,
    y: 0,
  });

  tl.to('#baby-1', {
    duration: 0.3,
    y: -15,
  }).to('#baby-1', {
    duration: 0.3,
    y: 0,
  });

  tl.to('#baby-2', {
    duration: 0.3,
    y: -15,
  }).to('#baby-2', {
    duration: 0.3,
    y: 0,
  });

  tl.to('#baby-3', {
    duration: 0.3,
    y: -15,
  }).to('#baby-3', {
    duration: 0.3,
    y: 0,
  });

  tl.to('#mother-chicken', {
    duration: 0.3,
    y: -15,
  }).to('#mother-chicken', {
    duration: 0.3,
    y: 0,
  });

  tl.to('#baby-1', {
    duration: 0.3,
    y: -15,
  }).to('#baby-1', {
    duration: 0.3,
    y: 0,
  });

  tl.to('#baby-2', {
    duration: 0.3,
    y: -15,
  }).to('#baby-2', {
    duration: 0.3,
    y: 0,
  });

  tl.to('#baby-3', {
    duration: 0.3,
    y: -15,
  }).to('#baby-3', {
    duration: 0.3,
    y: 0,
  });

  tl.to('.chicken-move', {
    duration: 2,
    x: -1920,
    ease: Back.easeInOut.config(1.7),
  });
}
