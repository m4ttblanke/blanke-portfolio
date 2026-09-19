"use client";

import { useSyncExternalStore } from "react";

// Clean Copy / Vandalized: a viewer preference, not a second site.
//
// The attribute is set on <html> BEFORE first paint by the inline script in
// app/layout.tsx, so there is no flash. This control only reads and flips it.
// Server render and hydration both assume "not clean"; React then re-renders
// with the real value, which changes one aria attribute and nothing in layout.
//
// Only the /proof sheet mounts this. Whether Clean Copy ever becomes a
// visitor-facing control is undecided and deferred (docs/ART_DIRECTION.md, §10);
// do not add it to the site shell or navigation yet.

const EVENT = "copychange";

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}

const isClean = () => document.documentElement.dataset.copy === "clean";

export function CleanCopyToggle({ className = "btn-quiet" }: { className?: string }) {
  const clean = useSyncExternalStore(subscribe, isClean, () => false);

  function toggle() {
    const next = !clean;
    if (next) document.documentElement.dataset.copy = "clean";
    else delete document.documentElement.dataset.copy;
    try {
      localStorage.setItem("copy", next ? "clean" : "vandalized");
    } catch {
      // Private mode or blocked storage: the preference just will not persist.
    }
    window.dispatchEvent(new Event(EVENT));
  }

  return (
    <button type="button" className={className} aria-pressed={clean} onClick={toggle}>
      Clean copy
    </button>
  );
}
