import OpenAI from "openai";

const openai = 
new OpenAI({
    apiKey: process.env.O1_KEY,
    // baseURL: "https://api.groq.com/openai/v1"
    baseURL: "https://models.inference.ai.azure.com"
  });

// new OpenAI({ apiKey: process.env.OPEN_AI_SECRET });

const callOpenAI = async (messages: any[]) => {
    console.log("hiiiii")
    try {
        const response = await openai.chat.completions.create({
            // model: 'gpt-4o-mini',
            // model:"llama-3.3-70b-specdec",
            model:"gpt-4o",
            messages,
            max_tokens: 500,
            temperature: 0.7,
            top_p: 1.0,
        });
        console.log(response.usage);
        console.log(response.choices[0].message.content)
        return response.choices[0].message.content;
    } catch (error) {
        console.error('Error calling OpenAI:', error);
        return 'Error generating response.';
    }
};


export const simpleTextGen = async (text: string) => {
    const messages = [
        { 
            role: 'system', 
            content: 'You are an AI assistant summarizing resumes into concise 2-3 line summaries.' 
        },
        {
            role: 'user',
            content: `Summarize the following resume in 2-3 lines, focusing on key skills, experience, and achievements: "${text}".`
        }
    ];

    const summary = await callOpenAI(messages);
    return summary.trim();
};


export const getFeedback = async (question: string, response: string) => {
    const feedbackMessages = [
        { 
            role: 'system', 
            content: 'You are an AI assistant providing constructive interview feedback based on the given question and response under 500 characters.' 
        },
        {
            role: 'user',
            content: `Provide detailed feedback for the following question and response.
            Question: "${question}"
            Response: "${response}".
            Focus on strengths and areas for improvement.`
        },
    ];

    const feedback = await callOpenAI(feedbackMessages);

    const marksMessages = [
        { 
            role: 'system', 
            content: 'You are an AI assistant assigning marks to interview responses.' 
        },
        {
            role: 'user',
            content: `Assign marks out of 10 in the format "Marks: X/10" (just the marks) for the response to the question: "${question}". The response was: "${response}".`
        },
    ];

    const marksResponse = await callOpenAI(marksMessages);
    const marks = parseInt(marksResponse.match(/\d+/)?.[0] || '0', 10);

    return { feedback: feedback.trim(), marks };
};

export const reframeQuestion = async (question: string) => {
    const messages = [
        { 
            role: 'system', 
            content: 'You are an AI assistant skilled at rephrasing and clarifying interview questions.' 
        },
        {
            role: 'user',
            content: `Rephrase the following question to make it clearer and more concise: "${question}". Return the result in the format:
            Question: "<rephrased question>".`
        }
    ];

    const response = await callOpenAI(messages);
    const pattern = /Question:\s*"(.+?)"/;
    const match = response.match(pattern);

    if (match) {
        return match[1].trim();
    } else {
        return "Could not rephrase the question.";
    }
};

export const Q1 = async (resume_context: string, subject: string, topic: string) => {
    console.log("Q1")
    const messages = [
        { 
            role: 'system', 
            content: 'You are an AI assistant generating interview questions for students seeking internships or full-time jobs.' 
        },
        {
            role: 'user',
            content: `Generate a specific interview question in the format: 
            Question: "<interview question>" for a candidate with experience in ${resume_context}, focusing on the subject ${subject}, and specifically related to the topic ${topic}. 
            The question should assess the candidate's understanding or practical skills in this area.`
        }
    ];

    const response = await callOpenAI(messages);
    const pattern = /Question:\s*"(.+?)"/;
    const match = response.match(pattern);

    if (match) {
        return match[1].trim();
    } else {
        return "Could not generate a valid question.";
    }
};



export const genNextQuestion = async (resume_context: string, subject: string, topic: string, interviewExchanges: any[]) => {
    const messages = [
        { 
            role: 'system', 
            content: 'You are an AI assistant generating tailored interview questions for students seeking internships or full-time jobs. Adjust the difficulty of questions based on previous responses.' 
        },
        {
            role: 'user',
            content: `Based on the previous interview responses: "${JSON.stringify(interviewExchanges)}", and resume context: "(${resume_context})", generate the next question related to the subject: "${subject}" and topic: "${topic}".
            
            ### Dynamic Questioning Strategy:
            - If the candidate performed well in the previous responses: "Ask a more advanced question related to the subject."
            - If the candidate struggled: "Ask a simpler question to help them build confidence."
            - Focus on practical applications or understanding of fundamental concepts.

            Return the question in the format:
            Question: "<question text>"
            `
        }
    ];

    const response = await callOpenAI(messages);
    const pattern = /Question:\s*"(.+?)"/;
    const match = response.match(pattern);

    if (match) {
        return match[1].trim();
    } else {
        return "Could not generate a valid question.";
    }
};





export const getFinalFeedback = async (resume_context: string, subject: string, topic: string, interviewExchanges: any[]) => {
    const messages = [
        { role: 'system', content: 'You are an AI assistant providing comprehensive interview feedback. Be clear, concise, and objective.' },
        {
            role: 'user',
            content: `Based on the following interview exchanges: ${JSON.stringify(interviewExchanges)}, the resume context: (${resume_context}), the subject: (${subject}), and the topic: (${topic}), provide final feedback with key strengths, weaknesses, and a concise summary.
            Format:
            Strengths: <list specific strengths>
            Weaknesses: <list specific weaknesses>
            Summary: <give a short, overall summary of the candidate's performance>

            Ensure that:
            1. Strengths and weaknesses are clearly listed.
            2. The summary is no more than 2-3 sentences.`
        }
    ];

    const pattern = /Strengths:\s*(.+?)\nWeaknesses:\s*(.+?)\nSummary:\s*(.+)/s;
    const feedback = await callOpenAI(messages);

    const match = feedback.match(pattern);
    if (match) {
        const result = {
            strengths: match[1].trim(),
            weaknesses: match[2].trim(),
            summary: match[3].trim()
        };
        return result;
    } else {
        console.log(feedback,match);
        return {
            strengths: "Strengths not clearly identified.",
            weaknesses: "Weaknesses not clearly identified.",
            summary: "Summary not available."
        };
    }
};







///



export const genNextCodeQuestion = async (resume_context: string, subject: string, topic: string, interviewExchanges: any[]) => {
    const messages = [
        { 
            role: 'system', 
            content: 'You are an AI assistant generating tailored interview questions for students seeking internships or full-time jobs. Adjust the difficulty of questions based on previous responses.' 
        },
        {
            role: 'user',
            content: `Based on the previous interview responses: "${JSON.stringify(interviewExchanges)}", and resume context: "(${resume_context})", generate the next question related to the subject: "${subject}" and topic: "${topic}".
            
            ### Dynamic Questioning Strategy:
            - If the candidate performed well in the previous responses: "Ask a more advanced question related to the subject."
            - If the candidate struggled: "Ask a simpler question to help them build confidence."
            - Focus on practical applications or understanding of fundamental concepts.

            Return the question in the format:
            Question: "<question text>"
            `
        }
    ];

    const response = await callOpenAI(messages);
    const pattern = /Question:\s*"(.+?)"/;
    const match = response.match(pattern);

    if (match) {
        return match[1].trim();
    } else {
        return ["Could not generate a valid question.","Code"];
    }
    
}

export const getCodeFeedback = async (question: string, code : string,response: string) => {

    const feedbackMessages = [
        { 
            role: 'system', 
            content: 'You are an AI assistant providing constructive interview feedback based on the given question and response.' 
        },
        {
            role: 'user',
            content: `Provide detailed feedback for the following question and response.
            Question: "${question}"
            Response: "${response}".
            Focus on strengths and areas for improvement.`
        },
    ];

    const feedback = await callOpenAI(feedbackMessages);

    const marksMessages = [
        { 
            role: 'system', 
            content: 'You are an AI assistant assigning marks to interview responses.' 
        },
        {
            role: 'user',
            content: `Assign marks out of 10 in the format "Marks: X/10" (just the marks) for the response to the question: "${question}". The response was: "${response}".`
        },
    ];

    const marksResponse = await callOpenAI(marksMessages);
    const marks = parseInt(marksResponse.match(/\d+/)?.[0] || '0', 10);

    return { feedback: feedback.trim(), marks };
}


export const genEvalMatrix = async (resume_context: string, subject: string, topic: string, interviewExchanges: any[]) => {
    return {
        problem_solving: 0,
        code_quality: 0,
        debugging: 0
    }
}