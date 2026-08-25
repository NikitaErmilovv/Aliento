import { getPartyTheme } from "@/lib/party-events";

/** Gradient accents for subscription tiers (matches party card palette). */
export function getPlanTheme(classCount: number) {
  if (classCount >= 8) return getPartyTheme(8);
  if (classCount >= 4) return getPartyTheme(7);
  return getPartyTheme(6);
}
