import * as THREE from 'three';

/**
 * Procedural High-Fidelity Mars Surface Texture & Bump Generator
 * Generates scientifically grounded equirectangular albedo and bump textures
 * depicting major Martian geographical features:
 * - Tharsis Bulge and Olympus Mons
 * - Valles Marineris canyon system
 * - Syrtis Major Planum dark basaltic albedo
 * - Hellas Planitia impact basin
 * - Gale and Jezero craters
 * - North and South polar ice caps with spiral chasmata
 */

export function createMarsTextures(isSoftwareGl = false) {
  const width = isSoftwareGl ? 1024 : 2048;
  const height = isSoftwareGl ? 512 : 1024;

  const albedoCanvas = document.createElement('canvas');
  albedoCanvas.width = width;
  albedoCanvas.height = height;
  const ctx = albedoCanvas.getContext('2d', { willReadFrequently: true });

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = width;
  bumpCanvas.height = height;
  const bumpCtx = bumpCanvas.getContext('2d', { willReadFrequently: true });

  if (!ctx || !bumpCtx) {
    // Fallback minimal texture if canvas 2D fails
    const fallback = new THREE.CanvasTexture(document.createElement('canvas'));
    return { albedoTexture: fallback, bumpTexture: fallback };
  }

  // 1. Base Martian Rust / Oxidized Regolith Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, '#f8fafc');    // North Pole ice fringe
  bgGrad.addColorStop(0.12, '#cf7848'); // Northern lowlands (Vastitas Borealis)
  bgGrad.addColorStop(0.48, '#bd6332'); // Equatorial transition
  bgGrad.addColorStop(0.55, '#a44c20'); // Southern cratered highlands
  bgGrad.addColorStop(0.88, '#923c16'); // Sub-polar southern terrain
  bgGrad.addColorStop(1.0, '#f8fafc');  // South Pole ice cap
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Bump base (neutral gray 128)
  bumpCtx.fillStyle = '#808080';
  bumpCtx.fillRect(0, 0, width, height);

  // Helper: map Lat (-90 to +90) and Lon (-180 to +180) to canvas (x, y)
  const mapCoords = (lat, lon) => {
    const x = ((lon + 180) / 360) * width;
    const y = ((90 - lat) / 180) * height;
    return [x, y];
  };

  // 2. Procedural Fractal Noise & Surface Patchiness
  const imgData = ctx.getImageData(0, 0, width, height);
  const bumpData = bumpCtx.getImageData(0, 0, width, height);
  const data = imgData.data;
  const bData = bumpData.data;

  const pseudoNoise = (x, y) => {
    const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453123;
    return n - Math.floor(n);
  };

  const step = isSoftwareGl ? 4 : 2;
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const n1 = pseudoNoise(Math.floor(x / 16), Math.floor(y / 16));
      const n2 = pseudoNoise(Math.floor(x / 8), Math.floor(y / 8));
      const n3 = pseudoNoise(Math.floor(x / 4), Math.floor(y / 4));
      const noise = (n1 * 0.5 + n2 * 0.35 + n3 * 0.15 - 0.5) * 35;

      for (let dy = 0; dy < step && y + dy < height; dy++) {
        for (let dx = 0; dx < step && x + dx < width; dx++) {
          const idx = ((y + dy) * width + (x + dx)) * 4;
          data[idx] = Math.min(255, Math.max(0, data[idx] + noise * 0.9));
          data[idx + 1] = Math.min(255, Math.max(0, data[idx + 1] + noise * 0.6));
          data[idx + 2] = Math.min(255, Math.max(0, data[idx + 2] + noise * 0.4));

          const bVal = Math.min(255, Math.max(0, 128 + noise * 1.5));
          bData[idx] = bVal;
          bData[idx + 1] = bVal;
          bData[idx + 2] = bVal;
        }
      }
    }
  }
  ctx.putImageData(imgData, 0, 0);
  bumpCtx.putImageData(bumpData, 0, 0);

  // 3. Syrtis Major Planum (Dark Basaltic Albedo Shield: Lon ~70° E, Lat ~10° N)
  {
    const [sx, sy] = mapCoords(10, 70);
    const radX = width * 0.08;
    const radY = height * 0.12;
    const syrtisGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, radX);
    syrtisGrad.addColorStop(0, '#36150a');
    syrtisGrad.addColorStop(0.6, '#4e1e0e');
    syrtisGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = syrtisGrad;
    ctx.beginPath();
    ctx.ellipse(sx, sy, radX, radY, -0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // 4. Hellas Planitia (Deep Impact Basin: Lon ~70° E, Lat ~-42° S)
  {
    const [hx, hy] = mapCoords(-42, 70);
    const rad = width * 0.07;
    const hellasGrad = ctx.createRadialGradient(hx, hy, 0, hx, hy, rad);
    hellasGrad.addColorStop(0, '#caa278'); // Light dust-filled basin
    hellasGrad.addColorStop(0.7, '#a85b2e');
    hellasGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = hellasGrad;
    ctx.beginPath();
    ctx.arc(hx, hy, rad, 0, Math.PI * 2);
    ctx.fill();

    const bHell = bumpCtx.createRadialGradient(hx, hy, 0, hx, hy, rad);
    bHell.addColorStop(0, '#505050');
    bHell.addColorStop(0.85, '#a0a0a0');
    bHell.addColorStop(1, 'transparent');
    bumpCtx.fillStyle = bHell;
    bumpCtx.beginPath();
    bumpCtx.arc(hx, hy, rad, 0, Math.PI * 2);
    bumpCtx.fill();
  }

  // 5. Tharsis Volcanic Plateau & Olympus Mons (Lon -133.8° W, Lat 18.65° N)
  {
    const [tx, ty] = mapCoords(0, -110);
    const tharsisRad = width * 0.18;
    const bTharsis = bumpCtx.createRadialGradient(tx, ty, 0, tx, ty, tharsisRad);
    bTharsis.addColorStop(0, '#c8c8c8');
    bTharsis.addColorStop(1, 'transparent');
    bumpCtx.fillStyle = bTharsis;
    bumpCtx.beginPath();
    bumpCtx.arc(tx, ty, tharsisRad, 0, Math.PI * 2);
    bumpCtx.fill();

    const [ox, oy] = mapCoords(18.65, -133.8);
    const oRad = width * 0.04;
    const oGrad = ctx.createRadialGradient(ox, oy, 0, ox, oy, oRad);
    oGrad.addColorStop(0, '#2d140b');  // Caldera complex
    oGrad.addColorStop(0.2, '#aa4a1e'); // Flank slopes
    oGrad.addColorStop(0.85, '#d47844'); // Basal scarp highlight
    oGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = oGrad;
    ctx.beginPath();
    ctx.arc(ox, oy, oRad, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#1a0b06';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(ox, oy, oRad * 0.18, 0, Math.PI * 2);
    ctx.stroke();

    const bOly = bumpCtx.createRadialGradient(ox, oy, 0, ox, oy, oRad);
    bOly.addColorStop(0, '#202020');
    bOly.addColorStop(0.2, '#ffffff');
    bOly.addColorStop(0.85, '#f0f0f0');
    bOly.addColorStop(0.9, '#404040');
    bOly.addColorStop(1, 'transparent');
    bumpCtx.fillStyle = bOly;
    bumpCtx.beginPath();
    bumpCtx.arc(ox, oy, oRad, 0, Math.PI * 2);
    bumpCtx.fill();
  }

  // 6. Tharsis Montes Triplets (Ascraeus, Pavonis, Arsia Mons)
  const montes = [
    { lat: 11.9, lon: -104.5, name: 'Ascraeus' },
    { lat: 0.8, lon: -112.9, name: 'Pavonis' },
    { lat: -8.4, lon: -121.1, name: 'Arsia' },
  ];
  montes.forEach((m) => {
    const [mx, my] = mapCoords(m.lat, m.lon);
    const mRad = width * 0.022;
    const grad = ctx.createRadialGradient(mx, my, 0, mx, my, mRad);
    grad.addColorStop(0, '#35160c');
    grad.addColorStop(0.3, '#9d431a');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(mx, my, mRad, 0, Math.PI * 2);
    ctx.fill();

    const bGrad = bumpCtx.createRadialGradient(mx, my, 0, mx, my, mRad);
    bGrad.addColorStop(0, '#404040');
    bGrad.addColorStop(0.3, '#f5f5f5');
    bGrad.addColorStop(1, 'transparent');
    bumpCtx.fillStyle = bGrad;
    bumpCtx.beginPath();
    bumpCtx.arc(mx, my, mRad, 0, Math.PI * 2);
    bumpCtx.fill();
  });

  // 7. Valles Marineris (Great Equatorial Canyon: Lat -14°, Lon -90° to -30°)
  {
    const [vStartX, vStartY] = mapCoords(-10, -95);
    const [vMidX, vMidY] = mapCoords(-14, -60);
    const [vEndX, vEndY] = mapCoords(-16, -30);

    ctx.save();
    ctx.strokeStyle = '#2b0f06';
    ctx.lineWidth = height * 0.025;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(vStartX, vStartY);
    ctx.quadraticCurveTo(vMidX, vMidY, vEndX, vEndY);
    ctx.stroke();

    ctx.lineWidth = height * 0.012;
    ctx.strokeStyle = '#381408';
    ctx.beginPath();
    ctx.moveTo(vMidX - 20, vMidY - 15);
    ctx.lineTo(vMidX + 40, vMidY - 10);
    ctx.stroke();
    ctx.restore();

    bumpCtx.save();
    bumpCtx.strokeStyle = '#202020';
    bumpCtx.lineWidth = height * 0.026;
    bumpCtx.lineCap = 'round';
    bumpCtx.beginPath();
    bumpCtx.moveTo(vStartX, vStartY);
    bumpCtx.quadraticCurveTo(vMidX, vMidY, vEndX, vEndY);
    bumpCtx.stroke();
    bumpCtx.restore();
  }

  // 8. Gale Crater and Jezero Crater
  const craters = [
    { lat: -5.37, lon: 137.86, r: 8, name: 'Gale' },
    { lat: 18.38, lon: 77.58, r: 6, name: 'Jezero' },
    { lat: 4.5, lon: 135.6, r: 12, name: 'Elysium' },
  ];
  craters.forEach((c) => {
    const [cx, cy] = mapCoords(c.lat, c.lon);
    ctx.strokeStyle = '#ecd6bd';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, c.r, 0, Math.PI * 2);
    ctx.stroke();

    if (c.name === 'Gale') {
      ctx.fillStyle = '#caa382';
      ctx.beginPath();
      ctx.arc(cx, cy, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // 9. North Polar Ice Cap (Planum Boreum)
  {
    const [npx, npy] = mapCoords(90, 0);
    const nRad = height * 0.12;
    const nGrad = ctx.createRadialGradient(npx, npy, 0, npx, npy, nRad);
    nGrad.addColorStop(0, '#ffffff');
    nGrad.addColorStop(0.7, '#e8eff7');
    nGrad.addColorStop(0.9, '#c6d7e6');
    nGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = nGrad;
    ctx.beginPath();
    ctx.arc(npx, npy, nRad, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.strokeStyle = '#7c3814';
    ctx.lineWidth = 2;
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 3) {
      ctx.beginPath();
      for (let r = 5; r < nRad * 0.85; r += 3) {
        const theta = a + r * 0.05;
        const px = npx + Math.cos(theta) * r;
        const py = npy + Math.sin(theta) * r * 0.5;
        if (r === 5) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
    ctx.restore();

    const bNorth = bumpCtx.createRadialGradient(npx, npy, 0, npx, npy, nRad);
    bNorth.addColorStop(0, '#f0f0f0');
    bNorth.addColorStop(0.8, '#b0b0b0');
    bNorth.addColorStop(1, 'transparent');
    bumpCtx.fillStyle = bNorth;
    bumpCtx.beginPath();
    bumpCtx.arc(npx, npy, nRad, 0, Math.PI * 2);
    bumpCtx.fill();
  }

  // 10. South Polar Ice Cap (Planum Australe)
  {
    const [spx, spy] = mapCoords(-90, 0);
    const sRad = height * 0.09;
    const sGrad = ctx.createRadialGradient(spx, spy, 0, spx, spy, sRad);
    sGrad.addColorStop(0, '#ffffff');
    sGrad.addColorStop(0.75, '#ebf2f8');
    sGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = sGrad;
    ctx.beginPath();
    ctx.arc(spx, spy, sRad, 0, Math.PI * 2);
    ctx.fill();

    const bSouth = bumpCtx.createRadialGradient(spx, spy, 0, spx, spy, sRad);
    bSouth.addColorStop(0, '#f0f0f0');
    bSouth.addColorStop(0.8, '#a0a0a0');
    bSouth.addColorStop(1, 'transparent');
    bumpCtx.fillStyle = bSouth;
    bumpCtx.beginPath();
    bumpCtx.arc(spx, spy, sRad, 0, Math.PI * 2);
    bumpCtx.fill();
  }

  const albedoTexture = new THREE.CanvasTexture(albedoCanvas);
  albedoTexture.colorSpace = THREE.SRGBColorSpace;
  albedoTexture.wrapS = THREE.RepeatWrapping;
  albedoTexture.wrapT = THREE.ClampToEdgeWrapping;
  albedoTexture.needsUpdate = true;

  const bumpTexture = new THREE.CanvasTexture(bumpCanvas);
  bumpTexture.wrapS = THREE.RepeatWrapping;
  bumpTexture.wrapT = THREE.ClampToEdgeWrapping;
  bumpTexture.needsUpdate = true;

  return { albedoTexture, bumpTexture };
}
