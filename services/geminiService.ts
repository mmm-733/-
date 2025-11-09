import { GoogleGenAI, Type } from "@google/genai";
import { PersonalityResult, Question, ShiseikanTrait } from '../types';
import { TOTAL_QUESTIONS } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const questionSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            question: {
                type: Type.STRING,
                description: 'ユーザーが1から10のスケールで答える、日本語の死生観に関する哲学的な質問。'
            },
            traitPair: {
                type: Type.ARRAY,
                description: 'この質問が測定する死生観の特性のペア。最初の要素がスケール1側、2番目の要素がスケール10側に対応する。例: ["D", "W"]',
                items: {
                    type: Type.STRING,
                    enum: ['D', 'W', 'S', 'M', 'A', 'R', 'I', 'C']
                },
                minItems: 2,
                maxItems: 2
            }
        },
        required: ['question', 'traitPair']
    }
};

const resultSchema = {
    type: Type.OBJECT,
    properties: {
        type: {
            type: Type.STRING,
            description: "4文字の死生観タイプ (例: 'DSAC')。"
        },
        title: {
            type: Type.STRING,
            description: "この死生観タイプを詩的かつ的確に表す称号 (例: '静観する航海士')。"
        },
        description: {
            type: Type.STRING,
            description: "死生観タイプに関する詳細で、洞察に満ちた日本語の解説。その価値観がもたらす強み、人生への向き合い方、世界の見方などを段落に分けて記述する。"
        }
    },
    required: ['type', 'title', 'description']
};

export const getQuizQuestions = async (): Promise<Question[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `「死生観」に関する16タイプ診断を作成します。以下の4つの次元について、それぞれの次元を測るためのユニークで哲学的な質問を合計${TOTAL_QUESTIONS}個、日本語で生成してください。
- 運命論(D) vs 自由意志(W)
- 精神主義(S) vs 現実主義(M)
- 受容(A) vs 抗い(R)
- 個人主義(I) vs 共同体主義(C)

各質問は、ユーザーが1から10のスケールで答える形式であることを想定してください。1がtraitPairの最初の特性に、10が2番目の特性に強く当てはまることを示します。質問は4つの次元に均等に分散させてください。`,
            config: {
                responseMimeType: "application/json",
                responseSchema: questionSchema,
            },
        });
        const jsonText = response.text.trim();
        const questions = JSON.parse(jsonText);
        return questions as Question[];
    } catch (error) {
        console.error("クイズの質問取得エラー:", error);
        throw new Error("クイズの質問を生成できませんでした。もう一度お試しください。");
    }
};

export const getPersonalityDescription = async (type: string): Promise<PersonalityResult> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `死生観タイプ「${type}」について、詳細な分析を日本語で提供してください。このタイプを詩的かつ的確に表す称号も考えてください。説明は、その価値観がもたらす強み、人生への向き合い方、世界の見方などを包括し、洞察に富んだ文章で記述してください。`,
            config: {
                responseMimeType: "application/json",
                responseSchema: resultSchema,
            },
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        return result as PersonalityResult;
    } catch (error) {
        console.error("性格分析の取得エラー:", error);
        throw new Error("診断結果を生成できませんでした。もう一度お試しください。");
    }
};
