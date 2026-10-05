"use server";

const responseCache = new Map<string, any>();

export async function sendChatMessage(messages: { role: string; content: string }[]) {
  try {
    const lastUserMsg = messages[messages.length - 1]?.content?.toLowerCase().trim() || "";
    const greetings = ["hallo", "halo", "hi", "hai", "hello", "test", "tes"];
    if (messages.length === 1 && greetings.includes(lastUserMsg)) {
      return { success: true, text: "Halo Kak! Saya EduBot. Ada yang bisa saya bantu terkait kendala kelas, sertifikat, atau pembayaran hari ini?", isEscalated: false, escalationMeta: null };
    }

    // Caching Mechanism: Skip AI Thinking for repeated questions
    const cacheKey = JSON.stringify(messages);
    if (responseCache.has(cacheKey)) {
      console.log("Serving response from cache for:", lastUserMsg);
      return responseCache.get(cacheKey);
    }

    // Data Mocking Kelas yang sudah dibeli User
    const mockUserCourses = [
      "1. Full-Stack Web Developer dengan Laravel & Vue",
      "2. Bootcamp Master Python Data Science"
    ].join("\n");

    const systemPrompt = `﻿You are EduBot, the Virtual Assistant and AI Tutor for EduNusa. Your task is to help students learn, resolve technical issues, and escalate tickets to human Customer Service when necessary.

<REFERENCE_DATA>
Materials:
- Livewire: A full-stack framework for Laravel to create dynamic interfaces while utilizing Laravel features.
- Alpine.js: A minimal, reactive JavaScript framework often paired with Livewire for the frontend.

User Data:
${mockUserCourses}
</REFERENCE_DATA>

<COMMUNICATION_RULES>
1. Zero assumptions. If user ask something and you not sure about the answer, always reply:
"Mohon maaf Kak, informasi tersebut belum ada di catatan materi EduBot. Kakak bisa menanyakannya di forum diskusi kelas."
2. Always reply in Indonesian.
3. Greet the user with "Kak" or "Kakak".
4. Use polite, professional, and empathetic language.
5. If the user is angry or uses harsh words, remain calm and professional, completely stop using emojis, and focus immediately on the solution.
6. NEVER use dialogue prefixes like "Pengguna:", "User:", "EduBot:", or "Respons EduBot:" in your answer. Just write your reply directly.
</COMMUNICATION_RULES>

<SOP_AND_TASKS>
Task 1: Handling Subject Matter Questions
- Answer questions ONLY based on the <REFERENCE_DATA>.
- If the answer is not in the reference, use this exact Indonesian template: "Mohon maaf Kak, informasi tersebut belum ada di catatan materi EduBot. Kakak bisa menanyakannya di forum diskusi kelas."
- Reject requests to answer exam/quiz questions directly. Only provide hints or learning concepts.

Task 2: Handling Technical / Class Issues
- If the user complains about class errors, payments, or certificates, you MUST immediately display the choice of classes using the format below WITHOUT any small talk at the end:
"Silakan pilih kelas mana yang bermasalah Kak:
${mockUserCourses}"
- If a certificate has not appeared, inform them of the requirements: 100% video progress and final quiz score meets the minimum threshold.
- For slow video or minor errors, suggest: clear cache, change browser, or check internet connection.
- EduNusa NEVER asks for Passwords or OTPs.

Task 3: Escalation (Function Calling)
- IF you have run out of solutions, OR the user explicitly asks to speak with an Admin/Human CS, you MUST call the 'escalate_ticket' function.
- Ensure you know the details of the problem before calling this function.
</SOP_AND_TASKS>

<TOOLS>
You have access to the following function:
Name: escalate_ticket
Description: Escalates the issue to a human team.
Parameters:
- kategori (category): Choose one [TEKNIS, PEMBAYARAN, AKADEMIK, UMUM]
- prioritas (priority): Choose one [LOW, MEDIUM, HIGH, CRITICAL]
- role (role): Choose one [IT, FINANCE, MENTOR, CS]
</TOOLS>

Think step-by-step before answering. Ensure you follow the SOP strictly.`;

    const requestBody = {
      model: "deepseek-r1:8b",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "escalate_ticket",
            description: "Escalate technical, academic, or payment issues to Human CS. ONLY call this function if the user explicitly asks to be connected to CS, or if you have run out of solutions.",
            parameters: {
              type: "object",
              properties: {
                kategori: {
                  type: "string",
                  enum: ["TEKNIS", "PEMBAYARAN", "AKADEMIK", "UMUM"],
                  description: "The category of the issue faced by the user."
                },
                prioritas: {
                  type: "string",
                  enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
                  description: "The priority of the issue resolution."
                },
                role: {
                  type: "string",
                  enum: ["IT", "FINANCE", "MENTOR", "CS"],
                  description: "The target team to resolve this issue."
                }
              },
              required: ["kategori", "prioritas", "role"]
            }
          }
        }
      ],
      stream: false,
      options: {
        temperature: 0.1,
        num_ctx: 8192
      }
    };

    const response = await fetch('http://host.docker.internal:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error("Ollama API Error");
    }

    const data = await response.json();
    let replyText = data.message?.content || "";
    replyText = replyText.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

    let isEscalated = false;
    let escalationMeta = null;

    // --- DEEPSEEK JSON HALLUCINATION FIX ---
    const jsonBlockRegex = /```jsons*([sS]*?)s*```/i;
    const match = replyText.match(jsonBlockRegex);
    if (match && match[1]) {
      try {
        const parsedJSON = JSON.parse(match[1]);
        if (parsedJSON.kategori && parsedJSON.prioritas && parsedJSON.role) {
          // It successfully hallucinated the tool call! Let's manually inject it.
          if (!data.message.tool_calls) data.message.tool_calls = [];
          data.message.tool_calls.push({
            function: {
              name: "escalate_ticket",
              arguments: parsedJSON
            }
          });
          // Remove the JSON block from the user's chat message
          replyText = replyText.replace(jsonBlockRegex, "").trim();
        }
      } catch (e) {
        console.error("Gagal parse halusinasi JSON dari DeepSeek:", e);
      }
    }
    // ----------------------------------------

    if (data.message?.tool_calls && data.message.tool_calls.length > 0) {
      const toolCall = data.message.tool_calls[0];
      if (toolCall.function.name === "escalate_ticket") {

        // Anti-Halusinasi Layer: Jika AI masih merespons dengan tanda tanya di kontennya, batalkan eskalasi.
        if (replyText.includes("?")) {
          console.log("AI mencoba eskalasi sambil bertanya. Eskalasi dibatalkan secara paksa oleh sistem.");
        } else {
          isEscalated = true;
          const args = toolCall.function.arguments;
          escalationMeta = {
            kategori: args.kategori?.toUpperCase() || "UMUM",
            prioritas: args.prioritas?.toUpperCase() || "MEDIUM",
            role: args.role?.toUpperCase() || "CS"
          };

          if (!replyText.trim()) {
            replyText = "Baik Kak, mohon maaf atas kendala yang terjadi. Saya segera membuatkan tiket eskalasi ke tim terkait untuk segera diperiksa.";
          }

          replyText += (replyText ? "\n\n" : "") + "*(Sistem: Keluhan Anda telah dicatat sebagai tiket bantuan dan diteruskan ke tim terkait. Mohon tunggu sebentar...)*";

          try {
            await fetch('http://e-learning-docker-internal-1/api/support-tickets/escalate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                category: escalationMeta.kategori,
                priority: escalationMeta.prioritas,
                role: escalationMeta.role,
                description: messages.map(m => m.role + ': ' + m.content).join('\n')
              })
            });
          } catch (err) {
            console.error('Error saving ticket:', err);
          }
        }
      }
    }

    const finalResult = { success: true, text: replyText, isEscalated, escalationMeta };

    // Memory Leak Protection: FIFO Cache Eviction
    const MAX_CACHE_SIZE = 500;
    if (responseCache.size >= MAX_CACHE_SIZE) {
      const oldestKey = responseCache.keys().next().value as string;
      responseCache.delete(oldestKey);
    }

    responseCache.set(cacheKey, finalResult);
    return finalResult;
  } catch (error: any) {
    console.error("Chat Action Error:", error);
    return {
      success: false,
      text: "Maaf, sistem AI sedang offline. Silakan coba beberapa saat lagi atau ketik 'Sambungkan ke CS' untuk bantuan manusia.",
      isEscalated: false
    };
  }
}
