/**
 * Blinking software cursor — slate, 0.55ch wide, 1s blink. Used after
 * inline terminal-style spans on software tiles.
 */
export function OrnCursor() {
  return <span aria-hidden="true" className="orn-cursor">&nbsp;</span>;
}
