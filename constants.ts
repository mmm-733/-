import { ShiseikanTrait } from './types';

export const SHISEIKAN_PAIRS: [ShiseikanTrait, ShiseikanTrait][] = [
  ['D', 'W'], // 運命論 vs 自由意志
  ['S', 'M'], // 精神主義 vs 現実主義
  ['A', 'R'], // 受容 vs 抗い
  ['I', 'C'], // 個人主義 vs 共同体主義
];

export const TOTAL_QUESTIONS = 12;

export const TRAIT_LABELS: Record<ShiseikanTrait, string> = {
  D: '運命論',
  W: '自由意志',
  S: '精神主義',
  M: '現実主義',
  A: '受容',
  R: '抗い',
  I: '個人主義',
  C: '共同体主義',
};
