import { atom } from "jotai";

import type { VisitStatistics } from "~/orpc/website-visits/contract";

/*===== Shared Statistics State =====*/

type WebsiteVisitsState = { statistics?: VisitStatistics; failed: boolean };

// The runtime alone publishes browser query results; TanStack Query owns fetching and caching.
export const websiteVisitsStateAtom = atom<WebsiteVisitsState>({ failed: false });
