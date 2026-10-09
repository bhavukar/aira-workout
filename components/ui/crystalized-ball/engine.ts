import { Renderer, Mesh, Geometry } from 'ogl';
import {
  MAX_STRANDS,
  MAX_ARCS,
  MAX_PARTICLES,
  PIXEL_BUDGET,
  INTRO_SECONDS,
  SETTLE_SECONDS,
  clamp,
  smooth,
  easeOut,
  wrapAngle,
  seeded,
  buildDust,
} from './palette';
import {
  setupCrystalizedWebGL,
  disposeTarget,
  createStateTarget,
  createDataTexture,
} from './webgl-setup';

export function initCrystalizedBallEngine(
  container: HTMLDivElement,
  settingsRef: { current: any },
  wakeRef: { current: (() => void) | null }
) {
  let renderer: any;
  try {
    renderer = new Renderer({ alpha: true, premultipliedAlpha: true, antialias: false, depth: false });
  } catch {
    return () => {};
  }
  const gl = renderer.gl;
  if (!renderer.isWebgl2) {
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return () => {};
  }
  const canvas = gl.canvas;
  canvas.style.display = 'block';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.setAttribute('aria-hidden', 'true');
  container.appendChild(canvas);

  const fullFloat = !!gl.getExtension('EXT_color_buffer_float');
  const halfFloat = fullFloat || !!gl.getExtension('EXT_color_buffer_half_float');

  const {
    blank,
    sceneTarget,
    fieldUniforms,
    dustShared,
    dustUniforms,
    stirUniforms,
    compositeUniforms,
    fieldMesh,
    dustProgram,
    stirMesh,
    compositeMesh,
    arcData,
  } = setupCrystalizedWebGL(gl, halfFloat, fullFloat);

  let dust: any = null;

  const disposeDust = () => {
    if (!dust) return;
    dust.mesh.geometry.remove();
    gl.deleteTexture(dust.home.texture);
    gl.deleteTexture(dust.seed.texture);
    disposeTarget(gl, dust.read);
    disposeTarget(gl, dust.write);
    dust = null;
  };

  const resetStir = () => {
    if (!stirMesh || !dust || !dust.read || !dust.write) return;
    stirUniforms.tOffset.value = blank;
    stirUniforms.tVelocity.value = blank;
    stirUniforms.uReset.value = 1;
    renderer.render({ scene: stirMesh, target: dust.read, clear: false });
    renderer.render({ scene: stirMesh, target: dust.write, clear: false });
    stirUniforms.uReset.value = 0;
  };

  const rebuildDust = (requested: number) => {
    const total = clamp(Math.round(requested / 100) * 100, 0, MAX_PARTICLES);
    if (dust && dust.requested === total) return;
    disposeDust();
    if (!total) {
      dust = null;
      return;
    }
    const data = buildDust(total);
    const indices = new Float32Array(data.count);
    for (let i = 0; i < data.count; i++) indices[i] = i;
    const points = new Geometry(gl, { aIndex: { size: 1, data: indices } });
    dust = {
      requested: total,
      rows: data.rows,
      home: createDataTexture(gl, data.home, data.rows),
      seed: createDataTexture(gl, data.seed, data.rows),
      mesh: new Mesh(gl, { mode: gl.POINTS, geometry: points, program: dustProgram }),
      read: stirMesh ? createStateTarget(gl, fullFloat, data.rows) : null,
      write: stirMesh ? createStateTarget(gl, fullFloat, data.rows) : null,
    };
    dustShared.tHome.value = dust.home;
    dustShared.tSeed.value = dust.seed;
    resetStir();
    stirring = 0;
  };

  const reducedMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const random = seeded(913);

  let width = 1;
  let height = 1;
  let raf = 0;
  let last = performance.now();
  let rimTime = 0;
  let dustTime = 0;
  let swayClock = 0;
  let introClock = 0;
  let visible = true;
  let alive = true;
  let surge = 0;
  let stirring = 0;
  let stirEnergy = 0;
  let kick: any = null;
  let nextArc = 0.3;
  const arcs: any[] = [];
  const pointer = { x: 0, y: 0, inside: false, fresh: true };
  const heat = { angle: 0, velocity: 0, power: 0, near: 0 };
  const brush = { x: 0, y: 0, vx: 0, vy: 0 };
  const look = { x: 0, y: 0, vx: 0, vy: 0 };

  const resize = () => {
    if (!container) return;
    width = Math.max(1, container.clientWidth);
    height = Math.max(1, container.clientHeight);
    renderer.dpr = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(PIXEL_BUDGET / (width * height)));
    renderer.setSize(width, height);
    sceneTarget.setSize(gl.canvas.width, gl.canvas.height);
    start();
  };

  const spawnArc = (angle: number, arcStrength: number) => {
    if (arcs.length >= MAX_ARCS) return;
    arcs.push({
      start: angle,
      span: (0.05 + random() * 0.07) * (random() < 0.5 ? -1 : 1),
      curl: 0.02 + random() * 0.04,
      life: 0,
      duration: 0.2 + random() * 0.2,
      drift: (random() - 0.5) * 0.3,
      strength: arcStrength,
    });
  };

  const frame = (now: number) => {
    raf = 0;
    if (!alive) return;
    const s = settingsRef.current;
    const dt = Math.min(0.05, Math.max(1 / 240, (now - last) / 1000));
    last = now;
    if (!s) return;

    const moving = !s.paused && !reducedMotion;
    introClock = s.intro && !reducedMotion ? Math.min(1, introClock + dt / INTRO_SECONDS) : 1;
    const presence = easeOut(smooth(0, 0.42, introClock));
    const unfold = easeOut(smooth(0, 0.32, introClock));
    const charge = Math.sin(Math.PI * smooth(0.22, 0.78, introClock)) * 0.35;
    const radius = Math.max(8, (clamp(s.size, 0.1, 1.5) * Math.min(width, height)) / 2);

    const str = s.interactive && !reducedMotion ? clamp(s.hoverStrength, 0, 1) : 0;
    const px = pointer.x - width / 2;
    const py = height / 2 - pointer.y;
    const reach = Math.hypot(px, py);
    const target = pointer.inside ? str : 0;
    if (heat.power < 0.02) {
      heat.angle = Math.atan2(py, px);
      heat.velocity = 0;
    }
    const turn = wrapAngle(Math.atan2(py, px) - heat.angle);
    heat.velocity += (120 * turn - 19 * heat.velocity) * dt;
    heat.angle = wrapAngle(heat.angle + heat.velocity * dt);
    heat.power += (target - heat.power) * (1 - Math.exp(-dt / (target > heat.power ? 0.3 : 0.55)));
    const nearTarget = Math.exp(-Math.pow((reach - radius) / (radius * 0.45), 2));
    heat.near += (nearTarget - heat.near) * (1 - Math.exp(-dt / 0.15));
    surge *= Math.exp(-dt / 0.7);

    const bx = px / radius;
    const by = py / radius;
    if (Math.hypot(bx - brush.x, by - brush.y) > 0.6) pointer.fresh = true;
    if (pointer.fresh) {
      brush.x = bx;
      brush.y = by;
      brush.vx = 0;
      brush.vy = 0;
      pointer.fresh = false;
    }
    const follow = 1 - Math.exp(-dt / 0.05);
    brush.vx += ((bx - brush.x) / dt - brush.vx) * follow;
    brush.vy += ((by - brush.y) / dt - brush.vy) * follow;
    brush.x = bx;
    brush.y = by;
    const brushSpeed = Math.hypot(brush.vx, brush.vy);
    const cap = brushSpeed > 4 ? 4 / brushSpeed : 1;
    const inBall = Math.exp(-Math.max(0, Math.hypot(bx, by) - 1) * 6);
    const brushPower = pointer.inside ? str * inBall * presence : 0;
    stirEnergy = stirEnergy * Math.exp(-dt / 1.2) + brushPower * Math.min(brushSpeed, 4) * dt;

    if (moving) {
      const pace = 1 + surge * 0.6 + heat.power * heat.near * 0.3;
      const step = dt * Math.max(0, s.speed) * 2 * pace;
      rimTime += step;
      dustTime += dt * Math.max(0, s.dustSpeed) * (1 + surge * 0.4);
      swayClock += dt * Math.max(0, s.dustSpeed);
      const crackleNow = clamp(s.crackle + surge * 0.5, 0, 1.5);
      if (s.sparks > 0.01 && introClock > 0.55) {
        nextArc -= step * s.sparks * 2 * (0.6 + crackleNow * 0.6);
        if (nextArc <= 0) {
          const local = heat.power * heat.near;
          const angle =
            random() < local * 0.7
              ? heat.angle + (random() - 0.5) * 0.8
              : random() < 0.7
                ? Math.PI / 2 + (random() - 0.5) * 1.5
                : random() * Math.PI * 2;
          spawnArc(angle, 0.8 + local * 0.6 + surge * 0.4);
          nextArc = 0.15 + random() * 0.6;
        }
      }
      for (let i = arcs.length - 1; i >= 0; i--) {
        const arc = arcs[i];
        arc.life += step;
        arc.start += arc.drift * step;
        if (arc.life >= arc.duration) arcs.splice(i, 1);
      }
    } else {
      arcs.length = 0;
    }
    for (let i = 0; i < MAX_ARCS; i++) {
      const arc = arcs[i];
      arcData[i * 4] = arc ? arc.start : 0;
      arcData[i * 4 + 1] = arc ? arc.span : 0;
      arcData[i * 4 + 2] = arc ? arc.curl : 0;
      arcData[i * 4 + 3] = arc ? Math.sin((Math.PI * arc.life) / arc.duration) * arc.strength : 0;
    }

    rebuildDust(s.particleCount);
    const palette = s.palette;

    fieldUniforms.uCenter.value = [width / 2, height / 2];
    fieldUniforms.uRadius.value = radius;
    fieldUniforms.uDpr.value = renderer.dpr;
    fieldUniforms.uLine.value = Math.max(0.6, radius * 0.0035);
    fieldUniforms.uTime.value = rimTime;
    fieldUniforms.uFrame.value = Math.floor(rimTime * 24) % 100000;
    fieldUniforms.uBins.value = clamp(Math.round((Math.PI * 2 * radius) / 2.6), 240, 900);
    fieldUniforms.uStrands.value = Math.round(clamp(s.strands, 1, MAX_STRANDS));
    fieldUniforms.uCrackle.value = clamp(s.crackle, 0, 1) + surge * 0.5 + charge;
    fieldUniforms.uFlares.value = clamp(s.flares, 0, 1);
    fieldUniforms.uGlow.value = clamp(s.glow, 0, 2) * (1 + surge * 0.5 + charge) * (s.light ? 0.35 : 1);
    fieldUniforms.uHaze.value = clamp(s.haze, 0, 2) * (s.light ? 0.6 : 1);
    fieldUniforms.uFill.value = clamp(s.fill, 0, 1);
    fieldUniforms.uPresence.value = presence;
    fieldUniforms.uUnfold.value = unfold;
    fieldUniforms.uBloom.value = presence * presence;
    fieldUniforms.uInside.value = smooth(0.2, 0.95, introClock);
    fieldUniforms.uRim.value = palette.rim;
    fieldUniforms.uRimHot.value = palette.rimHot;
    fieldUniforms.uRimMid.value = palette.rimMid;
    fieldUniforms.uRimDeep.value = palette.rimDeep;
    fieldUniforms.uSpark.value = palette.spark;
    fieldUniforms.uSparkGlow.value = palette.sparkGlow;
    fieldUniforms.uHazeColor.value = palette.haze;
    fieldUniforms.uEdgeColor.value = palette.edge;
    fieldUniforms.uHeat.value = [heat.angle, heat.near, heat.power * presence, 0];

    dustShared.uDustTime.value = dustTime;
    const gaze = pointer.inside ? str * presence : 0;
    const lookX = clamp(bx, -1.6, 1.6) * gaze;
    const lookY = clamp(by, -1.6, 1.6) * gaze;
    look.vx += (40 * (lookX - look.x) - 11 * look.vx) * dt;
    look.vy += (40 * (lookY - look.y) - 11 * look.vy) * dt;
    look.x += look.vx * dt;
    look.y += look.vy * dt;
    const swing = clamp(s.sway, 0, 1);
    dustShared.uTurn.value = [
      swing * 0.42 * Math.sin(swayClock * 0.23) + look.x * 0.3,
      swing * 0.12 * Math.sin(swayClock * 0.17 + 1.3) - look.y * 0.16,
    ];
    dustShared.uMotion.value = s.motion;
    dustUniforms.uViewport.value = [width, height];
    dustUniforms.uDepth.value = clamp(s.depth, 0, 1);
    dustUniforms.uTwinkle.value = clamp(s.twinkle, 0, 1);
    dustUniforms.uPointScale.value = Math.max(1, radius / 491);
    dustUniforms.uReveal.value = smooth(0.18, 1, introClock);
    dustUniforms.uTones.value = palette.tones.flat();
    dustUniforms.uRimTone.value = palette.rim;
    dustUniforms.uShape.value = s.particleShape;

    const layer = dust;
    if (layer && stirMesh && (stirEnergy > 0.002 || kick)) stirring = SETTLE_SECONDS;
    let stirred = false;
    if (layer && layer.read && layer.write && stirMesh && stirring > 0) {
      stirUniforms.uDt.value = Math.min(dt, 1 / 30);
      stirUniforms.uBrush.value = [brush.x, brush.y, brush.vx * cap, brush.vy * cap];
      stirUniforms.uBrushPower.value = brushPower;
      stirUniforms.uKick.value = kick ? [kick.x, kick.y, kick.strength, 0] : [0, 0, 0, 0];
      stirUniforms.tOffset.value = layer.read.textures[0];
      stirUniforms.tVelocity.value = layer.read.textures[1];
      renderer.render({ scene: stirMesh, target: layer.write, clear: false });
      const swap = layer.read;
      layer.read = layer.write;
      layer.write = swap;
      stirring -= dt;
      stirred = stirring > 0;
      if (!stirred) {
        stirring = 0;
        resetStir();
      }
    }
    kick = null;
    dustUniforms.uStirred.value = stirred ? 1 : 0;
    dustUniforms.tOffset.value = layer && layer.read ? layer.read.textures[0] : blank;

    gl.clearColor(0, 0, 0, 0);
    renderer.render({ scene: fieldMesh, target: sceneTarget, clear: true });
    if (dust) renderer.render({ scene: dust.mesh, target: sceneTarget, clear: false });

    compositeUniforms.uLight.value = s.light ? 1 : 0;
    renderer.render({ scene: compositeMesh, clear: false });

    const settling =
      Math.abs(target - heat.power) > 0.002 ||
      surge > 0.002 ||
      stirring > 0 ||
      Math.abs(heat.velocity) > 0.01 ||
      Math.hypot(look.vx, look.vy, look.x - lookX, look.y - lookY) > 0.001;
    if (visible && (moving || introClock < 1 || settling)) raf = requestAnimationFrame(frame);
  };

  const start = () => {
    if (raf || !visible || !alive) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };

  const locate = (e: MouseEvent | PointerEvent) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return { x, y, inside: x >= 0 && y >= 0 && x <= rect.width && y <= rect.height };
  };

  const onPointerMove = (e: PointerEvent) => {
    const spot = locate(e);
    if (spot.inside && !pointer.inside) pointer.fresh = true;
    pointer.x = spot.x;
    pointer.y = spot.y;
    pointer.inside = spot.inside;
    if (spot.inside) start();
  };

  const onPointerDown = (e: PointerEvent) => {
    const s = settingsRef.current;
    const spot = locate(e);
    if (!s || !s.interactive || reducedMotion || !spot.inside) return;
    if (!pointer.inside) pointer.fresh = true;
    pointer.x = spot.x;
    pointer.y = spot.y;
    pointer.inside = true;
    const radius = Math.max(8, (clamp(s.size, 0.1, 1.5) * Math.min(width, height)) / 2);
    const kx = (spot.x - width / 2) / radius;
    const ky = (height / 2 - spot.y) / radius;
    const distance = Math.hypot(kx, ky);
    if (distance > 1.3) return;
    const str = clamp(s.hoverStrength, 0, 1);
    kick = { x: kx, y: ky, strength: str * 1.2 };
    surge = Math.max(surge, str);
    const angle = Math.atan2(ky, kx);
    spawnArc(angle + (random() - 0.5) * 0.5, 1.3);
    spawnArc(angle + Math.PI + (random() - 0.5) * 1.2, 1.1);
    start();
  };

  const onPointerLeave = () => {
    pointer.inside = false;
    start();
  };

  const onPointerOut = (e: PointerEvent) => {
    if (!e.relatedTarget) onPointerLeave();
  };

  const onPointerUp = (e: PointerEvent) => {
    if (e.pointerType === 'touch') onPointerLeave();
  };

  const onVisibility = () => {
    if (!document.hidden) start();
  };

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerdown', onPointerDown, { passive: true });
  window.addEventListener('pointerout', onPointerOut, { passive: true });
  window.addEventListener('pointerup', onPointerUp, { passive: true });
  window.addEventListener('blur', onPointerLeave);
  document.addEventListener('visibilitychange', onVisibility);

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    start();
  });
  intersectionObserver.observe(container);

  wakeRef.current = start;
  resize();

  return () => {
    alive = false;
    visible = false;
    cancelAnimationFrame(raf);
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerdown', onPointerDown);
    window.removeEventListener('pointerout', onPointerOut);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('blur', onPointerLeave);
    document.removeEventListener('visibilitychange', onVisibility);
    wakeRef.current = null;
    disposeDust();
    disposeTarget(gl, sceneTarget);
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
  };
}
