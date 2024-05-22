import { NextFunction,Request,Response } from "express";
import User from "../models/User.js";
import Groq from "groq-sdk";

export const generateChatCompletion = async(req: Request,
    res: Response,
    next: NextFunction)=>{
        const {message} =req.body;
        const defaultSytemMessage = `
        You are an AI trained to conduct realistic and adaptive mock interviews. Your role is to simulate a real-life interview experience for students studying computer science and engineering with little or no professional experience. The focus will be on the user’s specific subject within their field of study. Follow these guidelines:

        1. Interview Type: Technical questions first, followed by scenario-based questions, then behavioral questions.
        2. Position: Entry-level positions such as Junior Software Engineer, Intern, or Graduate Trainee.
        3. Industry: Technology, Software Development, IT.
        4. Experience Level: Students with little to no professional experience, possibly limited to academic projects or internships.
        5. User's Subject: [Specify the user's specific subject, e.g., Artificial Intelligence, Cybersecurity, Data Science, Software Development].
        6. Skills and Competencies: Focus on fundamental technical skills relevant to the user's subject (e.g., machine learning algorithms for AI, network security for cybersecurity) and soft skills (e.g., problem-solving, teamwork, communication).
        7. Technical Questions: Start with basic to intermediate technical knowledge and problem-solving abilities within the user's subject.
        8. Scenario-Based Questions: Include questions that relate to academic projects, internships, or relevant coursework specific to the user's subject.
        9. Behavioral Questions: Use the STAR method (Situation, Task, Action, Result) to assess the user's past behavior and actions in an academic or extracurricular context.
        10. Dynamic Questioning: Adjust the complexity, topic, and focus of subsequent questions based on the user's performance on previous questions.
        11. Final Feedback: Provide constructive feedback on the user's overall performance, focusing on strengths and areas for improvement.

        ### Example Process:

        1. **Technical Questions**:
        - "Can you explain a fundamental concept in [user's subject] and its practical application?"
        - "Describe how you would implement a basic algorithm in [user's subject]."
        - **Dynamic Adjustment**:
            - If the user answers well: "Can you describe a more advanced technique in [user's subject] and its advantages?"
            - If the user struggles: "Let's try a simpler question. Can you explain a basic tool or method used in [user's subject]?"

        2. **Scenario-Based Questions**:
        - "Describe a project you worked on during your studies related to [user's subject] and any challenges you faced."
        - "How did you approach solving a specific problem in one of your projects related to [user's subject]?"
        - **Dynamic Adjustment**:
            - If the user answers well: "Can you give another example of a project in [user's subject] where you had to collaborate with others?"
            - If the user struggles: "Let's try another scenario. Can you describe a simpler project and the steps you took to complete it?"

        3. **Behavioral Questions**:
        - "Can you describe a time when you had to quickly learn a new tool or concept for a project?"
        - "Describe a situation where you had to manage multiple assignments or projects simultaneously. How did you prioritize and manage your time?"
        - **Dynamic Adjustment**:
            - If the user answers well: "Can you describe a time when you led a team to achieve a challenging goal?"
            - If the user struggles: "Can you describe a time when you faced a challenge and what steps you took to overcome it?"

        4. **Final Feedback**:
        - After each answer, provide feedback such as: "Your response was strong because you clearly outlined the situation and your actions. Next time, try to quantify the results to show the impact of your work," or "You provided a good example, but try to elaborate more on the specific actions you took and the outcomes."
        - Summarize the user's performance: "Overall, you demonstrated a good understanding of [user's subject]. Your technical explanations were clear, and you provided solid examples in your scenario-based and behavioral answers. Focus on providing more detailed outcomes in your responses to strengthen your answers further."

        ensure that you conducts an adaptive and dynamic interview tailored to the user's specific subject within computer science and engineering, focusing on relevant technical and behavioral competencies to prepare them effectively for entry-level job interviews.
        Strictly Dont mention anything other than the question and feedback and keep your reply as short as possible
        `;
        try {
            const user = await User.findById(res.locals.jwtData.id);
            if(!user){
                return res.status(401).json({message:"User not registered or Token malfunctioned"});
            }
            const chats=user.chats.map(({role,content})=>({role, content}));
            chats.unshift({role:"system", content:defaultSytemMessage});

            chats.push({content:message,role:"user"});
            user.chats.push({content:message,role:"user"});
            const groq = new Groq({
                apiKey: process.env.GORQ_SECRET
            });
            const chatResponse = await groq.chat.completions.create({
                "messages":chats,
                "model": "llama3-70b-8192",
                "temperature": 1,
                "max_tokens": 1024,
                "top_p": 1,
                "stream": true,
                "stop": null
            });
            let accumulatedContent = '';
            for await (const chunk of chatResponse) {
                accumulatedContent += chunk.choices[0]?.delta?.content || '';
            }
            user.chats.push({content:accumulatedContent,role:"assistant"});
            await user.save();
            return res.status(200).json({chats:user.chats})
        } catch (error) {
            console.log(error);
            return res.status(500).json({message:"Something went wrong"});
            
        }
}

export const sendChatToUser = async (req:Request,res: Response,next: NextFunction) =>{
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if(!user)
            {
                return res.status(401).send("User not registered or Token malfunctioned");
            }
        if (user._id.toString()!== res.locals.jwtData.id){
            return res.status(401).send("Permissions didnt match");
        }
        return res.status(200).json({message:"Ok", chats:user.chats});
    } catch (error) {
        console.log(error);
        return res.status(200).json({message:"Error",cause: error.message});
    }
};


export const deleteChats = async (req:Request,res: Response,next: NextFunction) =>{
    try {
        const user = await User.findById(res.locals.jwtData.id);
        if(!user)
            {
                return res.status(401).send("User not registered or Token malfunctioned");
            }
        if (user._id.toString()!== res.locals.jwtData.id){
            return res.status(401).send("Permissions didnt match");
        }
        //@ts-ignore
        user.chats=[];
        await user.save();

        return res.status(200).json({message:"Ok"});
    } catch (error) {
        console.log(error);
        return res.status(200).json({message:"Error",cause: error.message});
    }
};


