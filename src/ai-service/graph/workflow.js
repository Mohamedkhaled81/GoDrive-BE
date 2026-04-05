import { StateGraph, END } from '@langchain/langgraph';
import { salesRepAgent } from '../agents/salesRepAgent.js';
import {researcherAgent} from "../agents/researcherAgent.js";

import {managerAgent} from '../agents/managerAgent.js';
import {managerToolsNode} from "../agents/managerToolsNode.js";
import {researcherToolsNode} from "../agents/researcherToolsNode.js";

function routeAfterSalesRep(state){
    console.log(`🔄 Routing from Sales Rep to: ${state.next_agent}`);

    if (state.next_agent === 'researcher') return 'researcher';
    if (state.next_agent === 'manager') return 'manager';
    return END;
}


function routeAfterResearcher(state){
    console.log(`🔄 Routing from Researcher...`);

    if (state.next_agent === 'researcher_tools') return 'researcher_tools';
    if (state.next_agent === 'sales_rep') return 'sales_rep';
    return END;
}

function routesAfterManager(state){
    console.log(`🔄 Routing from Manager...`);

    if (state.next_agent === 'manager_tools') return 'manager_tools';
    if (state.next_agent === 'sales_rep') return 'sales_rep';
    return END;
}


export function createOrchestrator() {
    const workflow = new StateGraph({
        channels: {
            messages: {value: (a, b) => [...(a || []), ...(b || [])]},
            car_make: {value: (a, b) => b ?? a},
            car_model: {value: (a, b) => b ?? a},
            car_year: {value: (a, b) => b ?? a},
            budget: {value: (a, b) => b ?? a},
            rental_start_date: {value: (a, b) => b ?? a},
            rental_end_date: {value: (a, b) => b ?? a},
            last_agent: {value: (a, b) => b ?? a},
            waiting_for_response: {value: (a, b) => b ?? a},
            pending_question: {value: (a, b) => b ?? a},
            next_agent: {value: (a, b) => b ?? a},
            delegation_task: {value: (a, b) => b ?? a},
            research_result: {value: (a, b) => b ?? a},
            availability_result: {value: (a, b) => b ?? a},

        }
    });

        //nodees
        workflow.addNode('sales_rep', salesRepAgent);
        workflow.addNode('researcher', researcherAgent);
        workflow.addNode('researcher_tools', researcherToolsNode);
        workflow.addNode('manager', managerAgent);
        workflow.addNode('manager_tools',managerToolsNode)
        //edges
        workflow.addEdge('__start__', 'sales_rep');
        workflow.addConditionalEdges('sales_rep', routeAfterSalesRep);
        workflow.addConditionalEdges('researcher', routeAfterResearcher);
        workflow.addConditionalEdges('manager', routesAfterManager)
        workflow.addEdge('researcher_tools', 'sales_rep');
        workflow.addEdge('manager_tools', 'manager');


        return workflow.compile();
    }
