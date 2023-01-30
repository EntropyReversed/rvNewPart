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
      { opacity: 1, duration: 0.6 },
      firstDelay
    )
    .fromTo(
      selector,
      { scale: 0.8 },
      { scale: 1, duration: 0.6 },
      secondDelay
    )
    .to({}, { duration: 0.05 })
    .to(selector, { opacity: 0 }, lastDelay);
};
