import { memo, useEffect, useId, useRef } from "react";
import type { HTMLAttributes } from "react";

interface Dot {
  ax: number;
  ay: number;
  sx: number;
  sy: number;
  vx: number;
  vy: number;
  x: number;
  y: number;
}

interface DotFieldProps extends HTMLAttributes<HTMLDivElement> {
  dotRadius?: number;
  dotSpacing?: number;
  cursorRadius?: number;
  cursorForce?: number;
  bulgeOnly?: boolean;
  bulgeStrength?: number;
  glowRadius?: number;
  sparkle?: boolean;
  waveAmplitude?: number;
  gradientFrom?: string;
  gradientTo?: string;
  glowColor?: string;
  exclusionSelector?: string;
  exclusionStrength?: number;
  exclusionPadding?: number;
}

const TWO_PI = Math.PI * 2;

const DotField = memo(function DotField({
  dotRadius = 1.5,
  dotSpacing = 14,
  cursorRadius = 500,
  cursorForce = 0.1,
  bulgeOnly = true,
  bulgeStrength = 67,
  glowRadius = 160,
  sparkle = false,
  waveAmplitude = 0,
  gradientFrom = "rgba(168, 85, 247, 0.35)",
  gradientTo = "rgba(180, 151, 207, 0.25)",
  glowColor = "#120F17",
  exclusionSelector,
  exclusionStrength = 0,
  exclusionPadding = 60,
  className = "",
  ...rest
}: DotFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glowRef = useRef<SVGCircleElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999, prevX: -9999, prevY: -9999, speed: 0 });
  const rafRef = useRef<number | null>(null);
  const sizeRef = useRef({ width: 0, height: 0 });
  const glowOpacityRef = useRef(0);
  const engagementRef = useRef(0);
  const rebuildRef = useRef<(() => void) | null>(null);
  const glowId = `dot-field-glow-${useId().replace(/:/g, "")}`;
  const propsRef = useRef({
    dotRadius,
    dotSpacing,
    cursorRadius,
    cursorForce,
    bulgeOnly,
    bulgeStrength,
    sparkle,
    waveAmplitude,
    gradientFrom,
    gradientTo,
    exclusionSelector,
    exclusionStrength,
    exclusionPadding,
  });

  useEffect(() => {
    propsRef.current = {
      dotRadius,
      dotSpacing,
      cursorRadius,
      cursorForce,
      bulgeOnly,
      bulgeStrength,
      sparkle,
      waveAmplitude,
      gradientFrom,
      gradientTo,
      exclusionSelector,
      exclusionStrength,
      exclusionPadding,
    };
  }, [
    bulgeOnly,
    bulgeStrength,
    cursorForce,
    cursorRadius,
    dotRadius,
    dotSpacing,
    exclusionPadding,
    exclusionSelector,
    exclusionStrength,
    gradientFrom,
    gradientTo,
    sparkle,
    waveAmplitude,
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const glow = glowRef.current;
    const container = canvas?.parentElement;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !container || !context) return;

    const interactionSurface = container.parentElement ?? container;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let resizeTimer: ReturnType<typeof setTimeout>;
    let frameCount = 0;
    let exclusion = { centerX: 0, centerY: 0, radiusX: 0, radiusY: 0 };

    function updateExclusion() {
      const selector = propsRef.current.exclusionSelector;
      const element = selector ? interactionSurface.querySelector(selector) : null;
      if (!element) {
        exclusion = { centerX: 0, centerY: 0, radiusX: 0, radiusY: 0 };
        return;
      }

      const containerRect = container!.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const padding = propsRef.current.exclusionPadding;
      exclusion = {
        centerX: elementRect.left - containerRect.left + elementRect.width / 2,
        centerY: elementRect.top - containerRect.top + elementRect.height / 2,
        radiusX: elementRect.width / 2 + padding,
        radiusY: elementRect.height / 2 + padding * 0.7,
      };
    }

    function buildDots(width: number, height: number) {
      const { dotRadius: radius, dotSpacing: spacing } = propsRef.current;
      const step = radius + spacing;
      const columns = Math.floor(width / step);
      const rows = Math.floor(height / step);
      const paddingX = (width % step) / 2;
      const paddingY = (height % step) / 2;
      const dots: Dot[] = [];

      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const ax = paddingX + column * step + step / 2;
          const ay = paddingY + row * step + step / 2;
          dots.push({ ax, ay, sx: ax, sy: ay, vx: 0, vy: 0, x: ax, y: ay });
        }
      }

      dotsRef.current = dots;
    }

    function resize() {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        const rect = container!.getBoundingClientRect();
        const width = Math.max(1, rect.width);
        const height = Math.max(1, rect.height);
        canvas!.width = Math.round(width * dpr);
        canvas!.height = Math.round(height * dpr);
        canvas!.style.width = `${width}px`;
        canvas!.style.height = `${height}px`;
        context!.setTransform(dpr, 0, 0, dpr, 0, 0);
        sizeRef.current = { width, height };
        buildDots(width, height);
        updateExclusion();
      }, 100);
    }

    function updatePointer(event: PointerEvent) {
      const rect = container!.getBoundingClientRect();
      mouseRef.current.x = event.clientX - rect.left;
      mouseRef.current.y = event.clientY - rect.top;
    }

    function clearPointer() {
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
      mouseRef.current.prevX = -9999;
      mouseRef.current.prevY = -9999;
      mouseRef.current.speed = 0;
    }

    function updatePointerSpeed() {
      const mouse = mouseRef.current;
      const dx = mouse.prevX - mouse.x;
      const dy = mouse.prevY - mouse.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      mouse.speed += (distance - mouse.speed) * 0.5;
      if (mouse.speed < 0.001) mouse.speed = 0;
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;
    }

    const speedInterval = window.setInterval(updatePointerSpeed, 20);

    function tick() {
      frameCount += 1;
      const dots = dotsRef.current;
      const mouse = mouseRef.current;
      const { width, height } = sizeRef.current;
      const settings = propsRef.current;
      const time = frameCount * 0.02;

      if (frameCount % 20 === 0) updateExclusion();

      const targetEngagement = Math.min(mouse.speed / 5, 1);
      engagementRef.current += (targetEngagement - engagementRef.current) * 0.06;
      if (engagementRef.current < 0.001) engagementRef.current = 0;
      const engagement = engagementRef.current;

      glowOpacityRef.current += (engagement - glowOpacityRef.current) * 0.08;
      if (glow) {
        glow.setAttribute("cx", String(mouse.x));
        glow.setAttribute("cy", String(mouse.y));
        glow.style.opacity = String(glowOpacityRef.current);
      }

      context!.clearRect(0, 0, width, height);
      const gradient = context!.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, settings.gradientFrom);
      gradient.addColorStop(1, settings.gradientTo);
      context!.fillStyle = gradient;

      const cursorRadiusSquared = settings.cursorRadius * settings.cursorRadius;
      const radius = settings.dotRadius / 2;
      context!.beginPath();

      for (let index = 0; index < dots.length; index += 1) {
        const dot = dots[index];
        let targetX = dot.ax;
        let targetY = dot.ay;

        if (exclusion.radiusX > 0 && exclusion.radiusY > 0) {
          const exclusionX = dot.ax - exclusion.centerX;
          const exclusionY = dot.ay - exclusion.centerY;
          const normalizedX = exclusionX / exclusion.radiusX;
          const normalizedY = exclusionY / exclusion.radiusY;
          const normalizedDistance = Math.sqrt(
            normalizedX * normalizedX + normalizedY * normalizedY,
          );

          if (normalizedDistance < 1.35) {
            const direction = Math.atan2(
              exclusionY / exclusion.radiusY,
              exclusionX / exclusion.radiusX,
            );
            const falloff = Math.max(0, 1 - normalizedDistance / 1.35);
            const scatter = settings.exclusionStrength * falloff * falloff;
            targetX += Math.cos(direction) * scatter;
            targetY += Math.sin(direction) * scatter * 0.72;
          }
        }

        const dx = mouse.x - dot.ax;
        const dy = mouse.y - dot.ay;
        const distanceSquared = dx * dx + dy * dy;

        if (distanceSquared < cursorRadiusSquared && engagement > 0.01) {
          const distance = Math.max(1, Math.sqrt(distanceSquared));
          const angle = Math.atan2(dy, dx);

          if (settings.bulgeOnly) {
            const falloff = 1 - distance / settings.cursorRadius;
            const push = falloff * falloff * settings.bulgeStrength * engagement;
            targetX -= Math.cos(angle) * push;
            targetY -= Math.sin(angle) * push;
          } else {
            const move = (500 / distance) * (mouse.speed * settings.cursorForce);
            dot.vx -= Math.cos(angle) * move;
            dot.vy -= Math.sin(angle) * move;
          }
        }

        if (settings.bulgeOnly) {
          dot.sx += (targetX - dot.sx) * 0.13;
          dot.sy += (targetY - dot.sy) * 0.13;
        } else {
          dot.vx *= 0.9;
          dot.vy *= 0.9;
          dot.x = targetX + dot.vx;
          dot.y = targetY + dot.vy;
          dot.sx += (dot.x - dot.sx) * 0.1;
          dot.sy += (dot.y - dot.sy) * 0.1;
        }

        let drawX = dot.sx;
        let drawY = dot.sy;
        if (settings.waveAmplitude > 0) {
          drawY += Math.sin(dot.ax * 0.03 + time) * settings.waveAmplitude;
          drawX += Math.cos(dot.ay * 0.03 + time * 0.7) * settings.waveAmplitude * 0.5;
        }

        const sparkles = settings.sparkle && ((index * 2654435761) ^ (frameCount >> 3)) % 100 < 3;
        const drawRadius = sparkles ? radius * 1.8 : radius;
        context!.moveTo(drawX + drawRadius, drawY);
        context!.arc(drawX, drawY, drawRadius, 0, TWO_PI);
      }

      context!.fill();
      rafRef.current = window.requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener("resize", resize, { passive: true });
    interactionSurface.addEventListener("pointermove", updatePointer, { passive: true });
    interactionSurface.addEventListener("pointerleave", clearPointer, { passive: true });
    rafRef.current = window.requestAnimationFrame(tick);
    rebuildRef.current = () => buildDots(sizeRef.current.width, sizeRef.current.height);

    return () => {
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
      window.clearInterval(speedInterval);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", resize);
      interactionSurface.removeEventListener("pointermove", updatePointer);
      interactionSurface.removeEventListener("pointerleave", clearPointer);
    };
  }, []);

  useEffect(() => {
    rebuildRef.current?.();
  }, [dotRadius, dotSpacing]);

  return (
    <div className={`dot-field-container ${className}`.trim()} {...rest}>
      <canvas ref={canvasRef} className="dot-field-canvas" aria-hidden="true" />
      <svg className="dot-field-glow" aria-hidden="true">
        <defs>
          <radialGradient id={glowId}>
            <stop offset="0%" stopColor={glowColor} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <circle
          ref={glowRef}
          cx="-9999"
          cy="-9999"
          r={glowRadius}
          fill={`url(#${glowId})`}
        />
      </svg>
    </div>
  );
});

export default DotField;
