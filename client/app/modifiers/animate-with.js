import { modifier } from 'ember-modifier';

// progressively add classes with a given duration
export default modifier(function animateWith(element, [from, to, duration = 10]) {
  element.classList.add(from);

  setTimeout(() => {
    element.classList.add(to);
  }, duration);
});
