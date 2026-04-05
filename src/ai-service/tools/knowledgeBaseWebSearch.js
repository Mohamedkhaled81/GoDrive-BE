import { DynamicTool } from '@langchain/core/tools';
import { retrieveRelevantChunks } from '../../config/vectordb.js';
import axios from 'axios';

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

export const pricingTool = new DynamicTool({
    name: "get_car_pricing",
    description: `Get car pricing data from our internal Egypt database. Use ONLY for pricing questions.`,
    func: async (query) => {
        console.log(`💰 Pricing tool called with: ${query}`);


        const results = await retrieveRelevantChunks(query, 'cars-listing');

        if (results && results.length > 0) {
            return `📊 **Pricing Data from Egypt Database:**\n\nFound ${results.length} listings:\n\n${results.slice(0, 5).join('\n\n')}\n\n💡 These are actual listings from our database.`;
        }

        return "No pricing data found in our database for this vehicle. Try web search for market rates.";
    }
});

export const webSearchTool = new DynamicTool({
    name: "web_search_cars",
    description: `Search the web for car comparisons, specifications, maintenance, future models, and general car information in Egypt.`,
    func: async (query) => {
        console.log(`🌐 Web search called with: ${query}`);


        try {
            const response = await axios.post('https://api.tavily.com/search', {
                api_key: TAVILY_API_KEY,
                query: `${query} Egypt car market`,
                search_depth: "advanced",
                max_results: 5,
                include_answer: true
            });

            if (response.data && response.data.results) {
                let results = `🔍 **Web Search Results:**\n\n`;

                if (response.data.answer) {
                    results += `**Summary:** ${response.data.answer}\n\n`;
                }

                response.data.results.forEach((result, idx) => {
                    results += `${idx + 1}. **${result.title}**\n`;
                    results += `   ${result.content.substring(0, 300)}...\n`;
                    results += `   Source: ${result.url}\n\n`;
                });
                console.log(results)
                return results;
            }

            return "No web results found.";
        } catch (error) {
            console.error("Web search error:", error);
            return "Unable to fetch web data at this time.";
        }
    }
});
