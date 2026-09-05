"use client";

import * as React from "react";

interface Node {
  x: number; // 0..1 normalized
  y: number; // 0..1 normalized
  name: string;
  division: string;
  isMajor: boolean;
  pulsePhase: number;
  pulseSpeed: number;
  baseRadius: number;
}

// Normalized geographic centroids for key Bangladesh dispatch nodes
const BANGLADESH_NODES: Node[] = [
  { x: 0.52, y: 0.50, name: "Dhaka", division: "Dhaka", isMajor: true, pulsePhase: 0, pulseSpeed: 0.02, baseRadius: 5 },
  { x: 0.72, y: 0.72, name: "Chittagong", division: "Chittagong", isMajor: true, pulsePhase: 1.2, pulseSpeed: 0.018, baseRadius: 4.5 },
  { x: 0.30, y: 0.38, name: "Rajshahi", division: "Rajshahi", isMajor: true, pulsePhase: 2.1, pulseSpeed: 0.022, baseRadius: 4 },
  { x: 0.38, y: 0.70, name: "Khulna", division: "Khulna", isMajor: true, pulsePhase: 0.7, pulseSpeed: 0.019, baseRadius: 4 },
  { x: 0.78, y: 0.32, name: "Sylhet", division: "Sylhet", isMajor: true, pulsePhase: 1.8, pulseSpeed: 0.025, baseRadius: 4 },
  { x: 0.48, y: 0.78, name: "Barisal", division: "Barisal", isMajor: true, pulsePhase: 3.0, pulseSpeed: 0.017, baseRadius: 3.5 },
  { x: 0.28, y: 0.20, name: "Rangpur", division: "Rangpur", isMajor: true, pulsePhase: 0.4, pulseSpeed: 0.021, baseRadius: 3.5 },
  { x: 0.52, y: 0.32, name: "Mymensingh", division: "Mymensingh", isMajor: true, pulsePhase: 2.7, pulseSpeed: 0.023, baseRadius: 3.5 },
  // Satellite relay nodes
  { x: 0.58, y: 0.44, name: "Gazipur", division: "Dhaka", isMajor: false, pulsePhase: 0.9, pulseSpeed: 0.02, baseRadius: 2.5 },
  { x: 0.54, y: 0.54, name: "Narayanganj", division: "Dhaka", isMajor: false, pulsePhase: 1.5, pulseSpeed: 0.02, baseRadius: 2.5 },
  { x: 0.65, y: 0.55, name: "Comilla", division: "Chittagong", isMajor: false, pulsePhase: 2.3, pulseSpeed: 0.019, baseRadius: 3 },
  { x: 0.38, y: 0.28, name: "Bogra", division: "Rajshahi", isMajor: false, pulsePhase: 0.3, pulseSpeed: 0.022, baseRadius: 2.5 },
  { x: 0.40, y: 0.58, name: "Faridpur", division: "Dhaka", isMajor: false, pulsePhase: 1.7, pulseSpeed: 0.018, baseRadius: 2.5 },
  { x: 0.78, y: 0.85, name: "Cox's Bazar", division: "Chittagong", isMajor: false, pulsePhase: 2.8, pulseSpeed: 0.024, baseRadius: 3 },
];

interface EmergencyRadarCanvasProps {
  selectedDistrict?: string;
  selectedBloodGroup?: string;
  className?: string;
}

export function EmergencyRadarCanvas({
  selectedDistrict,
  selectedBloodGroup,
  className = "",
}: EmergencyRadarCanvasProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const mousePos = React.useRef<{ x: number; y: number } | null>(null);
  const animationFrameId = React.useRef<number | null>(null);
  const isVisibleRef = React.useRef(true);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    // Track visibility to pause RAF
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry?.isIntersecting ?? false;
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    let radarAngle = 0;

    const render = () => {
      if (!isVisibleRef.current) {
        animationFrameId.current = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Radar Sweep Angle (increment only if not reduced motion)
      if (!prefersReducedMotion) {
        radarAngle += 0.008;
        if (radarAngle > Math.PI * 2) radarAngle -= Math.PI * 2;
      }

      const isDarkMode = document.documentElement.classList.contains("dark");
      const gridColor = isDarkMode ? "rgba(255, 255, 255, 0.012)" : "rgba(30, 20, 40, 0.012)";
      const lineColor = isDarkMode ? "rgba(230, 50, 70, 0.04)" : "rgba(200, 30, 50, 0.03)";
      const activeLineColor = isDarkMode ? "rgba(230, 50, 70, 0.2)" : "rgba(200, 30, 50, 0.15)";
      const beaconColor = isDarkMode ? "rgba(240, 60, 80, 0.65)" : "rgba(210, 35, 55, 0.65)";
      const tealColor = isDarkMode ? "rgba(60, 200, 180, 0.5)" : "rgba(20, 140, 120, 0.5)";

      // Draw subtle telemetry coordinate grid lines
      const gridSize = 56;
      ctx.beginPath();
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Transform nodes into canvas coordinates
      // Map nodes into a focused interactive coordinate space in right/center
      const offsetX = width * 0.15;
      const mapWidth = width * 0.7;
      const offsetY = height * 0.1;
      const mapHeight = height * 0.8;

      const screenNodes = BANGLADESH_NODES.map((node) => {
        const x = offsetX + node.x * mapWidth;
        const y = offsetY + node.y * mapHeight;
        const isMatchedDistrict = Boolean(
          selectedDistrict &&
          (node.name.toLowerCase() === selectedDistrict.toLowerCase() ||
           node.division.toLowerCase() === selectedDistrict.toLowerCase())
        );
        return { ...node, screenX: x, screenY: y, isMatchedDistrict };
      });

      // Draw mesh connections between neighboring nodes
      for (let i = 0; i < screenNodes.length; i++) {
        for (let j = i + 1; j < screenNodes.length; j++) {
          const n1 = screenNodes[i]!;
          const n2 = screenNodes[j]!;
          const dx = n1.screenX - n2.screenX;
          const dy = n1.screenY - n2.screenY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 180) {
            const isHighPriority = n1.isMatchedDistrict || n2.isMatchedDistrict || Boolean(selectedBloodGroup);
            ctx.beginPath();
            ctx.strokeStyle = isHighPriority ? activeLineColor : lineColor;
            ctx.lineWidth = isHighPriority ? 1 : 0.6;
            ctx.moveTo(n1.screenX, n1.screenY);
            ctx.lineTo(n2.screenX, n2.screenY);
            ctx.stroke();
          }
        }
      }

      // Draw dynamic mouse connection
      if (mousePos.current) {
        const mx = mousePos.current.x;
        const my = mousePos.current.y;
        for (const node of screenNodes) {
          const dx = node.screenX - mx;
          const dy = node.screenY - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.12;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(230, 50, 70, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(node.screenX, node.screenY);
            ctx.lineTo(mx, my);
            ctx.stroke();
          }
        }
      }

      // Draw nodes and pulse rings
      for (const node of screenNodes) {
        if (!prefersReducedMotion) {
          node.pulsePhase += node.pulseSpeed;
          if (node.pulsePhase > Math.PI * 2) node.pulsePhase -= Math.PI * 2;
        }

        const isHighlighted = node.isMatchedDistrict || (selectedBloodGroup && node.isMajor);
        const radius = isHighlighted ? node.baseRadius * 1.2 : node.baseRadius * 0.8;

        // Outer beacon wave
        if (!prefersReducedMotion) {
          const waveRadius = radius + (Math.sin(node.pulsePhase) + 1) * 6;
          const waveOpacity = 0.25 * (1 - (waveRadius - radius) / 14);
          ctx.beginPath();
          ctx.arc(node.screenX, node.screenY, waveRadius, 0, Math.PI * 2);
          ctx.strokeStyle = isHighlighted ? `rgba(230, 50, 70, ${waveOpacity})` : `rgba(60, 200, 180, ${waveOpacity * 0.4})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }

        // Core Node
        ctx.beginPath();
        ctx.arc(node.screenX, node.screenY, radius, 0, Math.PI * 2);
        ctx.fillStyle = isHighlighted ? beaconColor : node.isMajor ? tealColor : isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)";
        ctx.fill();

        // Node targeting label on active highlight
        if (isHighlighted) {
          ctx.font = `600 9px monospace`;
          ctx.fillStyle = beaconColor;
          ctx.fillText(node.name.toUpperCase(), node.screenX + radius + 4, node.screenY + 3);
        }

        // Active Reticle for targeted district
        if (node.isMatchedDistrict) {
          ctx.beginPath();
          ctx.arc(node.screenX, node.screenY, radius + 10, 0, Math.PI * 2);
          ctx.strokeStyle = beaconColor;
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      if (!prefersReducedMotion) {
        animationFrameId.current = requestAnimationFrame(render);
      }
    };

    render();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mousePos.current = null;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      observer.disconnect();
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [selectedDistrict, selectedBloodGroup]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-auto absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
    />
  );
}
