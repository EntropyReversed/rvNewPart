export const animateText = (
  timeline,
  selector,
  firstDelay = '<',
  secondDelay = '<',
  lastDelay = '<+0.5'
) => {
  timeline
    .fromTo(
      selector,
      { opacity: 0 },
      { opacity: 1, duration: 0.1, ease: 'power3.out' },
      firstDelay
    )
    .fromTo(
      selector,
      { scale: 0.95 },
      { scale: 1, duration: 0.2, ease: 'power3.out' },
      secondDelay
    )
    .to({}, { duration: 0.05 })
    .to(selector, { opacity: 0 }, lastDelay);
};
