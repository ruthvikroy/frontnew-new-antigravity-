import React, { useEffect, useRef, useState } from 'react';

export function CelestialRadar({ focusedPair, onSelectPair, allPairs }) {
  const earthCanvasRef = useRef(null);
  const moonCanvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const rotationAngleRef = useRef(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isDraggingEarth, setIsDraggingEarth] = useState(false);
  const [isDraggingMoon, setIsDraggingMoon] = useState(false);
  const lastMouseXRef = useRef(0);

  useEffect(() => {
    let isMounted = true;
    let lastTime = 0;

    const renderSpheres = (time) => {
      if (isMounted) {
        animationFrameRef.current = requestAnimationFrame(renderSpheres);
      }
      if (time && time - lastTime < 32) return;
      lastTime = time || 0;

      if (autoRotate && !isDraggingEarth && !isDraggingMoon) {
        rotationAngleRef.current += 0.003;
      }

      // Draw Earth Canvas
      const earthCanvas = earthCanvasRef.current;
      if (earthCanvas) {
        const ctx = earthCanvas.getContext('2d');
        if (ctx) {
          const width = earthCanvas.width;
          const height = earthCanvas.height;
          const cx = width / 2;
          const cy = height / 2;
          const radius = width * 0.38;

          ctx.clearRect(0, 0, width, height);

          // Atmosphere subtle glow
          const grad = ctx.createRadialGradient(cx, cy, radius * 0.7, cx, cy, radius * 1.15);
          grad.addColorStop(0, 'rgba(170, 136, 255, 0.08)');
          grad.addColorStop(0.8, 'rgba(170, 136, 255, 0.12)');
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(cx, cy, radius * 1.15, 0, Math.PI * 2);
          ctx.fill();

          // Globe outline
          ctx.strokeStyle = 'rgba(170, 136, 255, 0.45)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.stroke();

          // Latitude parallels
          ctx.strokeStyle = 'rgba(170, 136, 255, 0.16)';
          ctx.lineWidth = 0.8;
          [-60, -30, 0, 30, 60].forEach((lat) => {
            const y = cy - radius * Math.sin((lat * Math.PI) / 180);
            const rLat = radius * Math.cos((lat * Math.PI) / 180);
            ctx.beginPath();
            ctx.ellipse(cx, y, rLat, rLat * 0.28, 0, 0, Math.PI * 2);
            ctx.stroke();
          });

          // Longitude meridians rotating
          for (let lon = 0; lon < 360; lon += 45) {
            const currentLonRad = (lon * Math.PI) / 180 + rotationAngleRef.current;
            const xOffset = Math.sin(currentLonRad) * radius;
            const isVisible = Math.cos(currentLonRad) > 0;
            if (isVisible) {
              ctx.strokeStyle = 'rgba(170, 136, 255, 0.18)';
              ctx.beginPath();
              ctx.ellipse(cx, cy, Math.abs(xOffset), radius, 0, 0, Math.PI * 2);
              ctx.stroke();
            }
          }

          // Render terrestrial hotspots
          if (allPairs) {
            allPairs.forEach((pair) => {
              const isCurrent = pair.id === focusedPair.id;
              const targetLat = pair.earth.latitude;
              const targetLon = pair.earth.longitude;
              const latRad = (targetLat * Math.PI) / 180;
              const lonRad = (targetLon * Math.PI) / 180 + rotationAngleRef.current;

              if (Math.cos(lonRad) > -0.2) {
                const targetX = cx + Math.sin(lonRad) * radius * Math.cos(latRad);
                const targetY = cy - Math.sin(latRad) * radius;

                if (isCurrent) {
                  const pulse = (Math.sin(Date.now() / 200) + 1) * 3 + 4;
                  ctx.strokeStyle = '#aa88ff';
                  ctx.lineWidth = 1.5;
                  ctx.beginPath();
                  ctx.arc(targetX, targetY, pulse, 0, Math.PI * 2);
                  ctx.stroke();

                  ctx.fillStyle = '#aa88ff';
                  ctx.beginPath();
                  ctx.arc(targetX, targetY, 3, 0, Math.PI * 2);
                  ctx.fill();

                  // Crosshair ticks
                  ctx.beginPath();
                  ctx.moveTo(targetX - 9, targetY);
                  ctx.lineTo(targetX + 9, targetY);
                  ctx.moveTo(targetX, targetY - 9);
                  ctx.lineTo(targetX + 9, targetY);
                  ctx.stroke();
                } else {
                  ctx.fillStyle = 'rgba(170, 136, 255, 0.4)';
                  ctx.beginPath();
                  ctx.arc(targetX, targetY, 2, 0, Math.PI * 2);
                  ctx.fill();
                }
              }
            });
          }
        }
      }

      // Draw Moon Canvas
      const moonCanvas = moonCanvasRef.current;
      if (moonCanvas) {
        const ctx = moonCanvas.getContext('2d');
        if (ctx) {
          const width = moonCanvas.width;
          const height = moonCanvas.height;
          const cx = width / 2;
          const cy = height / 2;
          const radius = width * 0.38;

          ctx.clearRect(0, 0, width, height);

          // Subtle lunar aura
          const grad = ctx.createRadialGradient(cx, cy, radius * 0.7, cx, cy, radius * 1.15);
          grad.addColorStop(0, 'rgba(170, 136, 255, 0.06)');
          grad.addColorStop(0.8, 'rgba(170, 136, 255, 0.12)');
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(cx, cy, radius * 1.15, 0, Math.PI * 2);
          ctx.fill();

          // Globe outline
          ctx.strokeStyle = 'rgba(170, 136, 255, 0.45)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.stroke();

          // Lunar Parallels
          ctx.strokeStyle = 'rgba(170, 136, 255, 0.16)';
          ctx.lineWidth = 0.8;
          [-60, -30, 0, 30, 60].forEach((lat) => {
            const y = cy - radius * Math.sin((lat * Math.PI) / 180);
            const rLat = radius * Math.cos((lat * Math.PI) / 180);
            ctx.beginPath();
            ctx.ellipse(cx, y, rLat, rLat * 0.28, 0, 0, Math.PI * 2);
            ctx.stroke();
          });

          // Lunar Meridians
          const lunarRotation = rotationAngleRef.current * 0.2;
          for (let lon = 0; lon < 360; lon += 45) {
            const currentLonRad = (lon * Math.PI) / 180 + lunarRotation;
            const xOffset = Math.sin(currentLonRad) * radius;
            const isVisible = Math.cos(currentLonRad) > 0;
            if (isVisible) {
              ctx.strokeStyle = 'rgba(170, 136, 255, 0.18)';
              ctx.beginPath();
              ctx.ellipse(cx, cy, Math.abs(xOffset), radius, 0, 0, Math.PI * 2);
              ctx.stroke();
            }
          }

          // Render lunar hotspots
          if (allPairs) {
            allPairs.forEach((pair) => {
              const isCurrent = pair.id === focusedPair.id;
              const targetLat = pair.moon.latitude;
              const targetLon = pair.moon.longitude;
              const latRad = (targetLat * Math.PI) / 180;
              const lonRad = (targetLon * Math.PI) / 180 + lunarRotation;

              if (Math.cos(lonRad) > -0.2) {
                const targetX = cx + Math.sin(lonRad) * radius * Math.cos(latRad);
                const targetY = cy - Math.sin(latRad) * radius;

                if (isCurrent) {
                  const pulse = (Math.sin(Date.now() / 200) + 1) * 3 + 4;
                  ctx.strokeStyle = '#aa88ff';
                  ctx.lineWidth = 1.5;
                  ctx.beginPath();
                  ctx.arc(targetX, targetY, pulse, 0, Math.PI * 2);
                  ctx.stroke();

                  ctx.fillStyle = '#aa88ff';
                  ctx.beginPath();
                  ctx.arc(targetX, targetY, 3, 0, Math.PI * 2);
                  ctx.fill();

                  // Crosshair ticks
                  ctx.beginPath();
                  ctx.moveTo(targetX - 9, targetY);
                  ctx.lineTo(targetX + 9, targetY);
                  ctx.moveTo(targetX, targetY - 9);
                  ctx.lineTo(targetX + 9, targetY);
                  ctx.stroke();
                } else {
                  ctx.fillStyle = 'rgba(170, 136, 255, 0.4)';
                  ctx.beginPath();
                  ctx.arc(targetX, targetY, 2, 0, Math.PI * 2);
                  ctx.fill();
                }
              }
            });
          }
        }
      }
    };

    animationFrameRef.current = requestAnimationFrame(renderSpheres);

    return () => {
      isMounted = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [focusedPair, allPairs, autoRotate, isDraggingEarth, isDraggingMoon]);

  const handleMouseDown = (e, isEarth) => {
    lastMouseXRef.current = e.clientX;
    if (isEarth) setIsDraggingEarth(true);
    else setIsDraggingMoon(true);
  };

  const handleMouseMove = (e) => {
    if (!isDraggingEarth && !isDraggingMoon) return;
    const deltaX = e.clientX - lastMouseXRef.current;
    lastMouseXRef.current = e.clientX;
    rotationAngleRef.current += deltaX * 0.01;
  };

  const handleMouseUp = () => {
    setIsDraggingEarth(false);
    setIsDraggingMoon(false);
  };

  return (
    <section
      id="radar"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="w-full border-b border-[var(--line)] bg-[var(--background)] py-8 px-6"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-[var(--line)]">
          <div>
            <div className="flex items-center gap-2 text-[var(--muted)] uppercase tracking-wider mb-1">
              <span>Celestial Telemetry Vector Reticle</span>
              <span>•</span>
              <span className="text-[var(--accent)]">Interactive Dual Projection</span>
            </div>
            <h2 className="font-bold text-[var(--accent)] tracking-tight">
              {focusedPair.title}
            </h2>
            <p className="text-[var(--muted)] mt-1 max-w-2xl">
              {focusedPair.thematicParallels}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setAutoRotate((prev) => !prev)}
              className={`px-3 py-1.5 rounded border transition-colors cursor-pointer ${
                autoRotate
                  ? 'bg-[var(--chip)] text-[var(--accent)] border-[var(--accent)]'
                  : 'bg-[var(--chip)] text-[var(--muted)] border-[var(--line)] hover:text-[var(--text)]'
              }`}
            >
              Orbit: {autoRotate ? 'AUTO' : 'MANUAL DRAG'}
            </button>

            <div className="flex items-center gap-6 bg-[var(--chip)] px-4 py-2 rounded border border-[var(--line)]">
              <div>
                <div className="text-[var(--muted)] uppercase tracking-widest">Earth Vector</div>
                <div className="text-[var(--accent)] font-medium">{focusedPair.earth.coordinatesFormatted}</div>
              </div>
              <div className="w-px h-6 bg-[var(--line)]" />
              <div>
                <div className="text-[var(--muted)] uppercase tracking-widest">Moon Vector</div>
                <div className="text-[var(--accent)] font-medium">{focusedPair.moon.coordinatesFormatted}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Dual Orthographic Spheres */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          {/* Earth Telemetry Sphere */}
          <div className="flex items-center gap-6 bg-[var(--chip)] border border-[var(--line)] p-5 rounded relative overflow-hidden group hover:border-[var(--accent)] transition-colors">
            <div
              className="relative w-36 h-36 shrink-0 cursor-grab active:cursor-grabbing"
              onMouseDown={(e) => handleMouseDown(e, true)}
              title="Click & drag to rotate Earth sphere"
            >
              <canvas
                ref={earthCanvasRef}
                width={144}
                height={144}
                className="w-full h-full block"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="tracking-widest text-[var(--accent)] uppercase mb-1 flex items-center justify-between">
                <span>TERRESTRIAL // {focusedPair.earth.designation}</span>
                <span className="text-[var(--muted)]">DRAG TO ROTATE</span>
              </div>
              <h3 className="font-bold text-[var(--text)] truncate">
                {focusedPair.earth.name}
              </h3>
              <div className="text-[var(--muted)] mb-3 truncate">
                {focusedPair.earth.region}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-black p-2 rounded border border-[var(--line)]">
                  <span className="text-[var(--muted)] block">Elevation</span>
                  <span className="text-[var(--text)] font-medium">
                    {focusedPair.earth.metrics.elevationMeters > 0 ? '+' : ''}
                    {focusedPair.earth.metrics.elevationMeters.toLocaleString()} M
                  </span>
                </div>
                <div className="bg-black p-2 rounded border border-[var(--line)]">
                  <span className="text-[var(--muted)] block">Temp Range</span>
                  <span className="text-[var(--accent)] font-medium">
                    {focusedPair.earth.metrics.tempMinCelsius}°C TO {focusedPair.earth.metrics.tempMaxCelsius}°C
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Moon Telemetry Sphere */}
          <div className="flex items-center gap-6 bg-[var(--chip)] border border-[var(--line)] p-5 rounded relative overflow-hidden group hover:border-[var(--accent)] transition-colors">
            <div
              className="relative w-36 h-36 shrink-0 cursor-grab active:cursor-grabbing"
              onMouseDown={(e) => handleMouseDown(e, false)}
              title="Click & drag to rotate Moon sphere"
            >
              <canvas
                ref={moonCanvasRef}
                width={144}
                height={144}
                className="w-full h-full block"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="tracking-widest text-[var(--accent)] uppercase mb-1 flex items-center justify-between">
                <span>SELENOLOGICAL // {focusedPair.moon.designation}</span>
                <span className="text-[var(--muted)]">DRAG TO ROTATE</span>
              </div>
              <h3 className="font-bold text-[var(--text)] truncate">
                {focusedPair.moon.name}
              </h3>
              <div className="text-[var(--muted)] mb-3 truncate">
                {focusedPair.moon.region}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-black p-2 rounded border border-[var(--line)]">
                  <span className="text-[var(--muted)] block">Elevation Datum</span>
                  <span className="text-[var(--text)] font-medium">
                    {focusedPair.moon.metrics.elevationMeters > 0 ? '+' : ''}
                    {focusedPair.moon.metrics.elevationMeters.toLocaleString()} M
                  </span>
                </div>
                <div className="bg-black p-2 rounded border border-[var(--line)]">
                  <span className="text-[var(--muted)] block">Temp Range</span>
                  <span className="text-[var(--accent)] font-medium">
                    {focusedPair.moon.metrics.tempMinCelsius}°C TO {focusedPair.moon.metrics.tempMaxCelsius}°C
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
