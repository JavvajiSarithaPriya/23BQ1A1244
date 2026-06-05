"use client";

import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "campus_notifications_viewed";

export function useViewedNotifications() {
  const [viewedSet, setViewedSet] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const ids = JSON.parse(saved) as string[];
        setViewedSet(new Set(ids));
      }
    } catch {
      setViewedSet(new Set());
    }
  }, []);

  const viewedIds = useMemo(() => viewedSet, [viewedSet]);

  const saveViewed = (newSet: Set<string>) => {
    setViewedSet(newSet);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(newSet)));
    } catch {
      // ignore storage failures
    }
  };

  const markViewed = (id: string) => {
    saveViewed(new Set(viewedIds).add(id));
  };

  const markUnviewed = (id: string) => {
    const next = new Set(viewedIds);
    next.delete(id);
    saveViewed(next);
  };

  const toggleViewed = (id: string) => {
    if (viewedIds.has(id)) {
      markUnviewed(id);
    } else {
      markViewed(id);
    }
  };

  const markAllViewed = (ids: string[]) => {
    const next = new Set(viewedIds);
    ids.forEach((id) => next.add(id));
    saveViewed(next);
  };

  const isViewed = (id: string) => viewedIds.has(id);

  return { viewedIds, isViewed, markViewed, markAllViewed, toggleViewed };
}
