import {ToolNode} from "@langchain/langgraph/prebuilt";
import {pricingTool, webSearchTool} from "../tools/knowledgeBaseWebSearch.js";

const researcherTools = new ToolNode([pricingTool,webSearchTool]);
export async function researcherToolsNode(state) {
    console.log('🔧 Executing researcher tools...');

    const lastMessage = state.messages[state.messages.length - 1];

    // this one iinvoke more than 1 tool if needed by llm so its an object containing array of messages
    const result = await researcherTools.invoke({ messages: [lastMessage] });

    return {
        messages: result.messages,
        next_agent: "researcher",
        last_agent: "researcher_tools"
    };
}

