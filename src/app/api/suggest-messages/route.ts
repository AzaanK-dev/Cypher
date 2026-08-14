import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";

export async function POST(request: Request) {
    try {
        const { text } = await generateText({
            model: groq("llama-3.1-8b-instant"),
            prompt:
                "Create a list of exactly 3 open-ended, engaging, slightly spicy, curiosity-driven questions formatted as a single string. Each question must be separated by '||'. These questions are for an anonymous social messaging app like Qooh.me, where people can ask fun, playful, unexpected, and confession-style questions anonymously. Make the questions intriguing, teasing, mysterious, and honest enough to make someone think 'hmm... should I actually answer this?'. Encourage harmless confessions, funny secrets, unexpected opinions, secret preferences, unpopular opinions, crush-free playful confessions, hypothetical situations, or surprising admissions. Keep them suitable for a diverse audience and appropriate for friends, classmates, coworkers, followers, or acquaintances. Avoid deeply personal, traumatic, sexual, hateful, discriminatory, or otherwise sensitive topics. Never ask for private information such as addresses, phone numbers, passwords, financial information, or identifying details. Keep each question short, natural, conversational, and easy to understand. Mix different styles so the 3 questions do not feel repetitive. Do not number the questions. Do not add explanations, introductions, quotation marks, bullet points, or extra text. Return exactly 3 questions in one single string separated by '||'. Example style: 'What's a harmless secret you've never told anyone?||What's something you pretend not to care about but secretly do?||What's an opinion you'd only share anonymously?'"
        });

        const suggestions = text
            .split("\n")
            .map((message)  => message.trim())
            .filter(Boolean)
            .slice(0, 3);

        return Response.json({ suggestions });

    } catch (error) {
        console.error("AI suggestion error:", error);
        return Response.json(
            { error: "Failed to generate suggestions" },
            { status: 500 }
        );
    }
}


