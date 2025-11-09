export type AppState = 'start' | 'quiz' | 'loading' | 'result' | 'error';

// D: 運命論, W: 自由意志
// S: 精神主義, M: 現実主義
// A: 受容, R: 抗い
// I: 個人主義, C: 共同体主義
export type ShiseikanTrait = 'D' | 'W' | 'S' | 'M' | 'A' | 'R' | 'I' | 'C';

export interface Question {
  question: string;
  // 例: ['D', 'W'] - スケールの1側が'D'（運命論）、10側が'W'（自由意志）
  traitPair: [ShiseikanTrait, ShiseikanTrait];
}

export type AnswerScore = {
  score: number;
  traitPair: [ShiseikanTrait, ShiseikanTrait];
};

export interface PersonalityResult {
  type: string;
  title: string;
  description: string;
}
