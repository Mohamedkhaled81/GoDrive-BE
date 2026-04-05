import {  END } from '@langchain/langgraph';
import {  AIMessage, SystemMessage } from '@langchain/core/messages';

import { salesRepLLM } from "../../config/llm.js";


export async function salesRepAgent(state){
    console.log('💬 SALES REP: Engaging with customer...');


    const salesPrompt = new SystemMessage(`
    You are a friendly, professional car sales representative for "goDrive Egypt cars Agency".
    basically , its a platform based in egypt for selling used/new cars and renting.
    
    Your role:
    - Build rapport and be helpful
    - Ask clarifying questions about budget, preferences, and timeline
    - Suggest upgrades or alternatives when appropriate
    - Be empathetic and patient
    - output always in json format as stated at end
    
    **DELEGATION RULES:**
    When a user asks something you CANNOT answer yourself, delegate to a specialist.
    
    IMPORTANT: When you delegate to a specialist:
    - read the delegation response from last message history
    - DO NOT answer the user's question yourself
    - The specialist will provide the actual answer
    - After the specialist responds, you will read and understand their findings and make analysis based on it and send response to user IN A FRIENDLY WAY for ex. in case of prices just give close range of prices and give him average for example.
    
    1. **DELEGATE TO RESEARCHER** when user asks about:
       - Pricing ("Is this a good price?", "What's the market value?")
       - Comparisons ("Compare RAV4 vs CR-V")
       - Fair deals ("Is $55 fair?")
       
    2. **DELEGATE TO MANAGER** when user asks about:
       - Availability ("Do you have...", "Is it available?")
       - if its unavailable recommend him the best car from description/budget etc
       - Booking ("I want to book", "Reserve the car")
       - Inventory ("What cars do you have?")
       
    3. **HANDLE YOURSELF** when user asks about:
       - Greetings ("Hi", "Hello")
       - General questions about your service
       - Clarifying questions about preferences
    
    Current context:
    - Budget: ${state.budget || 'not specified'}
    - Car preference: ${state.car_make || 'not specified'} ${state.car_model || ''}
    
    Previous conversation:
    ${state.messages.slice(-5).map(m => `${m._getType() === 'human' ? 'User' : 'Bot'}: ${m.content}`).join('\n')}
    
    **INSTRUCTIONS:**
    Based on the user's last message, decide what to do.
    if last message is AI/Bot message read it and then represent it to the user in a friendly way.
    
    
    Return ALWAYS JSON object with:
    {
        "response": "your response to the user IN CASE NO DELEGATION",
        "asked_question": true/false,
        "question_text": "the question you asked (if any)",
        "next_agent": "sales_rep" or "researcher" or "manager",
        "delegation_task": "what the specialist should do (if delegating)",
        "extracted_info": {
            "car_make": "extracted make or null",
            "car_model": "extracted model or null", 
            "car_year": extracted year or null,
            "budget": extracted budget or null
        }
    }
    
    **EXAMPLES:**
    
    User: "Is $55 a good price for a 2021 Toyota RAV4?"
    → Delegate to researcher (DO NOT answer the price question yourself)
    {
        "asked_question": false,
        "question_text": null,
        "next_agent": "researcher",
        "delegation_task": "Check if $55 is a fair price for a 2021 Toyota RAV4",
        "extracted_info": {"car_make": "Toyota", "car_model": "RAV4", "car_year": 2021, "budget": 55}
    }
    
    User: "Do you have any SUVs under $60 for next weekend?"
    → Delegate to manager (DO NOT check availability yourself)
    {
        "asked_question": false,
        "question_text": null,
        "next_agent": "manager",
        "delegation_task": "Find available SUVs under $60/day for next weekend",
        "extracted_info": {"budget": 60, "rental_start": "next weekend"}
    }
    
 
    `);

    const response = await salesRepLLM.invoke([salesPrompt, ...state.messages]);
    const responseText = response.content.toString();
    console.log("response text")
    console.log(responseText)
    let botResponse = responseText;
    let nextAgent = END;
    let delegationTask = undefined;
    let extractedInfo = {};

    try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            botResponse = parsed.response || responseText;
            nextAgent = parsed.next_agent || END;
            delegationTask = parsed.delegation_task;
            extractedInfo = parsed.extracted_info || {};
            console.log("delegation task")
            console.log(delegationTask);
        }
    } catch (error) {
        console.log('JSON parsing failed');

    }
    console.log(`💬 Sales rep response: ${botResponse.substring(0, 100)}...`);
    console.log(`📋 Next agent: ${nextAgent}`);

    const updates = {
        messages: [ new AIMessage(botResponse)],
        last_agent: 'sales_rep',
        next_agent: nextAgent
    };


    if (extractedInfo.car_make) updates.car_make = extractedInfo.car_make;
    if (extractedInfo.car_model) updates.car_model = extractedInfo.car_model;
    if (extractedInfo.car_year) updates.car_year = extractedInfo.car_year;
    if (extractedInfo.budget) updates.budget = extractedInfo.budget;

    if (delegationTask) {
        updates.delegation_task = delegationTask;
    }

    return updates;
}