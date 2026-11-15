// TEMPORARY: approximate runway data for testing the dashboard AWOS without a Navigraph database. Remove before PR.
import type { NavigraphRunway } from '~/types/data/navigraph';

function pair(airport: string, a: string, b: string, trueA: number, magA: number, elevA: number, elevB: number, length: number): NavigraphRunway[] {
    const base = { runway_latitude: 0, runway_longitude: 0, runway_length: length, runway_width: 150, airport_identifier: airport };
    return [
        { ...base, runway_identifier: `RW${ a }`, runway_true_bearing: trueA, runway_magnetic_bearing: magA, landing_threshold_elevation: elevA },
        { ...base, runway_identifier: `RW${ b }`, runway_true_bearing: (trueA + 180) % 360, runway_magnetic_bearing: (magA + 180) % 360, landing_threshold_elevation: elevB },
    ] as NavigraphRunway[];
}

export const devRunways: Record<string, NavigraphRunway[]> = {
    LEPA: [...pair('LEPA', '06L', '24R', 59.6, 58.2, 18, 24, 10728), ...pair('LEPA', '06R', '24L', 59.6, 58.2, 14, 20, 9842)],
    KJFK: [...pair('KJFK', '04L', '22R', 31.1, 44.0, 12, 13, 12079), ...pair('KJFK', '04R', '22L', 31.1, 44.0, 12, 12, 8400), ...pair('KJFK', '13L', '31R', 121.1, 134.0, 13, 13, 10000), ...pair('KJFK', '13R', '31L', 121.1, 134.0, 13, 13, 14511)],
    UUEE: [...pair('UUEE', '06L', '24R', 73.2, 61.9, 604, 622, 11483), ...pair('UUEE', '06R', '24L', 73.2, 61.9, 600, 630, 12139)],
    EGLL: [...pair('EGLL', '09L', '27R', 89.7, 89.6, 79, 77, 12802), ...pair('EGLL', '09R', '27L', 89.7, 89.6, 75, 78, 12008)],
    KLGA: [...pair('KLGA', '04', '22', 31.3, 44.0, 20, 13, 7001), ...pair('KLGA', '13', '31', 121.3, 134.0, 11, 21, 7003)],
    KEWR: [...pair('KEWR', '04L', '22R', 26.4, 39.0, 13, 18, 11000), ...pair('KEWR', '04R', '22L', 26.4, 39.0, 11, 9, 10000), ...pair('KEWR', '11', '29', 95.4, 108.0, 17, 12, 6726)],
};
