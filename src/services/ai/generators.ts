import { Type } from "@google/genai";
import { getAiClient, getModel } from "./config";
import { IdeaMetadata, LanguageConfig } from "./types";

export async function generateIdeaMetadata(genre: string, vocalType: string, theme?: string): Promise<IdeaMetadata[]> {
  const model = getModel();
  const ai = getAiClient();
  
  const themeInstruction = theme 
    ? `사용자가 지정한 주제는 "${theme}"입니다. 이 주제를 중심으로 제목과 분위기를 구상하세요.`
    : `주제가 지정되지 않았으므로, ${genre} 장르에 어울리는 대중적이고 매력적인 주제를 자유롭게 선정하세요.`;

  const prompt = `
    [Persona & Expertise]
    당신은 생성형 AI 오디오 모델인 SUNO V5의 알고리즘 아키텍처와 음악 이론을 완벽하게 통합한 'AI 뮤직 프로듀싱 디렉터'입니다. 
    당신은 단순한 장르 추천을 넘어, 모델이 사운드 텍스처, 공간감, 보컬의 질감, 악기 구성을 가장 정확하게 생성할 수 있는 토큰(Token) 조합을 설계하는 전문가입니다.

    [SUNO V5 최적화 프롬프트 엔지니어링 지식 베이스]
    1. 고품질 오디오 텍스처 태그 (필수 포함): pristine production, wide stereo, hifi, balanced mix, deep bass, crisp vocals, studio mastering, masterpiece, best quality, ultra-detailed, 8k audio, crystal clear
    2. 곡 구조 제어 메타 태그: [Intro], [Verse], [Pre-Chorus], [Chorus], [Bridge], [Instrumental Interlude], [Outro], [End]
    3. 보컬 스타일 상세 정의: ethereal female vocals, gritty male vocals, autotuned, choir backing, etc.
    4. 장르 퓨전: 서로 다른 장르 혼합 (예: Cyberpunk Jazz, Medieval Trap)
    5. BPM 및 리듬: downtempo, uptempo, syncopated rhythm, four-on-the-floor
    6. 분위기 및 감정: ominous, uplifting, atmospheric
    7. 특정 연대 및 사운드: 1980s synthpop, 2000s pop punk
    8. 악기 솔로 및 강조: virtuoso guitar, heavy distortion
    9. K-Pop 스타일 최적화: k-pop, catchy hook, dynamic changes
    10. 전체 프롬프트 구성 템플릿 (필수 준수):
       [Main Genre], [Sub-Genre], [Specific Instruments], [Vocal Style], [Mood/Atmosphere], [Tempo/Rhythm], [Production Quality]

    [Task]
    사용자가 선택한 음악 장르는 "${genre}"입니다.
    사용자가 선호하는 보컬 타입은 "${vocalType}"입니다.
    ${themeInstruction}
    이 장르와 보컬 타입, 그리고 주제를 기반으로, 위 지식 베이스를 활용하여 SUNO V5에 최적화된 음악 아이디어 5개를 구상해주세요.
    
    각 아이디어에 대해 다음을 생성하세요:
    1. **제목 (Title)**: 창의적이고 매력적인 한국어 노래 제목 (주제 반영 필수)
    2. **스타일 프롬프트 (Style Prompt)**: 위 10번 템플릿([Main Genre], [Sub-Genre]...)을 엄격히 준수하여 영문으로 작성하세요. 
       - **[Vocal Style]** 부분에 사용자가 선택한 "${vocalType}"을 반영하여 구체적인 보컬 톤을 묘사하세요. (예: "${vocalType}" -> "ethereal female vocals", "gritty male vocals" 등 장르에 맞게 변형)
       - 장르에 맞는 구체적인 악기, 분위기, BPM을 조합하고, **모든 프롬프트의 끝에 반드시 'pristine production, wide stereo, hifi, masterpiece' 등 고음질 태그를 포함하세요.**

    반드시 다음 JSON 스키마를 따라주세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ideas: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "Song title in Korean" },
                    stylePrompt: { type: Type.STRING, description: "Style prompt in English following the template" }
                },
                required: ["title", "stylePrompt"]
              }
            }
          },
          required: ["ideas"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const data = JSON.parse(text) as { ideas: IdeaMetadata[] };
    return data.ideas;
  } catch (error: any) {
    console.error("Error generating metadata:", error);
    if (error.status === 429 || error.message?.includes('429') || error.message?.includes('quota')) {
       throw new Error("QUOTA_EXCEEDED");
    }
    throw error;
  }
}

export async function generateLyrics(genre: string, title: string, stylePrompt: string, langConfig: LanguageConfig, theme?: string): Promise<string> {
  const model = getModel();
  const ai = getAiClient();
  
  const languageInstruction = langConfig.sub && langConfig.sub !== 'None'
    ? `메인 언어: ${langConfig.main} (${langConfig.mainPercent}%), 서브 언어: ${langConfig.sub} (${100 - langConfig.mainPercent}%) 비율로 혼합하여 작성해주세요.`
    : `언어: ${langConfig.main}로만 작성해주세요.`;

  const lengthInstruction = langConfig.length 
    ? `가사 길이는 공백 포함 약 ${langConfig.length.total}자 (공백 제외 약 ${langConfig.length.noSpace}자) 정도로 작성해주세요.`
    : `가사 길이는 공백 포함 약 800자 (공백 제외 약 400자) 정도로 작성해주세요.`;

  const themeInstruction = theme
    ? `주제: ${theme} (이 주제를 가사에 깊이 있게 반영해주세요)`
    : `주제: 곡의 제목과 스타일에 어울리는 자유 주제`;

  const prompt = `
    장르: ${genre}
    제목: ${title}
    스타일: ${stylePrompt}
    ${themeInstruction}
    
    위 곡에 어울리는 가사를 작성해주세요.
    
    [필수 요구사항]
    1. SUNO V5 모델이 이해할 수 있는 **구조 메타 태그**를 반드시 포함하세요.
       - 사용 가능한 태그: [Intro], [Verse], [Pre-Chorus], [Chorus], [Bridge], [Outro], [End]
    2. **장르별 추천 구조를 반영하여 작성해주세요:**
       - **K-Pop/Pop Dance:** [Intro] -> [Verse 1] -> [Pre-Chorus] -> [Chorus] -> [Verse 2] -> [Pre-Chorus] -> [Chorus] -> [Bridge] -> [Chorus] -> [Outro]
       - **Ballad/R&B:** [Intro] -> [Verse 1] -> [Verse 2] -> [Chorus] -> [Verse 3] -> [Bridge] -> [Chorus] -> [Outro]
       - **Hip-hop:** [Intro] -> [Verse 1] -> [Chorus] -> [Verse 2] -> [Chorus] -> [Verse 3] -> [Outro]
       - **EDM:** [Intro] -> [Build-up] -> [Drop] -> [Verse] -> [Build-up] -> [Drop] -> [Outro]
       - 그 외 장르는 해당 장르의 전형적인 곡 구조를 따르세요.
    3. ${languageInstruction}
    4. ${lengthInstruction}
    5. 스타일 프롬프트에 묘사된 분위기를 가사에 반영하세요.
    
    JSON이 아닌 일반 텍스트로 가사만 출력하세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "가사를 생성하지 못했습니다.";
  } catch (error: any) {
    console.error("Error generating lyrics:", error);
    if (error.status === 429 || error.message?.includes('429') || error.message?.includes('quota')) {
       throw new Error("QUOTA_EXCEEDED");
    }
    return "가사 생성 중 오류가 발생했습니다.";
  }
}
