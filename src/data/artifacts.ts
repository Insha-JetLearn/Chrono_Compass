import { Artifact } from '../types/game';

export const SACRED_ARTIFACTS: Record<string, Artifact> = {
  scarab: {
    id: 'scarab',
    name: 'Golden Scarab',
    chamberUnlockedAt: 1,
    rarity: 'Common',
    description: 'A polished talisman symbolizing rebirth and the dawn of knowledge.',
    lore: 'Discovered half-buried in the Entrance Hall. Its emerald eye hums with chronological resonance.',
    iconName: 'Shield'
  },
  eye_of_horus: {
    id: 'eye_of_horus',
    name: 'Eye of Horus',
    chamberUnlockedAt: 3,
    rarity: 'Rare',
    description: 'The ancient symbol of protection, royal power, and sharpened perception.',
    lore: 'Found among the silent sentinels in the Hall of Statues. It grants the bearer clarity against illusions.',
    iconName: 'Eye'
  },
  crystal_ankh: {
    id: 'crystal_ankh',
    name: 'Crystal Ankh',
    chamberUnlockedAt: 5,
    rarity: 'Epic',
    description: 'The key of timeless life carved from subterranean azurite crystal.',
    lore: 'Retrieved from the tranquil depths of the Underground Oasis. It channels the flowing essence of life.',
    iconName: 'Key'
  },
  celestial_compass: {
    id: 'celestial_compass',
    name: 'Celestial Compass',
    chamberUnlockedAt: 7,
    rarity: 'Epic',
    description: 'A stellar astrolabe aligned with Sirius and the northern constellations.',
    lore: 'Recovered from the stone observatory. Its rotating rings map time through eternal stellar coordinates.',
    iconName: 'Compass'
  },
  royal_sunstone: {
    id: 'royal_sunstone',
    name: 'Royal Sunstone',
    chamberUnlockedAt: 8,
    rarity: 'Legendary',
    description: 'A brilliant gem that radiates warm solar energy even in deepest darkness.',
    lore: 'Hidden inside the fortified Royal Treasury amidst perilous ancient wards. It glows like Ra himself.',
    iconName: 'Sun'
  },
  pharaoh_seal: {
    id: 'pharaoh_seal',
    name: "Pharaoh's Seal",
    chamberUnlockedAt: 9,
    rarity: 'Mythic',
    description: 'The ultimate royal cartouche embodying sovereignty over time and eternity.',
    lore: 'Unsealed within the Pharaoh’s inner sanctum. Re-energizes the Chrono Compass to full celestial power.',
    iconName: 'Crown'
  }
};
