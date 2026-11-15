import { findAndRefreshUserByCookie } from '~/utils/server/user';
import { getNavigraphRunways } from '~/utils/server/navigraph';
import { getBulkAirportIcaos, mapAirportsInBatches } from '~/utils/server/vatsim/airport-data';
import { isDebug } from '~/utils/server/debug';
import type { NavigraphRunway } from '~/types/data/navigraph';
import { devRunways } from '~/utils/server/navigraph/dev-runways';

/**
 * Lightweight bulk runway lookup (no gates/layout) for dashboard AWOS.
 * Subscribers get the current AIRAC, everyone else the outdated database, same as the airport endpoint.
 */
export default defineEventHandler(async (event): Promise<Record<string, NavigraphRunway[]> | undefined> => {
    const airports = getBulkAirportIcaos(event);
    if (!airports) return;

    const user = await findAndRefreshUserByCookie(event);

    const results = await mapAirportsInBatches(airports, async icao => {
        const runways = await getNavigraphRunways({ user, icao, event }) ?? [];
        // TEMPORARY: dev-only fallback while testing without a Navigraph database. Remove before PR.
        if (import.meta.dev && !runways.length && devRunways[icao]) return [icao, devRunways[icao]] as const;
        return [icao, runways] as const;
    });

    if (!isDebug()) {
        // Response depends on the user's subscription, so it must stay private
        setResponseHeader(event, 'Cache-Control', 'private, max-age=86400');
    }

    return Object.fromEntries(results);
});
