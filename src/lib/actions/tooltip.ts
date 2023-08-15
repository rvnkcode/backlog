// https://svelte.dev/repl/dd6754a2ad0547c5b1c1ea37c0293fef?version=4.1.2
import Tooltip__SvelteComponent_ from '$lib/components/atoms/Tooltip.svelte';

export function tooltip(element: HTMLElement) {
  const text = element.getAttribute('tooltipText');
  let component: Tooltip__SvelteComponent_;

  function mouseOver(event: MouseEvent) {
    component = new Tooltip__SvelteComponent_({
      target: document.body,
      props: {
        tooltipText: text ?? undefined,
        x: event.pageX,
        y: event.pageY
      }
    });
  }

  function mouseMove(event: MouseEvent) {
    component.$set({
      x: event.pageX,
      y: event.pageY
    });
  }

  function mouseLeave() {
    component.$destroy();
  }

  element.addEventListener('mouseover', mouseOver);
  element.addEventListener('mousemove', mouseMove);
  element.addEventListener('mouseleave', mouseLeave);
}
