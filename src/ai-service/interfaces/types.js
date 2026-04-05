// agentState.js
export function createDefaultState(session_id, user_id) {
    return {
        messages: [],

        car_make: null,
        car_model: null,
        car_year: null,
        budget: null,
        rental_start_date: null,
        rental_end_date: null,
        pending_question: null,
        waiting_for_response: false,
        delegation_task: null,
        research_result: null,
        last_agent: 'sales_rep',
        next_agent: 'sales_rep',
        error: null
    };
}

export const AGENT_TYPES = {
    SALES_REP: 'sales_rep',
    RESEARCHER: 'researcher',
    MANAGER: 'manager',
    RESEARCHER_TOOLS: 'researcher_tools',
    MANAGER_TOOLS: 'manager_tools',
    HUMAN: 'human',
    END: '__end__'
};