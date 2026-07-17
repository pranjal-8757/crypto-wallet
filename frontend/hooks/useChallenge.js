'use client';

import { useCallback, useState } from 'react';

const GRID_SIZE = 9;

/**
 * Manages local state for a Visual Password "challenge" -- the
 * grid/pattern the user selects during verification.
 *
 * This does NOT talk to a backend. `start()` currently builds a
 * placeholder grid locally so the UI has something to render. Once
 * services/challengeService.js is backed by a real API, `start()`
 * should call `challengeService.startChallenge(...)` and store the
 * returned grid/challengeId here instead.
 */
export function useChallenge() {
  const [grid, setGrid] = useState(null);
  const [challengeId, setChallengeId] = useState(null);
  const [selection, setSelection] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const start = useCallback(() => {
    setLoading(true);
    setError(null);

    // Placeholder grid -- replace with challengeService.startChallenge().
    const placeholderGrid = Array.from({ length: GRID_SIZE }, (_, i) => ({ id: i }));

    setGrid(placeholderGrid);
    setChallengeId(`local-challenge-${Date.now()}`);
    setSelection([]);
    setLoading(false);
  }, []);

  const toggleCell = useCallback((cellId) => {
    setSelection((prev) =>
      prev.includes(cellId) ? prev.filter((id) => id !== cellId) : [...prev, cellId]
    );
  }, []);

  const reset = useCallback(() => {
    setGrid(null);
    setChallengeId(null);
    setSelection([]);
    setError(null);
  }, []);

  return {
    grid,
    challengeId,
    selection,
    loading,
    error,
    start,
    toggleCell,
    reset,
    hasSelection: selection.length > 0,
  };
}
