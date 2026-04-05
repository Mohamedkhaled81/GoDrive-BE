// Tool execution node
import {checkAvailabilityTool} from "../tools/inventoryTools.js";

import {ToolMessage} from "@langchain/core/messages";


export async function managerToolsNode(state) {
    console.log('🔧 Executing manager tools...');

    const lastMessage = state.messages[state.messages.length - 1];

    if (!lastMessage.tool_calls?.length) {
        return { messages: [], next_agent: "manager", last_agent: "manager_tools" };
    }

    const results = [];
    for (const toolCall of lastMessage.tool_calls) {
        if (toolCall.name === 'check_availability') {
            console.log(toolCall.args)
            const result = await checkAvailabilityTool.invoke(toolCall.args);
            results.push(new ToolMessage({
                content: JSON.stringify(result),
                tool_call_id: toolCall.id
            }));
        }
    }

    return {
        messages: results,
        next_agent: "manager",
        last_agent: "manager_tools"
    };
}