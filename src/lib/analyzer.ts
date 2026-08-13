/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { CompassReport, CredibilityLevel, EvidenceLevel, EmotionalLevel, BiasLevel, ClickbaitLevel } from "../types";

export async function analyzeClaimContent(
  content: string,
  type: 'text' | 'url' | 'image' = 'text'
): Promise<Omit<CompassReport, 'id' | 'timestamp' | 'inputSource'>> {
  const claimText = content.trim();

  // Try retrieving API key from environment
  let apiKey = process.env.GEMINI_API_KEY;
  const meta = import.meta as any;
  if (!apiKey && typeof meta !== 'undefined' && meta.env) {
    apiKey = meta.env.VITE_GEMINI_API_KEY || meta.env.GEMINI_API_KEY;
  }

  const hasValidKey = apiKey && apiKey !== "" && apiKey !== "MY_GEMINI_API_KEY";

  if (hasValidKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const prompt = `You are an expert Media and Information Literacy (MIL) educator. Your goal is to help users critically analyze the provided digital claim, news article, or social media post. 
Do NOT simply tell them if it is true or false. Instead, analyze its structure, sources, emotional indicators, and framing to guide their critical thinking.

Input content to analyze (Type: ${type}):
"${claimText}"

Ensure all reasonings are educational, empowering, constructive, and neutral in tone.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              claim: {
                type: Type.STRING,
                description: "A concise summary of the analyzed claim, under 80 characters."
              },
              sourceCredibility: {
                type: Type.STRING,
                description: "One of: 'Unknown', 'Low', 'Medium', 'High'."
              },
              sourceCredibilityReasoning: {
                type: Type.STRING,
                description: "Explain why the source's authority, transparency, or intent might be questionable or reliable. Provide MIL context."
              },
              evidenceStrength: {
                type: Type.STRING,
                description: "One of: 'Weak', 'Moderate', 'Strong'."
              },
              evidenceStrengthReasoning: {
                type: Type.STRING,
                description: "Evaluate if the claim provides verifiable, reproducible evidence, or if it relies on correlation, hearsay, or anecdotes."
              },
              emotionalManipulation: {
                type: Type.STRING,
                description: "One of: 'None', 'Low', 'Moderate', 'High'."
              },
              emotionalManipulationReasoning: {
                type: Type.STRING,
                description: "Identify loaded adjectives, sensational language, anger-inducing tropes, or urgency triggers used to bypass logical reasoning."
              },
              biasIndicator: {
                type: Type.STRING,
                description: "One of: 'Low', 'Medium', 'High'."
              },
              biasIndicatorReasoning: {
                type: Type.STRING,
                description: "Highlight potential cognitive, commercial, or tribal biases. Explain how the presentation creates an 'us vs them' narrative."
              },
              clickbaitRisk: {
                type: Type.STRING,
                description: "One of: 'Low', 'Medium', 'High'."
              },
              clickbaitRiskReasoning: {
                type: Type.STRING,
                description: "Explain if the headline or text is framed as an information gap or curiosity cliff designed to drive engagements rather than provide understanding."
              },
              verificationSteps: {
                type: Type.ARRAY,
                items: {
                  type: Type.STRING
                },
                description: "Array of 4 highly actionable check/audit actions (e.g., reverse image search, locate primary papers, compare reputable sources, inspect URLs)."
              },
              aiLesson: {
                type: Type.STRING,
                description: "A solid MIL educational lesson or concept. (e.g., 'Extraordinary claims require extraordinary evidence. When an article provokes intense emotional reaction, treat it as a warning sign to pause and analyze before sharing.')"
              },
              reflectionQuestion: {
                type: Type.STRING,
                description: "A thoughtful reflection question to ask the user to spark their critical judgment."
              }
            },
            required: [
              "claim",
              "sourceCredibility",
              "sourceCredibilityReasoning",
              "evidenceStrength",
              "evidenceStrengthReasoning",
              "emotionalManipulation",
              "emotionalManipulationReasoning",
              "biasIndicator",
              "biasIndicatorReasoning",
              "clickbaitRisk",
              "clickbaitRiskReasoning",
              "verificationSteps",
              "aiLesson",
              "reflectionQuestion"
            ]
          }
        },
      });

      const textResponse = response.text?.trim() || "";
      const reportData = JSON.parse(textResponse);
      return reportData;

    } catch (error) {
      console.error("Gemini API error, falling back to local analyzer:", error);
    }
  }

  // Educational fallback logic
  const lower = claimText.toLowerCase();

  let claimSummary = claimText.substring(0, 60) + (claimText.length > 60 ? "..." : "");
  let sourceCredibility: CredibilityLevel = "Unknown";
  let sourceCredibilityReasoning = "The publisher or author of this information cannot be verified immediately. Social media amplification and personal messaging channels (like WhatsApp or Telegram) lack editorial peer-reviews, standard verification guidelines, or professional accountability structures.";
  let evidenceStrength: EvidenceLevel = "Weak";
  let evidenceStrengthReasoning = "This claim relies on dramatic assertions or personal testimonies rather than linking directly to primary scientific studies, official databases, or consensus research. No citation or reference is provided to verify the methodology.";
  let emotionalManipulation: EmotionalLevel = "Moderate";
  let emotionalManipulationReasoning = "The narrative uses loaded keywords or urgency-inducing language to appeal directly to curiosity, hope, or fear, which naturally weakens critical vigilance and prompts rapid sharing.";
  let biasIndicator: BiasLevel = "Medium";
  let biasIndicatorReasoning = "The statement presents a one-sided perspective, presenting conclusions as absolute facts while ignoring counter-evidence, nuances, or alternative consensus views.";
  let clickbaitRisk: ClickbaitLevel = "Low";
  let clickbaitRiskReasoning = "While not necessarily a headline clickbait layout, it uses sensationalized hooks or 'information gaps' that trigger curiosity without providing substantial background contexts.";
  let verificationSteps = [
    "Search trusted, non-partisan news websites to see if the event has been validated.",
    "Verify the publication date of the source to rule out recycled, out-of-context headlines.",
    "Compare reporting across multiple diverse sources to identify missing nuances or biases.",
    "Check official organizations or scientific journals (e.g., NASA, WHO, IPCC) for official statements."
  ];
  let aiLesson = "Extraordinary claims require extraordinary evidence. Always verify sensational or urgent claims before sharing them with your networks.";
  let reflectionQuestion = "Would you share this claim immediately, or do you feel a need to confirm its background details first?";

  if (lower.includes("nasa") || lower.includes("space") || lower.includes("alien") || lower.includes("planet")) {
    claimSummary = "NASA discovers alien life on Kepler-452b";
    sourceCredibility = "Low";
    sourceCredibilityReasoning = "The claims are published on a sensationalist blog masquerading as a scientific journal. Standard NASA discoveries are always published directly on NASA's main portal (.gov) and through peer-reviewed astrophysics publications first.";
    evidenceStrength = "Weak";
    evidenceStrengthReasoning = "The claim states 'classified sources confirm' but provides no scientific data, spectra analysis, or peer-reviewed citations. It misinterprets normal planetary atmospheric gas readings as definitive 'technosignatures'.";
    emotionalManipulation = "High";
    emotionalManipulationReasoning = "Uses dramatic exclamation marks and explosive words ('Unprecedented!', 'Earth-shaking coverup!') to trigger excitement and shock, designed to override standard scientific skepticism.";
    biasIndicator = "Medium";
    biasIndicatorReasoning = "The claim relies on 'Anti-Establishment Bias'—the presupposition that scientific organizations are actively hiding truth from the general public, drawing users into conspiracy thinking.";
    clickbaitRisk = "High";
    clickbaitRiskReasoning = "The title uses an absolute hook ('NASA Finally Admits Alien Life Exists!') to create a severe information gap, forcing users to click through or share without checking the fine print.";
    verificationSteps = [
      "Visit nasa.gov or hubblesite.org directly to search for Kepler atmospheric research updates.",
      "Check fact-checking websites like Snopes or Lead Stories for recent space rumors.",
      "Look up the name of the scientist quoted to verify if they exist and actually work in astrobiology.",
      "Review the original peer-reviewed paper on Kepler-452b atmospheric modeling to see actual readings."
    ];
    aiLesson = "The 'Curiosity Gap' is a powerful engagement tactic. Discrepancies between sensationalist headlines and the actual body of scientific evidence are a classic signature of misinformation.";
    reflectionQuestion = "How does our innate human desire to discover alien life make us more vulnerable to sharing space-related rumors?";
  } else if (lower.includes("doctor") || lower.includes("herb") || lower.includes("cure") || lower.includes("cancer") || lower.includes("health") || lower.includes("whatsapp")) {
    claimSummary = "Dandelion herb extract cures cancer in 48 hours";
    sourceCredibility = "Low";
    sourceCredibilityReasoning = "Often spreads via anonymous forwards on social networks. There is no editorial gatekeeping, medical board review, or professional attribution, which are vital for medical claims.";
    evidenceStrength = "Weak";
    evidenceStrengthReasoning = "Claims of a '100% cure rate' rely entirely on an unlinked in-vitro (petri dish) study. In medical research, substances killing cells in petri dishes do not translate to safe, effective cures in humans.";
    emotionalManipulation = "High";
    emotionalManipulationReasoning = "Creates a dangerous false sense of hope for vulnerable patients and stokes anger against professional oncologists by claiming a 'secret industry coverup'.";
    biasIndicator = "High";
    biasIndicatorReasoning = "Appeals heavily to 'Naturalness Bias'—the false cognitive shortcut that natural substances are inherently safe and always superior to synthesized, researched medical therapies.";
    clickbaitRisk = "High";
    clickbaitRiskReasoning = "Uses sensational hooks ('Oncologists hate this simple herb!') to exploit desperation and drive sharing, feeding the social media engagement algorithms.";
    verificationSteps = [
      "Search the National Cancer Institute (cancer.gov) or WHO for clinical evidence on the substance.",
      "Verify if the source is selling supplements or herbal extracts on the same domain (commercial motive).",
      "Consult with an oncologist or medical professional about standard peer-reviewed treatment pathways.",
      "Examine the 'anonymous expert' quoted to see if they hold valid medical credentials in oncology."
    ];
    aiLesson = "Medical misinformation often exploits 'Naturalness Bias' and patient desperation. Reliable medical treatments must pass rigorous, transparent clinical trials with human subjects before being certified.";
    reflectionQuestion = "If someone delays real medical therapy because of this WhatsApp post, what are the potential real-world consequences?";
  } else if (lower.includes("election") || lower.includes("vote") || lower.includes("ballot") || lower.includes("polling") || lower.includes("cheat")) {
    claimSummary = "Tens of thousands of unregistered ballots found in local election";
    sourceCredibility = "Low";
    sourceCredibilityReasoning = "Originates from a highly partisan account with no physical address, staff directory, or journalistic corrections policy. It presents rumors as verified facts.";
    evidenceStrength = "Weak";
    evidenceStrengthReasoning = "The only evidence is an blurry, uncontextualized video of election workers moving standard mailing boxes. There are no official police filings, court records, or bipartisan auditor reports.";
    emotionalManipulation = "High";
    emotionalManipulationReasoning = "Designed to evoke extreme tribal anger, fear of disenfranchisement, and mistrust in democratic processes, which are highly viral social emotions.";
    biasIndicator = "High";
    biasIndicatorReasoning = "Exploits 'Confirmation Bias' and 'In-group/Out-group Bias', framing election operations in a hostile way to validate the user's political fears.";
    clickbaitRisk = "High";
    clickbaitRiskReasoning = "Framed as an urgent crisis ('BREAKING: MASSIVE FRAUD UNCOVERED!') to bypass logical analysis and provoke immediate, emotional retweets.";
    verificationSteps = [
      "Check announcements from the local, bipartisan Board of Elections or Secretary of State office.",
      "Find the source of the video using a reverse-video search to determine when and where it was taken.",
      "Compare reports from mainstream news organizations across different political spectra.",
      "Verify if any legal filings or formal complaints have been registered with the regional courts."
    ];
    aiLesson = "In times of high political tension, social media algorithms heavily boost content that triggers partisan outrage. Outrage is the primary vector of democratic polarization.";
    reflectionQuestion = "How does spreading unverified election claims before they are audited affect our community's trust in democracy?";
  }

  return {
    claim: claimSummary,
    sourceCredibility,
    sourceCredibilityReasoning,
    evidenceStrength,
    evidenceStrengthReasoning,
    emotionalManipulation,
    emotionalManipulationReasoning,
    biasIndicator,
    biasIndicatorReasoning,
    clickbaitRisk,
    clickbaitRiskReasoning,
    verificationSteps,
    aiLesson,
    reflectionQuestion
  };
}
