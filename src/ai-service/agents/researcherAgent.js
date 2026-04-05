import { researcherLLM } from '../../config/llm.js';
import {HumanMessage, SystemMessage} from "@langchain/core/messages";

export  async function researcherAgent(state) {
    console.log('🔬 RESEARCHER: Analyzing with tools...');

    const lastMessage = state.messages[state.messages.length - 1];

    const carDetails = {
        make:state.car_make,
        model:state.car_model,
        year:state.car_year,
        budget:state.budget,
    };
    console.log('📝 Extracted car details:', carDetails);

    const enhancedUserMessage = `
    User asked: "${lastMessage.content}"
    
    Extracted car information:
    - Make: ${carDetails.make || 'not specified'}
    - Model: ${carDetails.model || 'not specified'}
    - Year: ${carDetails.year || 'not specified'}
    - Budget: ${carDetails.budget || 'not specified'}
    ${carDetails.compare_make ? `- Compare with: ${carDetails.compare_make} ${carDetails.compare_model || ''}` : ''}
    
    Based on this extracted information, decide which tool to use.
    `;

    const enhancedMessage = new HumanMessage(enhancedUserMessage);

    const response = await researcherLLM.invoke([
        new SystemMessage(`You are a car research specialist for EgyCar Agency.
            
            **TOOLS:**
            - get_car_pricing: Use ONLY for pricing questions (prices, market value, budget)
              → When using this tool, pass a query like: "${carDetails.make} ${carDetails.model} ${carDetails.year || ''} price Egypt"
            
            - web_search_cars: Use for comparisons, specs, maintenance, future plans, general info
              → When using this tool, pass the user's question directly
              
            **CURRENT EXTRACTED INFO:**
            - Car: ${carDetails.make || 'unknown'} ${carDetails.model || 'unknown'} ${carDetails.year || ''}
            - Budget: ${carDetails.budget || 'unknown'}
            ${carDetails.compare_make ? `- Comparison requested: ${carDetails.compare_make} ${carDetails.compare_model || ''}` : ''}
            
            **IMPORTANT:** 
            - For pricing, ALWAYS include the car make, model, and year in your tool query
            - Format pricing queries as: "${carDetails.make} ${carDetails.model} ${carDetails.year || ''} price"`
        ),
        enhancedMessage,
        ...state.messages.slice(-2)
    ]);
    console.log("how many tool calls?")
    console.log(response.tool_calls)
    console.log(response)

    if (response.tool_calls && response.tool_calls.length > 0) {
        console.log(`🔧 LLM requesting tool: ${response.tool_calls[0].name}`);
        console.log(`   With args:`, response.tool_calls[0].args);

        return {
            messages: [response],
            next_agent: "researcher_tools",
            last_agent: "researcher",

            car_make: carDetails.make ,
            car_model: carDetails.model ,
            car_year: carDetails.year ,
            budget: carDetails.budget ,
        };
    }

    return {
        messages: [response],
        next_agent: "sales_rep",
        last_agent: "researcher",
        waiting_for_response: true,
        research_result: response.content.toString(),
        car_make: carDetails.make ,
        car_model: carDetails.model ,
        car_year: carDetails.year ,
        budget: carDetails.budget
    };
}

