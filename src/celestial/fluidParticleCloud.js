import * as THREE from 'three';

export function computeFibonacciSpherePoint(i, total, radius = 1.6) {
  const y = 1 - (i / Math.max(1, total - 1)) * 2;
  const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
  const goldenAngle = 2.399963229728653; // π * (3 - √5)
  const theta = i * goldenAngle;
  const x = Math.cos(theta) * radiusAtY;
  const z = Math.sin(theta) * radiusAtY;
  return { x: x * radius, y: y * radius, z: z * radius };
}

export function calculateFluidVelocity(px, py, splat) {
  const dx = px - splat.x;
  const dy = py - splat.y;
  const distSq = dx * dx + dy * dy;
  const rSq = splat.radius * splat.radius;

  if (distSq >= rSq || distSq < 1e-6) {
    return { vx: 0, vy: 0 };
  }

  const dist = Math.sqrt(distSq);
  const falloff = Math.pow(1 - dist / splat.radius, 1.8);
  const ageFactor = Math.max(0, 1 - splat.age / splat.maxAge);
  const intensity = falloff * ageFactor * splat.strength;

  const driftVx = splat.vx * intensity;
  const driftVy = splat.vy * intensity;

  const invDist = 1 / dist;
  const normX = dx * invDist;
  const normY = dy * invDist;

  const swirlVx = -normY * splat.curl * intensity * 0.9;
  const swirlVy = normX * splat.curl * intensity * 0.9;

  return {
    vx: driftVx + swirlVx,
    vy: driftVy + swirlVy,
  };
}

export function calculateSpringHealing(pos, target, vel, dt, k = 14.0, c = 4.2) {
  const disp = pos - target;
  const force = -k * disp - c * vel;
  const newVel = vel + force * dt;
  const newPos = pos + newVel * dt;
  return { pos: newPos, vel: newVel };
}

export function createFluidParticleCloud({
  count = 7200,
  radius = 1.75,
  accentColor = 0xaa88ff,
} = {}) {
  const positions = new Float32Array(count * 3);
  const randomPositions = new Float32Array(count * 3);
  const basePositions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  const baseCol = new THREE.Color(accentColor);
  const whiteCol = new THREE.Color(0xdddddd);
  const cyanCol = new THREE.Color(0xaaccff);

  for (let i = 0; i < count; i++) {
    const idx = i * 3;
    const pt = computeFibonacciSpherePoint(i, count, radius);
    basePositions[idx] = pt.x;
    basePositions[idx + 1] = pt.y;
    basePositions[idx + 2] = pt.z;

    const rDist = 5.0 + Math.random() * 9.0;
    const u = Math.random();
    const v = Math.random();
    const rTheta = u * 2.0 * Math.PI;
    const rPhi = Math.acos(2.0 * v - 1.0);
    const rx = rDist * Math.sin(rPhi) * Math.cos(rTheta);
    const ry = rDist * Math.sin(rPhi) * Math.sin(rTheta);
    const rz = rDist * Math.cos(rPhi);

    randomPositions[idx] = rx;
    randomPositions[idx + 1] = ry;
    randomPositions[idx + 2] = rz;

    positions[idx] = rx;
    positions[idx + 1] = ry;
    positions[idx + 2] = rz;

    velocities[idx] = 0;
    velocities[idx + 1] = 0;
    velocities[idx + 2] = 0;

    const t = Math.random();
    const c = t < 0.55 ? baseCol.clone().lerp(whiteCol, t * 0.7) : baseCol.clone().lerp(cyanCol, (t - 0.55) * 1.5);
    colors[idx] = c.r;
    colors[idx + 1] = c.g;
    colors[idx + 2] = c.b;

    sizes[i] = 1.2 + Math.random() * 2.2;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const pointTexture = (() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.2, 'rgba(215, 195, 255, 0.9)');
      grad.addColorStop(0.5, 'rgba(170, 136, 255, 0.35)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  })();

  const material = new THREE.PointsMaterial({
    size: 0.045,
    map: pointTexture,
    transparent: true,
    opacity: 0.9,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const pointsMesh = new THREE.Points(geometry, material);
  pointsMesh.frustumCulled = false;

  const splats = [];
  const maxSplats = 32;

  function addSplat(screenX, screenY, vx, vy, strength = 1.0) {
    const speed = Math.hypot(vx, vy);
    if (speed < 0.0001 && strength < 0.1) return;

    const curlDirection = (splats.length % 2 === 0 ? 1 : -1) * (0.8 + Math.random() * 0.4);
    const splat = {
      x: screenX,
      y: screenY,
      vx: vx * 0.8,
      vy: vy * 0.8,
      curl: curlDirection,
      radius: 0.38 + Math.min(speed * 0.4, 0.25),
      strength: Math.min(strength * 2.8, 4.5),
      age: 0,
      maxAge: 1.4 + Math.random() * 0.4,
    };

    if (splats.length >= maxSplats) {
      splats.shift();
    }
    splats.push(splat);
  }

  const _tempProj = new THREE.Vector3();
  const _camDir = new THREE.Vector3();
  const _camRight = new THREE.Vector3();
  const _camUp = new THREE.Vector3();

  function update(dt, elapsedTime, camera) {
    const safeDt = Math.min(dt, 0.06);

    for (let s = splats.length - 1; s >= 0; s--) {
      splats[s].age += safeDt;
      if (splats[s].age >= splats[s].maxAge) {
        splats.splice(s, 1);
      }
    }

    const formTime = 3.0;
    const rawProgress = Math.min(elapsedTime / formTime, 1.0);
    const formProgress = 1.0 - Math.pow(1.0 - rawProgress, 3);

    pointsMesh.rotation.y = elapsedTime * 0.04;
    pointsMesh.rotation.x = Math.sin(elapsedTime * 0.02) * 0.05;

    camera.getWorldDirection(_camDir);
    _camRight.crossVectors(_camDir, camera.up).normalize();
    _camUp.crossVectors(_camRight, _camDir).normalize();

    const posAttr = geometry.attributes.position;
    const posArr = posAttr.array;
    const hasActiveSplats = splats.length > 0;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;

      let bx = basePositions[idx];
      let by = basePositions[idx + 1];
      let bz = basePositions[idx + 2];

      if (formProgress < 1.0) {
        const rx = randomPositions[idx];
        const ry = randomPositions[idx + 1];
        const rz = randomPositions[idx + 2];
        bx = rx + (bx - rx) * formProgress;
        by = ry + (by - ry) * formProgress;
        bz = rz + (bz - rz) * formProgress;
      }

      let curX = posArr[idx];
      let curY = posArr[idx + 1];
      let curZ = posArr[idx + 2];
      let vx = velocities[idx];
      let vy = velocities[idx + 1];
      let vz = velocities[idx + 2];

      if (hasActiveSplats) {
        _tempProj.set(curX, curY, curZ);
        _tempProj.applyMatrix4(pointsMesh.matrixWorld);
        _tempProj.project(camera);

        if (_tempProj.z > -1 && _tempProj.z < 1) {
          const px = _tempProj.x;
          const py = _tempProj.y;

          let totalFlowX = 0;
          let totalFlowY = 0;

          for (let s = 0; s < splats.length; s++) {
            const flow = calculateFluidVelocity(px, py, splats[s]);
            totalFlowX += flow.vx;
            totalFlowY += flow.vy;
          }

          if (Math.abs(totalFlowX) > 0.0001 || Math.abs(totalFlowY) > 0.0001) {
            const flowStrength = 5.2;
            vx += (_camRight.x * totalFlowX + _camUp.x * totalFlowY) * flowStrength * safeDt;
            vy += (_camRight.y * totalFlowX + _camUp.y * totalFlowY) * flowStrength * safeDt;
            vz += (_camRight.z * totalFlowX + _camUp.z * totalFlowY) * flowStrength * safeDt;

            const turb = (totalFlowX * _tempProj.y - totalFlowY * _tempProj.x) * 2.5;
            vx += _camDir.x * turb * safeDt;
            vy += _camDir.y * turb * safeDt;
            vz += _camDir.z * turb * safeDt;
          }
        }
      }

      const resX = calculateSpringHealing(curX, bx, vx, safeDt, 13.5, 4.0);
      const resY = calculateSpringHealing(curY, by, vy, safeDt, 13.5, 4.0);
      const resZ = calculateSpringHealing(curZ, bz, vz, safeDt, 13.5, 4.0);

      posArr[idx] = resX.pos;
      posArr[idx + 1] = resY.pos;
      posArr[idx + 2] = resZ.pos;

      velocities[idx] = resX.vel;
      velocities[idx + 1] = resY.vel;
      velocities[idx + 2] = resZ.vel;
    }

    posAttr.needsUpdate = true;
  }

  function dispose() {
    geometry.dispose();
    material.dispose();
    if (pointTexture) pointTexture.dispose();
  }

  return {
    mesh: pointsMesh,
    addSplat,
    update,
    dispose,
    getActiveSplatCount: () => splats.length,
    getFormProgress: (t) => Math.min(t / 3.0, 1.0),
  };
}
