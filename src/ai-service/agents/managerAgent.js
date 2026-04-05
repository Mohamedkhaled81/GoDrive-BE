import {AIMessage, SystemMessage, ToolMessage} from '@langchain/core/messages';
import { managerLLM } from '../../config/llm.js';


export async function managerAgent(state) {
    console.log('📋 MANAGER: Handling availability...');

    const lastMessage = state.messages[state.messages.length - 1];
    const lastAgentType = state.last_agent;

    if (lastAgentType === 'manager_tools') {
        const toolResult = state.messages[state.messages.length - 1];
        let result;

        try {
            result = JSON.parse(toolResult.content);
        } catch {
            result = { available: false, message: toolResult.content };
        }

        let response = '';
        if (result.available && result.availableCars?.length > 0) {
            response = `✅ Found ${result.availableCars.length} car(s):\n\n`;
            result.availableCars.forEach((car, i) => {
                response += `${i+1}. ${car.title} - $${car.pricePerDay}/day\n`;
            });

        } else {
            let carListings = '';
            for (let i = 0; i < result.matchedCars.length; i++) {
                const car = result.matchedCars[i];
                carListings += `\n${i + 1}. ${car.description} - Available: ${car.availability}`;
            }

            response = `❌ No cars available according to what you specified. 

                However, here are some cars we found:
                ${carListings}
                present the data to him in encouraging manner, and ask for adjustments if needed at the end
                `;        }
        console.log("-------------------------")
        console.log(response)

        return {
            messages: [new AIMessage(response)],
            last_agent: 'manager',
            next_agent: 'sales_rep'
        };
    }


    const recentMessages = state.messages.slice(-1);
    const response = await managerLLM.invoke([
        new SystemMessage(`You are a car availability manager for EgyCar Agency.

        **YOUR TASK:**
        Check car availability using the check_availability tool.
        
        **HOW TO EXTRACT DATES:**
        - "next weekend" → current Friday/Saturday
        - "tomorrow" → current date + 1 day
        - "starting now" → today's date
        - "for 3 days" → today to today+3 days
        - "next week" → today+7 days
        
        **WHEN TO ASK FOR MORE INFO:**
        If you cannot determine ALL of these, ask the user:
        - Rental start date (when?)
        - Rental end date (until when?)
        - Car preference (which car?)
        
        **DO NOT ASK FOR:**
        - Budget (can be optional)
        - Car model (can be optional)
        - actually everything can be optional you can ask him once to give him insights but other than that no problem
        **CURRENT DATE:** ${new Date().toISOString().split('T')[0]}
        
        **EXAMPLES:**
        User: "I need a car for next weekend"
        → Calculate dates: start = next Friday, end = next Sunday
        → Call check_availability with those dates
        
        User: "Do you have any Toyotas?"
        → Ask: "What dates do you need the car for?"
        
        User: "From April 10-15, any SUV under $60"
        → Call check_availability with: start_date="2025-04-10", end_date="2025-04-15", budget=60
        
        **USER QUESTION:** ${lastMessage.content}
        
        Respond with a tool call to check_availability, or ask for missing information.`),
        ...recentMessages
    ]);

    if (response.tool_calls?.length > 0) {
        return {
            messages: [response],
            next_agent: "manager_tools",
            last_agent: "manager"
        };
    }
    console.log(response)
    return {
        messages: [response],
        next_agent: "sales_rep",
        last_agent: "manager",
        waiting_for_response: true
    };
}

