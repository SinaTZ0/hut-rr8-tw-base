import { ORPCError } from "@orpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";

import { orpc } from "~/orpc/client";
import { isPublicVisitPathname, normalizeVisitPathname, VISIT_REFRESH_MS } from "~/orpc/website-visits/constants";
import type { VisitStatistics } from "~/orpc/website-visits/contract";

import { websiteVisitsStateAtom } from "./website-visits-state";

/*===== Document Visit and Presence Lifecycle =====*/

export function WebsiteVisitsRuntime() {
  const queryClient = useQueryClient();
  const setStatisticsState = useSetAtom(websiteVisitsStateAtom);
  const location = useLocation();
  // The root survives client navigation. Capture its entry path once so only a new document records a visit.
  const [pathname] = useState(() => normalizeVisitPathname(location.pathname));
  const eligible = isPublicVisitPathname(pathname);
  const hasRecordedVisit = useRef(false);
  const [trackingFailed, setTrackingFailed] = useState(false);
  const summaryOptions = orpc.websiteVisits.summary.queryOptions();
  const summary = useQuery({
    ...summaryOptions,
    enabled: isPublicVisitPathname(pathname),
    retry: false,
    refetchOnWindowFocus: false,
  });

  async function acceptStatistics(statistics: VisitStatistics) {
    // Cancel an older summary before updating its cache so it cannot replace newer write results.
    await queryClient.cancelQueries({ queryKey: summaryOptions.queryKey });
    queryClient.setQueryData(summaryOptions.queryKey, statistics);
    setTrackingFailed(false);
  }

  // A shared mutation scope serializes cookie creation and subsequent presence confirmation.
  const { mutateAsync: record } = useMutation({
    ...orpc.websiteVisits.record.mutationOptions(),
    scope: { id: "website-visits" },
    retry: (attempt, error) =>
      attempt < 1 &&
      (!(error instanceof ORPCError) || ["DATABASE_UNAVAILABLE", "INTERNAL_SERVER_ERROR"].includes(error.code)),
    retryDelay: 1000,
    onSuccess: acceptStatistics,
    onError: () => setTrackingFailed(true),
  });
  const { mutateAsync: heartbeat } = useMutation({
    ...orpc.websiteVisits.heartbeat.mutationOptions(),
    scope: { id: "website-visits" },
    retry: false,
    onSuccess: acceptStatistics,
    onError: () => setTrackingFailed(true),
  });
  const { refetch } = summary;

  /*------ Shared State Snapshot ------*/

  // Publishing in an effect leaves SSR and initial hydration at the atom's placeholder state.
  useEffect(() => {
    setStatisticsState({ statistics: summary.data, failed: summary.isError || trackingFailed });
  }, [setStatisticsState, summary.data, summary.isError, trackingFailed]);

  /*------ Browser Visit Lifecycle ------*/

  useEffect(() => {
    function canRefresh() {
      return eligible && document.visibilityState === "visible" && navigator.onLine;
    }

    function permitsTracking() {
      const privacy = navigator as Navigator & { globalPrivacyControl?: boolean };
      return import.meta.env.PROD && navigator.doNotTrack !== "1" && !privacy.globalPrivacyControl;
    }

    function refresh() {
      if (!canRefresh()) return;
      if (!permitsTracking()) {
        void refetch();
        return;
      }
      if (!hasRecordedVisit.current) {
        const eventId = crypto.randomUUID();
        hasRecordedVisit.current = true;
        // The same UUID survives mutation retries and effect replays. No request is sent from SSR.
        void record({ eventId, pathname })
          .then(() => {
            // A response can arrive after the tab was hidden or the privacy preference changed.
            if (canRefresh() && permitsTracking()) return heartbeat();
          })
          .catch(() => undefined);
      } else {
        void heartbeat().catch(() => undefined);
      }
    }

    refresh();
    const timer = window.setInterval(refresh, VISIT_REFRESH_MS);
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("online", refresh);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("online", refresh);
    };
  }, [eligible, pathname, record, heartbeat, refetch]);

  return null;
}
