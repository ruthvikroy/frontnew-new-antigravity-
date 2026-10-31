import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { LOCATION_PAIRS } from './data/locationPairs.js';
import { filterLocationPairs, sortLocationPairs } from './utils/comparator.js';
import { CelestialCanvas } from './components/CelestialCanvas.jsx';
import { CelestialUI } from './components/CelestialUI.jsx';
import { Header } from './components/Header.jsx';
import { HeroSection } from './components/HeroSection.jsx';
import { CelestialRadar } from './components/CelestialRadar.jsx';
import { ControlToolbar } from './components/ControlToolbar.jsx';
import { SideBySideDashboard } from './components/SideBySideDashboard.jsx';
import { BaselinePhysics } from './components/BaselinePhysics.jsx';
import { MetricComparisonDrawer } from './components/MetricComparisonDrawer.jsx';
import { GoogleDrivePanel } from './components/GoogleDrivePanel.jsx';
import { LunarExplorationSection } from './components/LunarExplorationSection.jsx';
import { Footer } from './components/Footer.jsx';
import { SpaceAudioEngine } from './components/AudioEngine.js';
import { SimulationSeparationSection } from './components/SimulationSeparationSection.jsx';
import { NatGeoHeader } from './components/natgeo/NatGeoHeader.jsx';
import { EditorialHero } from './components/natgeo/EditorialHero.jsx';
import { ArticlesSection } from './components/natgeo/ArticlesSection.jsx';
import { FeaturedContentSection } from './components/natgeo/FeaturedContentSection.jsx';
import { ExpeditionsSection } from './components/natgeo/ExpeditionsSection.jsx';
import { NatGeoFooter } from './components/natgeo/NatGeoFooter.jsx';
import { ArticleReaderModal } from './components/natgeo/ArticleReaderModal.jsx';
import { VideoModal } from './components/natgeo/VideoModal.jsx';
import { GalleryModal } from './components/natgeo/GalleryModal.jsx';
import { ExpeditionDetailModal } from './components/natgeo/ExpeditionDetailModal.jsx';

export default function App() {
  const [viewMode, setViewMode] = useState('editorial');

  const [activeArticleModal, setActiveArticleModal] = useState(null);
  const [activeVideoModal, setActiveVideoModal] = useState(null);
  const [activeGalleryModal, setActiveGalleryModal] = useState(null);
  const [activeExpeditionModal, setActiveExpeditionModal] = useState(null);

  const [category, setCategory] = useState('all');
  const [criterion, setCriterion] = useState('elevation');
  const [direction, setDirection] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [syncScroll, setSyncScroll] = useState(true);
  const [tempUnit, setTempUnit] = useState('C');
  const [focusedPairId, setFocusedPairId] = useState(LOCATION_PAIRS[0].id);
  const [detailedPair, setDetailedPair] = useState(null);

  const [celestialCamMode, setCelestialCamMode] = useState('overview');
  const [isPaused, setIsPaused] = useState(false);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showLandingSites, setShowLandingSites] = useState(true);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [selectedLandmarkId, setSelectedLandmarkId] = useState(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isDriveOpen, setIsDriveOpen] = useState(false);
  const audioEngineRef = useRef(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    audioEngineRef.current = new SpaceAudioEngine();
    return () => {
      audioEngineRef.current?.dispose();
    };
  }, []);

  const playTelemetryBlip = useCallback(() => {
    if (soundEnabled && audioEngineRef.current) {
      audioEngineRef.current.playBlip();
    }
  }, [soundEnabled]);

  const handleToggleSound = useCallback(() => {
    if (audioEngineRef.current) {
      const active = audioEngineRef.current.toggle();
      setSoundEnabled(active);
    }
  }, []);

  const handleUserInteracted = useCallback(() => {
    setHasInteracted(true);
  }, []);

  const handleFocusMars = useCallback(() => {
    setCelestialCamMode('mars');
    setSelectedLandmarkId(null);
    setViewMode('simulation');
    playTelemetryBlip();
  }, [playTelemetryBlip]);

  const handleResetCamera = useCallback(() => {
    setResetTrigger((prev) => prev + 1);
    setCelestialCamMode('overview');
    setSelectedLandmarkId(null);
  }, []);

  // Filter and sort pipeline
  const filteredAndSortedPairs = useMemo(() => {
    const filtered = filterLocationPairs(LOCATION_PAIRS, category, searchQuery);
    return sortLocationPairs(filtered, criterion, direction);
  }, [category, searchQuery, criterion, direction]);

  const focusedPair = useMemo(() => {
    const found = LOCATION_PAIRS.find((p) => p.id === focusedPairId);
    return found || LOCATION_PAIRS[0];
  }, [focusedPairId]);

  const handleResetFilters = () => {
    setCategory('all');
    setSearchQuery('');
    setCriterion('elevation');
    setDirection('desc');
    playTelemetryBlip();
  };

  const handleScrollToMatrix = () => {
    playTelemetryBlip();
    const el = document.getElementById('dashboard');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToPhysics = () => {
    playTelemetryBlip();
    const el = document.getElementById('physics');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToLunar = () => {
    playTelemetryBlip();
    const el = document.getElementById('lunar-exploration');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleJumpToTop = () => {
    playTelemetryBlip();
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCaptureCanvasDataUrl = useCallback(() => {
    const canvas = document.getElementById('space');
    if (!canvas) return null;
    try {
      return canvas.toDataURL('image/png');
    } catch {
      return null;
    }
  }, []);

  const currentPreset = useMemo(
    () => ({
      version: 1,
      savedAt: new Date().toISOString(),
      celestialCamMode,
      isPaused,
      showOrbits,
      selectedLandmarkId,
    }),
    [celestialCamMode, isPaused, showOrbits, selectedLandmarkId]
  );

  const handleApplyPreset = useCallback((preset) => {
    if (preset.celestialCamMode) setCelestialCamMode(preset.celestialCamMode);
    if (typeof preset.isPaused === 'boolean') setIsPaused(preset.isPaused);
    if (typeof preset.showOrbits === 'boolean') setShowOrbits(preset.showOrbits);
    if (preset.selectedLandmarkId !== undefined) setSelectedLandmarkId(preset.selectedLandmarkId);
  }, []);

  if (viewMode === 'editorial') {
    return (
      <div className="min-h-screen w-full bg-[#050505] text-[#F1F1F1] selection:bg-[#F5D000] selection:text-black">
        <NatGeoHeader
          onLaunchSimulation={() => {
            setViewMode('simulation');
            playTelemetryBlip();
          }}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
        />

        <main>
          <EditorialHero
            onLaunchSimulation={() => {
              setViewMode('simulation');
              playTelemetryBlip();
            }}
          />

          <ArticlesSection
            onSelectArticle={(article) => {
              setActiveArticleModal(article);
              playTelemetryBlip();
            }}
            onLaunchSimulation={() => {
              setViewMode('simulation');
              playTelemetryBlip();
            }}
          />

          <FeaturedContentSection
            onOpenArticleModal={(article) => {
              setActiveArticleModal(article);
              playTelemetryBlip();
            }}
            onOpenVideoModal={(video) => {
              setActiveVideoModal(video);
              playTelemetryBlip();
            }}
            onOpenGalleryModal={(gallery) => {
              setActiveGalleryModal(gallery);
              playTelemetryBlip();
            }}
          />

          <ExpeditionsSection
            onSelectExpedition={(exp) => {
              setActiveExpeditionModal(exp);
              playTelemetryBlip();
            }}
          />
        </main>

        <NatGeoFooter
          onLaunchSimulation={() => {
            setViewMode('simulation');
            playTelemetryBlip();
          }}
        />

        {activeArticleModal && (
          <ArticleReaderModal
            article={activeArticleModal}
            onClose={() => setActiveArticleModal(null)}
          />
        )}

        {activeVideoModal && (
          <VideoModal
            video={activeVideoModal}
            onClose={() => setActiveVideoModal(null)}
          />
        )}

        {activeGalleryModal && (
          <GalleryModal
            gallery={activeGalleryModal}
            onClose={() => setActiveGalleryModal(null)}
          />
        )}

        {activeExpeditionModal && (
          <ExpeditionDetailModal
            expedition={activeExpeditionModal}
            onClose={() => setActiveExpeditionModal(null)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#000000] text-[var(--text)] flex flex-col">
      <CelestialCanvas
        viewMode={celestialCamMode}
        isPaused={isPaused}
        showOrbits={showOrbits}
        showLandingSites={showLandingSites}
        resetTrigger={resetTrigger}
        selectedLandmarkId={selectedLandmarkId}
        onSelectLandmarkId={(id) => {
          setSelectedLandmarkId(id);
          setCelestialCamMode('moon');
          setViewMode('simulation');
          playTelemetryBlip();
        }}
        onSelectBody={(body) => {
          setSelectedLandmarkId(null);
          setCelestialCamMode(body);
          setViewMode('simulation');
          playTelemetryBlip();
        }}
        onUserInteracted={handleUserInteracted}
      />

      <Header
        syncScroll={syncScroll}
        onToggleSyncScroll={() => {
          setSyncScroll(!syncScroll);
          playTelemetryBlip();
        }}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onJumpToTop={handleJumpToTop}
        activeCount={filteredAndSortedPairs.length}
        onOpenDrive={() => setIsDriveOpen(true)}
        viewMode={viewMode}
        onToggleViewMode={() => {
          setViewMode(viewMode === 'dashboard' ? 'simulation' : 'dashboard');
          playTelemetryBlip();
        }}
        onReturnToEditorial={() => {
          setViewMode('editorial');
          playTelemetryBlip();
        }}
      />

      {viewMode === 'dashboard' ? (
        <main
          ref={scrollContainerRef}
          id="dashboard-scroll-container"
          className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden flex flex-col"
        >
          <SimulationSeparationSection
            onEnterSimulation={() => {
              setViewMode('simulation');
              playTelemetryBlip();
            }}
            onFocusEarth={() => {
              setCelestialCamMode('earth');
              setSelectedLandmarkId(null);
              setViewMode('simulation');
              playTelemetryBlip();
            }}
            onFocusMoon={() => {
              setCelestialCamMode('moon');
              setSelectedLandmarkId(null);
              setViewMode('simulation');
              playTelemetryBlip();
            }}
            onFocusMars={() => {
              setCelestialCamMode('mars');
              setSelectedLandmarkId(null);
              setViewMode('simulation');
              playTelemetryBlip();
            }}
            onFocusOrbit={() => {
              setCelestialCamMode('orbit');
              setSelectedLandmarkId(null);
              setViewMode('simulation');
              playTelemetryBlip();
            }}
            onSelectApolloSite={(siteId) => {
              setSelectedLandmarkId(siteId);
              setCelestialCamMode('moon');
              setViewMode('simulation');
              playTelemetryBlip();
            }}
            isPaused={isPaused}
            onTogglePause={() => {
              setIsPaused(!isPaused);
              playTelemetryBlip();
            }}
            onPlayClick={playTelemetryBlip}
          />

          <HeroSection
            onScrollToMatrix={handleScrollToMatrix}
            onScrollToPhysics={handleScrollToPhysics}
            onScrollToLunar={handleScrollToLunar}
          />

          {/* Interactive Celestial Vector Projection Radar */}
          <CelestialRadar
            focusedPair={focusedPair}
            onSelectPair={(pair) => {
              setFocusedPairId(pair.id);
              playTelemetryBlip();
            }}
            allPairs={LOCATION_PAIRS}
          />

          {/* Control Toolbar: Filter, Sort, Search, Unit Toggle */}
          <ControlToolbar
            category={category}
            onSelectCategory={(cat) => {
              setCategory(cat);
              playTelemetryBlip();
            }}
            criterion={criterion}
            onSelectCriterion={(crit) => {
              setCriterion(crit);
              playTelemetryBlip();
            }}
            direction={direction}
            onToggleDirection={() => {
              setDirection(direction === 'asc' ? 'desc' : 'asc');
              playTelemetryBlip();
            }}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            totalCount={LOCATION_PAIRS.length}
            filteredCount={filteredAndSortedPairs.length}
            tempUnit={tempUnit}
            onToggleTempUnit={() => {
              setTempUnit(tempUnit === 'C' ? 'F' : 'C');
              playTelemetryBlip();
            }}
          />

          {/* Side-by-Side Dual-Column Comparison Dashboard */}
          <SideBySideDashboard
            pairs={filteredAndSortedPairs}
            tempUnit={tempUnit}
            syncScroll={syncScroll}
            focusedPairId={focusedPair.id}
            onFocusPair={(pair) => {
              setFocusedPairId(pair.id);
            }}
            onOpenDetails={(pair) => {
              setDetailedPair(pair);
              playTelemetryBlip();
            }}
            onResetFilters={handleResetFilters}
            onPlayClick={playTelemetryBlip}
          />

          {/* Lunar Surface Reconnaissance & Apollo Exploration Sites */}
          <LunarExplorationSection
            selectedLandmarkId={selectedLandmarkId}
            onSelectSite={(siteId) => {
              setSelectedLandmarkId(siteId);
              setCelestialCamMode('moon');
              playTelemetryBlip();
            }}
            onSwitchToSimulation={() => {
              setViewMode('simulation');
              setCelestialCamMode('moon');
              playTelemetryBlip();
            }}
            onPlayClick={playTelemetryBlip}
          />

          {/* Astrophysics Reference & Planetary Baseline Invariants */}
          <BaselinePhysics />

          {/* Scientific Footer */}
          <Footer />
        </main>
      ) : (
        /* Immersive 3D Space View Overlay */
        <CelestialUI
          viewMode={celestialCamMode}
          setViewMode={setCelestialCamMode}
          isPaused={isPaused}
          setIsPaused={setIsPaused}
          showOrbits={showOrbits}
          setShowOrbits={setShowOrbits}
          showLandingSites={showLandingSites}
          setShowLandingSites={setShowLandingSites}
          onResetCamera={handleResetCamera}
          hasInteracted={hasInteracted}
          selectedLandmarkId={selectedLandmarkId}
          setSelectedLandmarkId={setSelectedLandmarkId}
          onPlayClick={playTelemetryBlip}
          onReturnToDashboard={() => {
            setViewMode('editorial');
            playTelemetryBlip();
          }}
        />
      )}

      {/* Deep Metric Comparison Modal Drawer */}
      <MetricComparisonDrawer
        pair={detailedPair}
        onClose={() => setDetailedPair(null)}
        tempUnit={tempUnit}
      />

      {/* Google Drive Archive & Presets Modal */}
      <GoogleDrivePanel
        isOpen={isDriveOpen}
        onClose={() => setIsDriveOpen(false)}
        currentPreset={currentPreset}
        onApplyPreset={handleApplyPreset}
        onCaptureCanvasDataUrl={handleCaptureCanvasDataUrl}
      />
    </div>
  );
}
