/* Single GSAP entry-point — register plugins once, import gsap from here. */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* shared luxury easing */
export const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
gsap.defaults({ ease: 'power3.out' });

export { gsap, ScrollTrigger, useGSAP };
