"use client";

import React, { useState, useSyncExternalStore } from "react";

import Scene from "@/app/components/scene/Scene";
import { E2eSceneProbe } from "@/app/components/scene/E2eSceneProbe";
import FirstLoadSpinner from "@/app/components/interface/misc/FirstLoadSpinner";
import { BodySelector } from "@/app/components/chrome/BodySelector";
import { FrameCompass } from "@/app/components/chrome/FrameCompass";
import { RightColumn } from "@/app/components/chrome/RightColumn";
import { EventLogCard } from "@/app/components/chrome/EventLogCard";
import { SimSetupModal } from "@/app/components/chrome/simSetup/SimSetupModal";
import { Timeline } from "@/app/components/chrome/Timeline";
import { TopStatusStrip } from "@/app/components/chrome/TopStatusStrip";
import { DevPanel } from "@/app/components/dev/DevPanel";
import { PlaybackGate } from "@/app/components/chrome/PlaybackGate";
import { TourOverlay } from "@/app/components/interface/tour/TourOverlay";
import { useIsMobile } from "@/app/utils/useIsMobile";
import { MobileChrome } from "@/app/components/chrome/mobile/MobileChrome";
import { FirstMountAutorun } from "@/app/components/chrome/FirstMountAutorun";

const Layout: React.FC = () => {
  const [simSetupOpen, setSimSetupOpen] = useState(false);

  // Read ?dev=… once on mount. useSyncExternalStore is the React-canonical
  // pattern for "read an external value once" — SSR snapshot returns false
  // (server has no window), client snapshot reads the URL on hydration.
  // No re-subscription since the URL doesn't change mid-session.
  const devMode = useSyncExternalStore(
    () => () => {},
    () => new URLSearchParams(window.location.search).has("dev"),
    () => false,
  );

  const isMobile = useIsMobile();

  return (
    <div className="flex w-screen h-screen overflow-hidden">
      <div className="grow relative overflow-hidden">
        {/* Load-time background fallback — visible only during the brief
            gap before the skybox JPG loads (Skybox.tsx mounts the texture
            on scene.background, which then covers this layer). The
            Canvas inside <Scene /> is transparent (gl.alpha=true) so
            this layer shows through until the skybox is in place.

            LQIP: a 64×32 heavily-blurred crop of the full skybox JPG,
            inlined as base64 (~0.5 KB) so it ships with the HTML and
            renders at zero network cost. Stretched to cover via CSS
            (background-size: cover). When the full equirect skybox
            loads on top, the visible transition is "soft blur sharpens
            into stars" rather than "blue gradient flips to starfield".
            The CSS projection isn't an exact match for three.js's
            spherical projection of the equirect, but at this blur level
            only luminance + colour gradients matter — the dominant
            darkness + faint Milky Way smear sells the continuity. */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: `url("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDABIMDRANCxIQDhAUExIVGywdGxgYGzYnKSAsQDlEQz85Pj1HUGZXR0thTT0+WXlaYWltcnNyRVV9hnxvhWZwcm7/2wBDARMUFBsXGzQdHTRuST5Jbm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm7/wAARCAAgAEADASIAAhEBAxEB/8QAGQAAAwEBAQAAAAAAAAAAAAAAAAIDBAEG/8QAGxAAAgMBAQEAAAAAAAAAAAAAAAECERMEAxT/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A8VQUUzYZsCdBRbJjQ53J0gIUFGqXJJCPnaAhQUWxZx+TAXRnV6kgAtqxodLgzOAGuXZKQn0NmcLAvszj9WSsLA//2Q==") center/cover, var(--color-space)`,
          }}
        >
          <Scene />
          {process.env.NEXT_PUBLIC_E2E === "1" && <E2eSceneProbe />}
        </div>

        {/* UI Overlays. Each chrome component opts itself into pointer
            events; the wrapper is pointer-events:none so the scene
            beneath stays grabbable wherever chrome doesn't sit. */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <FirstLoadSpinner />

          {isMobile ? (
            <MobileChrome />
          ) : (
            <>
              <TopStatusStrip
                onSimSetupClick={() => setSimSetupOpen(true)}
                simSetupActive={simSetupOpen}
              />
              <BodySelector />
              <FrameCompass />
              <RightColumn />

              {/* Event log — docked bottom-left, just above the timeline.
                  Collapsible (collapsed by default); expands upward into the
                  scene, capped so it scrolls internally rather than overrunning
                  the top chrome. */}
              <div className="pointer-events-auto absolute bottom-[160px] left-6 w-[316px]">
                <EventLogCard />
              </div>

              <Timeline />

              <SimSetupModal open={simSetupOpen} onOpenChange={setSimSetupOpen} />

              <TourOverlay simSetupOpen={simSetupOpen} />
            </>
          )}

          {/* Shared by both chromes, rendered once outside the responsive
              branch so they survive the breakpoint swap. FirstMountAutorun
              plays the default clip a single time on first load; PlaybackGate
              handles hidden-tab auto-pause + the idle "still watching?" card
              for unattended live sessions. */}
          <FirstMountAutorun />
          <PlaybackGate />

          {devMode && <DevPanel />}
        </div>
      </div>
    </div>
  );
};

export default Layout;
