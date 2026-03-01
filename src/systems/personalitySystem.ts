import {
  PersonalityState,
  PersonalityTraits,
  PersonalityTrait,
  PersonalityAxis,
  PersonalityWeight,
} from '../types';

const TRAIT_SHIFT_BASE = 2;
const TRAIT_MAX = 100;
const TRAIT_MIN = -100;

export const createInitialPersonality = (): PersonalityState => ({
  traits: {
    brave_cautious: 0,
    loyal_independent: 0,
    playful_proud: 0,
    curious_shadowy: 0,
  },
  dominantTrait: 'curious',
  quirks: [],
});

export const applyPersonalityShift = (
  personality: PersonalityState,
  weights: PersonalityWeight[],
): PersonalityState => {
  const newTraits = { ...personality.traits };

  for (const w of weights) {
    const current = newTraits[w.axis];
    const shift = w.value * TRAIT_SHIFT_BASE;
    newTraits[w.axis] = clamp(current + shift, TRAIT_MIN, TRAIT_MAX);
  }

  const dominantTrait = getDominantTrait(newTraits);
  const quirks = computeQuirks(newTraits);

  return { traits: newTraits, dominantTrait, quirks };
};

export const getDominantTrait = (traits: PersonalityTraits): PersonalityTrait => {
  const axes: { axis: PersonalityAxis; positive: PersonalityTrait; negative: PersonalityTrait }[] = [
    { axis: 'brave_cautious', positive: 'brave', negative: 'cautious' },
    { axis: 'loyal_independent', positive: 'loyal', negative: 'independent' },
    { axis: 'playful_proud', positive: 'playful', negative: 'proud' },
    { axis: 'curious_shadowy', positive: 'curious', negative: 'shadowy' },
  ];

  let maxAbs = 0;
  let dominant: PersonalityTrait = 'curious';

  for (const a of axes) {
    const val = traits[a.axis];
    const abs = Math.abs(val);
    if (abs > maxAbs) {
      maxAbs = abs;
      dominant = val >= 0 ? a.positive : a.negative;
    }
  }

  return dominant;
};

export const computeQuirks = (traits: PersonalityTraits): string[] => {
  const quirks: string[] = [];
  const threshold = 60;

  if (traits.brave_cautious > threshold) quirks.push('fearless');
  if (traits.brave_cautious < -threshold) quirks.push('wary');
  if (traits.loyal_independent > threshold) quirks.push('devoted');
  if (traits.loyal_independent < -threshold) quirks.push('lone_wolf');
  if (traits.playful_proud > threshold) quirks.push('trickster');
  if (traits.playful_proud < -threshold) quirks.push('dignified');
  if (traits.curious_shadowy > threshold) quirks.push('explorer');
  if (traits.curious_shadowy < -threshold) quirks.push('enigmatic');

  // Combo quirks
  if (traits.brave_cautious > 40 && traits.curious_shadowy > 40) {
    quirks.push('adventurer');
  }
  if (traits.loyal_independent > 40 && traits.playful_proud > 40) {
    quirks.push('companion');
  }
  if (traits.brave_cautious < -40 && traits.curious_shadowy < -40) {
    quirks.push('shadow_stalker');
  }

  return quirks;
};

export const getPersonalityModifier = (
  trait: PersonalityTrait,
): { statBoost: Partial<Record<string, number>>; description: string } => {
  const modifiers: Record<PersonalityTrait, { statBoost: Partial<Record<string, number>>; description: string }> = {
    brave: { statBoost: { xpMultiplier: 1.1 }, description: 'personality.brave_desc' },
    cautious: { statBoost: { decayReduction: 0.9 }, description: 'personality.cautious_desc' },
    loyal: { statBoost: { bondMultiplier: 1.2 }, description: 'personality.loyal_desc' },
    independent: { statBoost: { exploreBonus: 1.15 }, description: 'personality.independent_desc' },
    playful: { statBoost: { happinessBonus: 1.15 }, description: 'personality.playful_desc' },
    proud: { statBoost: { rarityBonus: 1.1 }, description: 'personality.proud_desc' },
    curious: { statBoost: { discoveryBonus: 1.2 }, description: 'personality.curious_desc' },
    shadowy: { statBoost: { resourceBonus: 1.15 }, description: 'personality.shadowy_desc' },
  };
  return modifiers[trait];
};

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));
