import React, { useState, useEffect } from 'react';
import {
  Scale,
  Zap,
  Wind,
  Compass,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Info,
  Atom,
  ShieldAlert,
  Orbit,
  Calculator,
} from 'lucide-react';
import { calculateLunarWeight, calculateLunarJumpHeight } from '../utils/comparator.js';

export function BaselinePhysics() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('constants');

  // Interactive Live Calculator State
  const [calcWeight, setCalcWeight] = useState(75);
  const [calcJump, setCalcJump] = useState(40);
  const [customMassPower, setCustomMassPower] = useState(24);
  const [customMassCoeff, setCustomMassCoeff] = useState(5.972);
  const [customRadiusKm, setCustomRadiusKm] = useState(6371);

  // Automatically expand if navigated directly to #physics
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#physics') {
        setIsOpen(true);
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const comparisons = [
    {
      parameter: 'Mass',
      earth: '5.972 × 10²⁴ kg',
      moon: '7.342 × 10²² kg',
      contrast: 'Earth is 81.3× more massive',
      icon: Scale,
    },
    {
      parameter: 'Equatorial Radius',
      earth: '6,378.1 km',
      moon: '1,737.4 km',
      contrast: 'Moon is 27.2% the radius of Earth',
      icon: Compass,
    },
    {
      parameter: 'Surface Gravity',
      earth: '9.807 m/s² (1.00 g)',
      moon: '1.622 m/s² (0.165 g)',
      contrast: 'Moon gravity is ~1/6th terrestrial',
      icon: Zap,
    },
    {
      parameter: 'Escape Velocity',
      earth: '11.186 km/s (40,270 km/h)',
      moon: '2.380 km/s (8,568 km/h)',
      contrast: 'Lunar escape requires 21.3% the delta-v',
      icon: Orbit,
    },
    {
      parameter: 'Atmosphere Composition',
      earth: '78% N₂, 21% O₂, 1% Ar',
      moon: 'Surface boundary exosphere (He, Ne, H₂)',
      contrast: 'Total lunar atmosphere mass < 10 metric tons',
      icon: Wind,
    },
    {
      parameter: 'Scale Height (H = kT/mg)',
      earth: '8.5 km (exponential barometric decay)',
      moon: 'Ballistic exosphere (H → ∞, collisions negligible)',
      contrast: 'Gas molecules enter free ballistic sub-orbital arcs',
      icon: Atom,
    },
    {
      parameter: 'Magnetic Field Protection',
      earth: 'Global geodynamo (~30–60 µT)',
      moon: 'No global dynamo; localized crustal magnetic swirls',
      contrast: 'Earth magnetosphere deflects 99.5% of solar wind',
      icon: Sparkles,
    },
    {
      parameter: 'Annual Cosmic Radiation Flux',
      earth: '2.4 mSv/year (sea level)',
      moon: '380–420 mSv/year (unshielded surface)',
      contrast: 'Lunar surface receives ~160× terrestrial radiation dose',
      icon: ShieldAlert,
    },
  ];

  const formulas = [
    {
      title: 'Newtonian Gravitational Acceleration',
      formula: 'g = G × M / R²',
      explanation:
        'Governs the attractive force per unit mass. With Earth mass M_E = 5.972 × 10²⁴ kg and radius R_E = 6,371 km, g_E ≈ 9.81 m/s². The Moon, having only 1.2% Earth’s mass and 27% its radius, yields g_M = 1.62 m/s² (0.165 g).',
    },
    {
      title: 'Escape Velocity & Kinetic Threshold',
      formula: 'v_e = √(2GM / R)',
      explanation:
        'The parabolic trajectory velocity needed to overcome a celestial body’s gravitational potential well without further propulsion. Earth requires 11.19 km/s (requiring multi-stage rocketry), whereas lunar launch from the surface requires only 2.38 km/s.',
    },
    {
      title: 'Thermal Radiative Equilibrium (Stefan-Boltzmann)',
      formula: 'T_eq = [ (1 - A) × S_0 / (16 × ε × σ) ]^(1/4)',
      explanation:
        'With solar constant S_0 ≈ 1361 W/m² and lunar albedo A ≈ 0.12, the sunlit lunar regolith reaches 395 K (+122°C), while shadowed craters plunge to 27 K (-246°C). On Earth, greenhouse gas re-radiation and atmospheric convection moderate global mean temperature to 288 K (+15°C).',
    },
    {
      title: 'Jeans Atmospheric Escape Mechanism',
      formula: 'v_th = √(3 × k_B × T / m)',
      explanation:
        'Explains why the Moon cannot retain an atmosphere: when thermal Maxwell-Boltzmann molecular velocity v_th exceeds approximately one-sixth of escape velocity (v_th > v_e / 6), gas molecules boil off into space over geological timescales. Water vapor and nitrogen escape within hours on the lunar day-side.',
    },
  ];

  const G = 6.6743e-11;
  const massKg = customMassCoeff * Math.pow(10, customMassPower);
  const radiusM = customRadiusKm * 1000;
  const customEscapeKms = radiusM > 0 ? (Math.sqrt((2 * G * massKg) / radiusM) / 1000).toFixed(2) : 0;
  const customGravity = radiusM > 0 ? ((G * massKg) / Math.pow(radiusM, 2)).toFixed(2) : 0;

  return (
    <section id="physics" className="w-full border-t border-[var(--line)] bg-[var(--background)] py-8 px-6 transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Trigger Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[var(--muted)] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <span>Astrophysics Reference Data</span>
              <span>•</span>
              <span className="text-[var(--accent)]">Theoretical & Observational Physics</span>
            </div>
            <h2 className="font-bold text-[var(--accent)] tracking-tight">
              Planetary Baseline Invariants &amp; Astrophysical Laws
            </h2>
            <p className="text-[var(--muted)] mt-0.5">
              Formulas, comparative invariants, and live physics simulation between Earth and Moon.
            </p>
          </div>

          <button
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-controls="physics-details"
            className={`px-4 py-2.5 font-medium rounded border transition-all flex items-center justify-center gap-2.5 cursor-pointer whitespace-nowrap shrink-0 ${
              isOpen
                ? 'bg-[var(--chip)] text-[var(--accent)] border-[var(--accent)] shadow-[0_0_10px_rgba(170,136,255,0.25)]'
                : 'bg-[var(--chip)] text-[var(--muted)] border-[var(--line)] hover:text-[var(--text)] hover:border-[var(--muted)]'
            }`}
          >
            <Info className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>{isOpen ? 'Hide Astrophysics Reference' : 'Show Astrophysics Reference'}</span>
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Collapsible Content */}
        {isOpen && (
          <div id="physics-details" className="mt-6 pt-5 border-t border-[var(--line)] animate-in fade-in duration-300 space-y-5">
            {/* Sub-tab Navigation */}
            <div className="flex items-center gap-2 border-b border-[var(--line)] pb-3 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveTab('constants')}
                className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'constants'
                    ? 'bg-black text-[var(--accent)] font-medium border border-[var(--accent)]'
                    : 'bg-[var(--chip)] text-[var(--muted)] border border-[var(--line)] hover:text-[var(--text)]'
                }`}
              >
                01. Invariants Table
              </button>
              <button
                onClick={() => setActiveTab('formulas')}
                className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === 'formulas'
                    ? 'bg-black text-[var(--accent)] font-medium border border-[var(--accent)]'
                    : 'bg-[var(--chip)] text-[var(--muted)] border border-[var(--line)] hover:text-[var(--text)]'
                }`}
              >
                02. Governing Astrophysics Formulas
              </button>
              <button
                onClick={() => setActiveTab('calculator')}
                className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'calculator'
                    ? 'bg-black text-[var(--accent)] font-medium border border-[var(--accent)]'
                    : 'bg-[var(--chip)] text-[var(--muted)] border border-[var(--line)] hover:text-[var(--accent)]'
                }`}
              >
                <Calculator className="w-3 h-3" />
                <span>03. Live Physics Calculator</span>
              </button>
            </div>

            {/* Tab 1: Invariants Table */}
            {activeTab === 'constants' && (
              <div className="space-y-3">
                <div className="text-[var(--muted)] max-w-xl">
                  Empirical boundary metrics measured by NASA Apollo, LROC, and terrestrial observatories:
                </div>
                <div className="overflow-x-auto rounded border border-[var(--line)] bg-[var(--chip)]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--line)] text-[var(--muted)] uppercase tracking-wider bg-black">
                        <th className="py-2.5 px-4 font-normal">Physical Parameter</th>
                        <th className="py-2.5 px-4 font-normal text-[var(--accent)]">Earth (Terrestrial)</th>
                        <th className="py-2.5 px-4 font-normal text-[var(--accent)]">Moon (Selenological)</th>
                        <th className="py-2.5 px-4 font-normal text-[var(--muted)]">Comparative Contrast</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--line)]">
                      {comparisons.map((row) => {
                        const Icon = row.icon;
                        return (
                          <tr key={row.parameter} className="hover:bg-black/40 transition-colors">
                            <td className="py-2.5 px-4 text-[var(--text)] font-medium flex items-center gap-2">
                              <Icon className="w-3.5 h-3.5 text-[var(--accent)]" />
                              <span>{row.parameter}</span>
                            </td>
                            <td className="py-2.5 px-4 text-[var(--accent)] font-medium">{row.earth}</td>
                            <td className="py-2.5 px-4 text-[var(--accent)] font-medium">{row.moon}</td>
                            <td className="py-2.5 px-4 text-[var(--muted)]">{row.contrast}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 2: Governing Astrophysics Formulas */}
            {activeTab === 'formulas' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formulas.map((item, idx) => (
                  <div key={idx} className="bg-[var(--chip)] border border-[var(--line)] rounded p-5 flex flex-col justify-between hover:border-[var(--accent)] transition-colors">
                    <div>
                      <div className="text-[var(--accent)] uppercase tracking-wider mb-1">
                        Astrophysics Principle #{idx + 1}
                      </div>
                      <h4 className="font-bold text-[var(--accent)] mb-2">{item.title}</h4>
                      <div className="my-3 px-3 py-2 bg-black rounded border border-[var(--line)] text-[var(--accent)]">
                        {item.formula}
                      </div>
                      <p className="text-[var(--muted)] leading-relaxed">{item.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 3: Interactive Live Physics Calculator */}
            {activeTab === 'calculator' && (
              <div className="bg-[var(--chip)] border border-[var(--line)] rounded p-5 space-y-5">
                <div>
                  <h3 className="font-bold text-[var(--accent)] mb-1">
                    Comparative Kinematics &amp; Escape Velocity Simulator
                  </h3>
                  <p className="text-[var(--muted)]">
                    Calculate biomechanical performance and planetary escape parameters in real-time.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-3 border-t border-[var(--line)]">
                  {/* Left: Biomechanical Jump & Felt Weight */}
                  <div className="space-y-4 bg-black p-4 rounded border border-[var(--line)]">
                    <div className="text-[var(--accent)] uppercase tracking-wider">
                      Biomechanical Gravity Simulation
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[var(--muted)] block uppercase mb-1">
                          Body Weight (kg)
                        </label>
                        <input
                          type="number"
                          min="10"
                          max="300"
                          value={calcWeight}
                          onChange={(e) => setCalcWeight(Math.max(1, Number(e.target.value) || 0))}
                          className="w-full px-3 py-1.5 bg-[var(--chip)] border border-[var(--line)] rounded text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                        />
                      </div>
                      <div>
                        <label className="text-[var(--muted)] block uppercase mb-1">
                          Earth Jump Height (cm)
                        </label>
                        <input
                          type="number"
                          min="5"
                          max="150"
                          value={calcJump}
                          onChange={(e) => setCalcJump(Math.max(1, Number(e.target.value) || 0))}
                          className="w-full px-3 py-1.5 bg-[var(--chip)] border border-[var(--line)] rounded text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="bg-[var(--chip)] p-3 rounded border border-[var(--line)]">
                        <span className="text-[var(--muted)] block uppercase">
                          Earth (1.00 g)
                        </span>
                        <div className="font-bold text-[var(--text)] mt-1">{calcWeight} KG FELT</div>
                        <div className="text-[var(--accent)] mt-0.5">{calcJump} CM JUMP</div>
                      </div>

                      <div className="bg-[var(--chip)] border border-[var(--accent)] p-3 rounded">
                        <span className="text-[var(--accent)] block uppercase">
                          Moon (0.165 g)
                        </span>
                        <div className="font-bold text-[var(--text)] mt-1">
                          {calculateLunarWeight(calcWeight)} KG FELT
                        </div>
                        <div className="text-[var(--accent)] mt-0.5">
                          {calculateLunarJumpHeight(calcJump)} CM JUMP ({((calcJump * 9.81) / 1.62 / 100).toFixed(2)} M)
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Escape Velocity Calculator */}
                  <div className="space-y-4 bg-black p-4 rounded border border-[var(--line)]">
                    <div className="text-[var(--accent)] uppercase tracking-wider">
                      Newtonian Escape Velocity v_e = √(2GM/R)
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[var(--muted)] block uppercase mb-1">
                          Body Mass (10^{customMassPower} kg)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={customMassCoeff}
                          onChange={(e) => setCustomMassCoeff(Number(e.target.value) || 0)}
                          className="w-full px-3 py-1.5 bg-[var(--chip)] border border-[var(--line)] rounded text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                        />
                      </div>
                      <div>
                        <label className="text-[var(--muted)] block uppercase mb-1">
                          Radius (km)
                        </label>
                        <input
                          type="number"
                          value={customRadiusKm}
                          onChange={(e) => setCustomRadiusKm(Number(e.target.value) || 0)}
                          className="w-full px-3 py-1.5 bg-[var(--chip)] border border-[var(--line)] rounded text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setCustomMassCoeff(5.972);
                          setCustomMassPower(24);
                          setCustomRadiusKm(6371);
                        }}
                        className="px-2 py-1 bg-[var(--chip)] hover:bg-[var(--line)] border border-[var(--line)] rounded text-[var(--muted)] hover:text-[var(--text)] cursor-pointer"
                      >
                        Reset Earth
                      </button>
                      <button
                        onClick={() => {
                          setCustomMassCoeff(7.342);
                          setCustomMassPower(22);
                          setCustomRadiusKm(1737);
                        }}
                        className="px-2 py-1 bg-[var(--chip)] hover:bg-[var(--line)] border border-[var(--line)] rounded text-[var(--muted)] hover:text-[var(--text)] cursor-pointer"
                      >
                        Reset Moon
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="bg-[var(--chip)] p-3 rounded border border-[var(--line)]">
                        <span className="text-[var(--muted)] block uppercase">Surface Gravity</span>
                        <div className="font-bold text-[var(--text)] mt-1">{customGravity} M/S²</div>
                      </div>

                      <div className="bg-[var(--chip)] border border-[var(--accent)] p-3 rounded">
                        <span className="text-[var(--accent)] block uppercase">
                          Escape Velocity
                        </span>
                        <div className="font-bold text-[var(--accent)] mt-1">
                          {customEscapeKms} KM/S
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
