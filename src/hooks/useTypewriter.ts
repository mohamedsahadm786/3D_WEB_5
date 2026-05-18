import { useEffect, useState } from 'react';

/*
 * Rotating typewriter. Types a phrase, holds, deletes, advances to the next.
 * Honours prefers-reduced-motion by showing the first phrase statically.
 */
export function useTypewriter(phrases: string[], opts?: { type?: number; del?: number; hold?: number }) {
  const { type = 58, del = 28, hold = 1700 } = opts ?? {};
  const [text, setText] = useState(phrases[0] ?? '');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setText(phrases[0] ?? '');
      return;
    }
    let phrase = 0;
    let char = 0;
    let deleting = false;
    let timer: number;

    const step = () => {
      const current = phrases[phrase];
      char += deleting ? -1 : 1;
      setText(current.slice(0, char));

      let next = deleting ? del : type;
      if (!deleting && char === current.length) {
        next = hold;
        deleting = true;
      } else if (deleting && char === 0) {
        deleting = false;
        phrase = (phrase + 1) % phrases.length;
        next = 320;
      }
      timer = window.setTimeout(step, next);
    };

    timer = window.setTimeout(step, 900);
    setDone(true);
    return () => window.clearTimeout(timer);
  }, [phrases, type, del, hold]);

  return { text, animated: done };
}
