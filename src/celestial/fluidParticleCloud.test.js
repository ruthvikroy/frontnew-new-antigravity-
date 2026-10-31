import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  computeFibonacciSpherePoint,
  calculateFluidVelocity,
  calculateSpringHealing,
  createFluidParticleCloud,
} from './fluidParticleCloud.js';

describe('fluidParticleCloud physics & math', () => {
  test('computeFibonacciSpherePoint produces valid points on sphere surface', () => {
    const pt0 = computeFibonacciSpherePoint(0, 100, 2.0);
    const r0 = Math.hypot(pt0.x, pt0.y, pt0.z);
    assert(Math.abs(r0 - 2.0) < 1e-4, `Expected radius 2.0, got ${r0}`);

    const ptMid = computeFibonacciSpherePoint(50, 100, 1.5);
    const rMid = Math.hypot(ptMid.x, ptMid.y, ptMid.z);
    assert(Math.abs(rMid - 1.5) < 1e-4, `Expected radius 1.5, got ${rMid}`);
  });

  test('calculateFluidVelocity produces non-zero drift and swirl within splat radius', () => {
    const splat = {
      x: 0,
      y: 0,
      vx: 1.0,
      vy: 0.0,
      curl: 1.0,
      radius: 0.5,
      strength: 2.0,
      age: 0.2,
      maxAge: 1.5,
    };

    const inside = calculateFluidVelocity(0.1, 0.1, splat);
    assert(Math.abs(inside.vx) > 0 || Math.abs(inside.vy) > 0, 'Velocity inside radius should be non-zero');

    const outside = calculateFluidVelocity(1.0, 1.0, splat);
    assert.equal(outside.vx, 0, 'Velocity outside radius should be 0');
    assert.equal(outside.vy, 0, 'Velocity outside radius should be 0');
  });

  test('calculateSpringHealing returns displaced particle towards resting target', () => {
    let pos = 2.0;
    const target = 0.0;
    let vel = 0.0;
    const dt = 0.016;

    for (let step = 0; step < 90; step++) {
      const res = calculateSpringHealing(pos, target, vel, dt, 14.0, 4.2);
      pos = res.pos;
      vel = res.vel;
    }

    assert(Math.abs(pos - target) < 0.2, `Expected position close to target after ~1.5s, got ${pos}`);
  });

  test('createFluidParticleCloud manages splats and form progress over 3s', () => {
    const cloud = createFluidParticleCloud({ count: 100, radius: 1.5 });
    assert.equal(cloud.getFormProgress(0), 0);
    assert.equal(cloud.getFormProgress(1.5), 0.5);
    assert.equal(cloud.getFormProgress(3.0), 1.0);
    assert.equal(cloud.getFormProgress(5.0), 1.0);

    cloud.addSplat(0.2, -0.1, 0.5, -0.3, 1.2);
    assert.equal(cloud.getActiveSplatCount(), 1);

    cloud.dispose();
  });
});
