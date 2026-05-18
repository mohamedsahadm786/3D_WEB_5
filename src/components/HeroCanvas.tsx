import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useChapterProgress } from './Chapter';

/*
 * WebGL hero scene for ALLUVI — a warm-lit faceted form in a field of drifting
 * golden motes.
 *
 * Motion model (mirrors the reference's scrubbed-camera mechanic):
 *  - The camera DOLLIES forward and the form SCALES UP, scrubbed to the parent
 *    Chapter's scroll progress — the object grows monumental as you scroll in.
 *  - Dual cursor effect: (1) the whole camera reprojects toward the cursor with
 *    a damped lerp; (2) the form independently ORBITS to follow the cursor.
 *
 * Pauses when off-screen / tab hidden; disabled for reduced motion.
 */
export default function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  const chapterProgress = useChapterProgress();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let width = mount.clientWidth;
    let height = mount.clientHeight;
    const isMobile = window.innerWidth < 768;

    /* ---- renderer ---- */
    const renderer = new THREE.WebGLRenderer({ antialias: !isMobile, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.3 : 1.6));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    /* ---- scene + camera ---- */
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xefe8da, 0.085);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    const CAM_Z_FAR = 9;
    const CAM_Z_NEAR = 5.2;
    camera.position.set(0, 0, CAM_Z_FAR);

    /* ---- lighting (warm museum key) ---- */
    scene.add(new THREE.AmbientLight(0xf4ecd9, 0.9));
    const key = new THREE.DirectionalLight(0xffe9c4, 2.1);
    key.position.set(4, 6, 7);
    scene.add(key);
    const rim = new THREE.PointLight(0xa6824c, 3.4, 26);
    rim.position.set(-6, -2, 4);
    scene.add(rim);

    /* ---- central faceted form ---- */
    const group = new THREE.Group();
    scene.add(group);

    const coreGeo = new THREE.IcosahedronGeometry(1.65, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xc9a86a,
      metalness: 0.55,
      roughness: 0.32,
      flatShading: true,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    const shellGeo = new THREE.IcosahedronGeometry(2.5, 1);
    const shell = new THREE.Mesh(
      shellGeo,
      new THREE.MeshBasicMaterial({
        color: 0x8b7b62,
        wireframe: true,
        transparent: true,
        opacity: 0.22,
      }),
    );
    group.add(shell);

    /* ---- drifting motes ---- */
    const COUNT = isMobile ? 420 : 900;
    const positions = new Float32Array(COUNT * 3);
    const speeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14 - 2;
      speeds[i] = 0.08 + Math.random() * 0.22;
    }
    const moteGeo = new THREE.BufferGeometry();
    moteGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const moteMat = new THREE.PointsMaterial({
      color: 0xc6a36a,
      size: 0.045,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });
    const motes = new THREE.Points(moteGeo, moteMat);
    scene.add(motes);

    /* ---- interaction state ---- */
    const pointer = { x: 0, y: 0 };
    const cam = { x: 0, y: 0 };
    const orbit = { x: 0, y: 0 };
    let scrollN = 0; // scrubbed chapter progress 0→1

    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onPointer);

    /* ---- visibility gating ---- */
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), {
      threshold: 0,
    });
    io.observe(mount);

    /* ---- resize ---- */
    const onResize = () => {
      width = mount.clientWidth;
      height = mount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onResize);

    /* ---- loop ---- */
    const clock = new THREE.Clock();
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible || document.hidden) return;
      const t = clock.getElapsedTime();
      const dt = clock.getDelta();

      // scrubbed scroll progress drives the camera dolly + form scale
      scrollN = chapterProgress ? chapterProgress.get() : 0;

      core.rotation.x = t * 0.12;
      core.rotation.z = t * 0.05;
      shell.rotation.x = -t * 0.06;
      shell.rotation.y = t * 0.09;

      // cursor orbit — the form turns to follow the pointer (damped catch-up)
      orbit.x += (pointer.x * 0.6 - orbit.x) * 0.045;
      orbit.y += (-pointer.y * 0.35 - orbit.y) * 0.045;
      group.rotation.y = orbit.x + t * 0.17;
      group.rotation.x = orbit.y;

      // scroll: the form rises gently into frame and grows monumental
      group.position.y = Math.sin(t * 0.6) * 0.18 - scrollN * 0.6;
      group.scale.setScalar(1 + scrollN * 0.55);

      // motes rise + wrap
      const pos = moteGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < COUNT; i++) {
        let y = pos.getY(i) + speeds[i] * dt;
        if (y > 8) y = -8;
        pos.setY(i, y);
      }
      pos.needsUpdate = true;
      motes.rotation.y = t * 0.02;

      // damped camera parallax + scroll dolly-in
      cam.x += (pointer.x * 0.85 - cam.x) * 0.045;
      cam.y += (-pointer.y * 0.55 - cam.y) * 0.045;
      camera.position.x = cam.x;
      camera.position.y = cam.y;
      camera.position.z = CAM_Z_FAR + (CAM_Z_NEAR - CAM_Z_FAR) * scrollN;
      camera.lookAt(0, group.position.y * 0.4, 0);

      renderer.render(scene, camera);
    };
    tick();

    /* ---- cleanup ---- */
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('resize', onResize);
      coreGeo.dispose();
      shellGeo.dispose();
      moteGeo.dispose();
      coreMat.dispose();
      moteMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [chapterProgress]);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden />;
}
