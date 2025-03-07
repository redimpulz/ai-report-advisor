import {
  GoogleGenerativeAI,
  SchemaType,
  type ResponseSchema,
} from "@google/generative-ai";

// APIキーを.envファイルに記述した環境変数から取得。
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// 生成AIを扱うクラスのインスタンスを作成
const genAI = new GoogleGenerativeAI(API_KEY);

// レスポンスの定義を指定
const schema: ResponseSchema = {
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    nullable: false,
    properties: {
      name: {
        type: SchemaType.STRING,
        nullable: false,
        description: "評価項目",
      },
      score: {
        type: SchemaType.NUMBER,
        nullable: false,
        description: "評価点数。0から10の整数。",
      },
      reason: {
        type: SchemaType.STRING,
        nullable: false,
        description: "評価理由。良い点と悪い点を明確に書く。Markdown。",
      },
    },
  },
};

// 使用する生成モデル（gemini-1.5-flash）の指定と設定を追加
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: schema,
    maxOutputTokens: 2000,
  },
});

// 結果の型定義
export type Result = {
  name: string;
  score: number;
  reason: string;
}[];

export async function generateGeminiText(text: string) {
  const prompt = `大学のレポートを読んで、文法や表現を修正してください。
  # 添削条件
  
  以下の各項目について、0点から10点の整数範囲で評価し、その理由を記述してください。
  
  - 論理性: 主張が論理的に展開され、筋が通っているかどうか
  - 一貫性: テーマや主張に矛盾がなく、全体を通じて一貫しているかどうか
  - 明確さ: 言葉遣いが明瞭で、読者にとって分かりやすいかどうか
  - 独自性: 他の参考資料や一般的な意見と比較して、独自の視点やアイデアが盛り込まれているかどうか
  - 総合評価: 上記の項目を総合的に評価
  
  # 本文
  
  \`\`\`
  ${text}
  \`\`\`
  `;

  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text()) as Result;
}
