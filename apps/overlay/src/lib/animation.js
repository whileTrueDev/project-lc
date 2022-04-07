const { gsap } = window;
const { Bounce } = window;

const tl = gsap.timeline();

tl.to('.top-right-user-nickname', {
  duration: 2,
  x: 'random(-30, 30)',
  y: -400,
  ease: Bounce.easeOut,
});
