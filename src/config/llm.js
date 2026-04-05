import { ChatOpenAI } from '@langchain/openai';
import {pricingTool, webSearchTool} from "../ai-service/tools/knowledgeBaseWebSearch.js";
import {checkAvailabilityTool} from "../ai-service/tools/inventoryTools.js";

export const orchestratorLLM = new ChatOpenAI({
    modelName: 'gpt-4o',
    temperature: 0.3,
    streaming: true
})

export const salesRepLLM = new ChatOpenAI({
    modelName: 'gpt-4o',
    temperature: 0.7
});

export const researcherLLM = new ChatOpenAI({
    modelName: 'gpt-4o-mini',
    temperature: 0.1
}).bindTools([pricingTool,webSearchTool])


export const managerLLM = new ChatOpenAI({
    modelName: 'gpt-4o-mini',
    temperature: 0.1

}).bindTools([checkAvailabilityTool])