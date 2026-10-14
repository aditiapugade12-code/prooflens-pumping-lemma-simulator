// Shared proof content for { Aⁿ Bⁿ | n ≥ 0 } (a/b or 0/1). Plain-English wording.
import { PROOF_LANGS } from './pumpingLogic.js';

export const buildProofSteps = (langId, p = 3) => {
  const { A, B, label } = PROOF_LANGS[langId];
  const w = A.repeat(p) + B.repeat(p);
  const down = A.repeat(Math.max(p - 1, 0)) + B.repeat(p);
  const up = A.repeat(p + 1) + B.repeat(p);
  return [
    {
      title: 'Our assumption',
      text: 'First, assume that the language is regular. If it were regular, it would have a pumping length p.',
      what: 'We start a proof by contradiction: we pretend L is regular.',
      why: 'If this pretending leads to something impossible, the pretending must have been wrong.',
      string: 'No string yet. We only know a number p exists (p ≥ 1).',
      meaning: 'Every regular language has a pumping length p. We do not know its value, so the argument must work for any p.'
    },
    {
      title: 'Choose a string',
      text: `Choose a string containing p ${A}'s followed by p ${B}'s. For example, if p = 3, the string is ${A.repeat(3)}${B.repeat(3)}.`,
      what: `We pick w = ${A}ᵖ${B}ᵖ. With p = ${p} this is ${w}.`,
      why: `It is in L (equal numbers of ${A}'s and ${B}'s) and its length 2p is at least p, so the Pumping Lemma applies to it.`,
      string: `w = ${w}: the first ${p} characters are ${A}'s, the last ${p} are ${B}'s.`,
      meaning: 'We chose the string cleverly: its front part is one block of identical letters.'
    },
    {
      title: 'Understand the split',
      text: 'The Pumping Lemma divides the string into three parts: x, y and z. The first condition says y must contain at least one character. The second condition says that x and y together must fit within the first p characters.',
      what: 'We write w = xyz and note the two rules: |y| ≥ 1 and |xy| ≤ p.',
      why: 'The lemma only promises a split that obeys these two rules. We must handle every split that obeys them, not just one.',
      string: `For ${w} with p = ${p}: x and y must both sit inside the first ${p} characters. z is whatever remains.`,
      meaning: 'We are not choosing the split. The lemma could pick any legal one, so our argument must beat all of them.'
    },
    {
      title: 'What does this tell us?',
      text: `The first p characters are all ${A}'s. Therefore, y contains only ${A}'s, and it contains at least one ${A}.`,
      what: `We combine the rules with the shape of w. x and y lie in the first p characters, and those are all ${A}'s.`,
      why: `This holds for every legal split, however x and y are placed. That is why one argument covers all of them.`,
      string: `In ${w}, y is some block of ${A}'s, for example "${A}" or "${A}${A}", taken from the front. x is the ${A}'s before it.`,
      meaning: `Whatever the lemma picks, y = ${A}ᵏ with k ≥ 1. Only the number of ${A}'s can change when we pump.`
    },
    {
      title: 'Pump the string',
      text: `Repeat y one extra time. This adds one or more ${A}'s but does not add any ${B}'s.`,
      what: 'We use i = 2, so the new string is xy²z (y appears twice). Using i = 0 (removing y) would work too.',
      why: `y is only ${A}'s, so repeating it adds ${A}'s and leaves the ${B}'s alone.`,
      string: `Example: y = "${A}" gives ${up}. Now there are ${p + 1} ${A}'s and ${p} ${B}'s.`,
      meaning: `The ${A} count goes up by k, where k = |y| ≥ 1. The ${B} count stays ${p}.`
    },
    {
      title: 'Check the result',
      text: `Now the string has more ${A}'s than ${B}'s. But our language requires the number of ${A}'s and ${B}'s to be equal. Therefore, the new string is not in the language.`,
      what: `We compare the counts: ${A}'s = p + k, ${B}'s = p.`,
      why: `Since k ≥ 1, p + k is never equal to p, so the equal-count rule of L is broken.`,
      string: `${up} has ${p + 1} ${A}'s and ${p} ${B}'s, so it is not in L. (Pumping down instead gives ${down}: ${p - 1} ${A}'s and ${p} ${B}'s, also not in L.)`,
      meaning: 'For every legal split, xy²z is outside L.'
    },
    {
      title: 'Contradiction',
      text: 'We assumed the language was regular, but the string violates a property that every regular language must satisfy under the Pumping Lemma. Therefore, our assumption is false.',
      what: 'We compare what we found with what the lemma promises.',
      why: 'The lemma promises that SOME legal split keeps xyⁱz in L for all i ≥ 0. We showed that NO legal split does.',
      string: `Every legal split of ${w} fails when pumped (i = 0 and i = 2 both leave L).`,
      meaning: 'Our starting assumption (L is regular) cannot be true.'
    }
  ];
};

export const conclusionText = (langId) =>
  `THE LANGUAGE L = ${PROOF_LANGS[langId].label} IS NOT REGULAR.`;
