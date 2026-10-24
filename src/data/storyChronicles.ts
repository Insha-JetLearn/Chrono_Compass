export interface StoryChapter {
  chamberId: number;
  chamberTitle: string;
  chapterTitle: string;
  inscriptionText: string;
  narrativeText: string;
  historicalMathLore: string;
  unlockedAt: 'visited' | 'completed';
}

export const EXPEDITION_CHRONICLES: StoryChapter[] = [
  {
    chamberId: 1,
    chamberTitle: 'Entrance Hall',
    chapterTitle: 'Chapter I: The Threshold of Dawn',
    inscriptionText: '𓇋𓏠𓈖𓊵𓏏𓊪 — "He who seeks the harmony of numbers shall awaken the sleeping sands."',
    narrativeText: 'Blowing back the curtain of red desert dust, our expedition discovered the lost entrance of the Pyramid of Chronos. Embedded in the threshold stone lay the Chrono Compass, cold and immobile. When my hand touched its lapis ring, a spark of celestial blue light burst forth, coalescing into Nuru, a celestial spirit who has guarded this sanctuary since the fourth dynasty.',
    historicalMathLore: 'Ancient Egyptian scribes were masters of practical geometry. The pyramid’s four base corners align with true north, south, east, and west to within a fraction of a single degree—calculated using the stars without modern compasses.',
    unlockedAt: 'visited'
  },
  {
    chamberId: 2,
    chamberTitle: 'Sand Chamber',
    chapterTitle: 'Chapter II: Sand and Symmetry',
    inscriptionText: '𓈖𓆓𓐝𓏛 — "As sand pours through the hour-vessel, nine stones must find their rightful seats."',
    narrativeText: 'Fine golden sand cascaded like a golden waterfall from the ceiling vaults. Etched into the sandstone walls was the first great riddle: a 9×9 matrix where every row and column formed a complete balance of nine cosmic forces. As each correct digit was inscribed, the falling sands began to slow, turning into solid alabaster steps.',
    historicalMathLore: 'The Rhind Mathematical Papyrus (c. 1550 BCE) shows that Egyptian scribes used unit fractions and arithmetic progressions to calculate food rations, temple stones, and survey land flooded by the Nile.',
    unlockedAt: 'visited'
  },
  {
    chamberId: 3,
    chamberTitle: 'Hall of Statues',
    chapterTitle: 'Chapter III: The Sentinels of Anubis',
    inscriptionText: '𓃣𓏏𓊃 — "Nine guardians watch the corridor; each holds a key that none other may bear."',
    narrativeText: 'Colossal granite statues of Anubis, Horus, and Thoth towered into the torchlit gloom. Each statue held a ceremonial stone tablet. Completing the Sudoku puzzle in this hall aligned the statues in ceremonial salute, revealing a hidden alcove containing the gleaming Eye of Horus relic.',
    historicalMathLore: 'The Eye of Horus was ancient Egypt’s fractional mathematics system: the eyebrow stood for 1/8, the pupil for 1/4, the inner corner for 1/2, the outer tail for 1/16, the curved tail for 1/32, and the teardrop for 1/64—totaling 63/64, with the missing 1/64 supplied by Thoth’s magic.',
    unlockedAt: 'visited'
  },
  {
    chamberId: 4,
    chapterTitle: 'Chapter IV: The Papyrus of Scribes',
    chamberTitle: 'Hidden Library',
    inscriptionText: '𓏞𓏏𓏜 — "Knowledge is the only fortress whose walls never crumble before time."',
    narrativeText: 'Carved bedrock shelves preserved thousands of papyrus scrolls that have survived unburned for three millennia. Here, the royal astronomers recorded the true nature of the Chrono Compass: it is not a mere timepiece, but an astronomical calculating engine capable of measuring planetary cycles and celestial epochs.',
    historicalMathLore: 'Egyptian scribes utilized the seked—a ratio of run to rise (horizontal displacement per vertical cubit)—to ensure the precise 51.8° incline of the Great Pyramid sides remained uniform all the way to the apex.',
    unlockedAt: 'visited'
  },
  {
    chamberId: 5,
    chamberTitle: 'Underground Oasis',
    chapterTitle: 'Chapter V: The Azure Reflection Pool',
    inscriptionText: '𓈗𓏥𓆑 — "Living waters reveal that which the arid earth conceals."',
    narrativeText: 'Deep beneath the desert bedrock, we emerged into a luminous underground cavern fed by a pristine subterranean spring. Glowing blue lotus blossoms floated upon still waters. Harmonizing the Sudoku matrix cleared the azure pool, exposing an azurite altar that yielded the Crystal Ankh.',
    historicalMathLore: 'The Nile flood (Akhet) dictated the Egyptian 365-day calendar: three seasons of four months each (Inundation, Growing, Harvest), plus five sacred epagomenal days celebrating the birthdays of the gods.',
    unlockedAt: 'visited'
  },
  {
    chamberId: 6,
    chamberTitle: 'Crystal Cavern',
    chapterTitle: 'Chapter VI: Harmonics of Lapis and Quartz',
    inscriptionText: '𓐝𓈎𓏏𓊌 — "Every stone resonates; let the numbers dictate the pitch."',
    narrativeText: 'Giant amethyst geodes and lapis lazuli pillars jutted from the ceiling, vibrating with acoustic resonance whenever numbers were placed on the puzzle altar. When the final digit clicked into position, the cavern sang in a triumphant chord and focused refracted light beams towards the observatory above.',
    historicalMathLore: 'Ancient Egyptian architects discovered acoustic resonance inside burial chambers, utilizing granite beam ceilings that dampened seismic shocks and amplified ritual chanting frequencies.',
    unlockedAt: 'visited'
  },
  {
    chamberId: 7,
    chamberTitle: "Astronomer's Chamber",
    chapterTitle: 'Chapter VII: The Cross of Sirius',
    inscriptionText: '𓇯𓏥𓇳 — "Look to Sopdet in the eastern sky; let diagonals guide the royal astrolabe."',
    narrativeText: 'Under a hemispherical ceiling painted with indigo constellations and golden decan stars, the Sudoku matrix was inscribed along cosmic diagonal axes. Completing the puzzle aligned the telescope slit with the star Sirius, unsealing the Celestial Compass artifact.',
    historicalMathLore: 'The heliacal rising of Sirius (called Sopdet by Egyptians) heralded the annual flooding of the Nile. Egyptian astronomers divided the night sky into 36 "decans" to measure the hours of the night with remarkable precision.',
    unlockedAt: 'visited'
  },
  {
    chamberId: 8,
    chamberTitle: 'Royal Treasury',
    chapterTitle: 'Chapter VIII: Gold and the Cursed Ward',
    inscriptionText: '𓋞𓃀𓏏𓊮 — "He who grasps without reckoning shall trigger the wrath of the entombed."',
    narrativeText: 'Piles of gold amulets, lapis rings, and gilded chalices filled the vaulted treasury. However, the Pharaoh’s high priests had laid an explosive curse upon careless moves. By exercising patient logic and avoiding the trapped ward tile, we retrieved the blazing Royal Sunstone.',
    historicalMathLore: 'Treasury scribes weighed gold in deben (approx. 91 grams) and kite (approx. 9.1 grams), tracking balance sheets on pottery shards (ostraca) with double-entry accounting methods.',
    unlockedAt: 'visited'
  },
  {
    chamberId: 9,
    chamberTitle: "Pharaoh's Chamber",
    chapterTitle: 'Chapter IX: The Awakening of the Sun King',
    inscriptionText: '𓇳𓏠𓈖𓊵 — "Time is unbroken. The master of the nine matrices holds eternity in their palm."',
    narrativeText: 'Standing before the golden sarcophagus and the central astrolabe altar, we faced the ultimate Sudoku challenge created by the Pharaoh’s greatest royal mathematicians. With the insertion of the ninth and final digit, the Chrono Compass ignited with blinding golden light, spinning smoothly as its temporal gears restored eternity to the pyramid.',
    historicalMathLore: 'The ancient Egyptian concept of eternity was twofold: Neheh (cyclical time, like the sunrise and seasons) and Djet (linear permanence, like the enduring stone pyramids and the realm of Osiris).',
    unlockedAt: 'completed'
  }
];
