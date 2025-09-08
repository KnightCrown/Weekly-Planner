import OpenAI from 'openai';

/**
 * Initializes the OpenAI client with the API key from environment variables.
 * @returns {OpenAI} Configured OpenAI client instance.
 */
const openai = new OpenAI({
  dangerouslyAllowBrowser: true, // Required for client-side usage in React
});

/**
 * Generates task suggestions using GPT-5 for the weekly planner
 * @param {string} prompt - The user's input for task generation
 * @param {string} day - The day for which to generate tasks
 * @param {string} timeSlot - The time slot for which to generate tasks
 * @returns {Promise<Object>} Generated task suggestions
 */
export async function generateTaskSuggestions(prompt, day, timeSlot) {
  try {
    const response = await openai?.chat?.completions?.create({
      model: 'gpt-5-mini', // Cost-effective for task generation
      messages: [
        { 
          role: 'system', 
          content: `You are a helpful productivity assistant that generates task suggestions for weekly planners. 
          Generate realistic, actionable tasks based on the user's input. 
          Consider the day (${day}) and time slot (${timeSlot}) when making suggestions.
          Keep tasks concise and achievable within a typical time block.` 
        },
        { 
          role: 'user', 
          content: `Generate task suggestions for: ${prompt}. Day: ${day}, Time: ${timeSlot}` 
        },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'task_suggestions',
          schema: {
            type: 'object',
            properties: {
              tasks: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    description: { type: 'string' }
                  },
                  required: ['title', 'description']
                }
              },
              category: { type: 'string' },
              priority_level: { type: 'string', enum: ['high', 'medium', 'low'] }
            },
            required: ['tasks', 'category'],
            additionalProperties: false,
          },
        },
      },
      reasoning_effort: 'minimal',
      verbosity: 'low',
    });

    return JSON.parse(response?.choices?.[0]?.message?.content);
  } catch (error) {
    console.error('Error generating task suggestions:', error);
    throw error;
  }
}

/**
 * Analyzes task completion patterns and provides insights
 * @param {Array} tasks - Array of task objects
 * @returns {Promise<Object>} Analysis insights
 */
 

export default openai;