# app/services/langchain_service.py

import os
# Langchain imports
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
# Agent imports
from app.agents.manager_bot import get_model_recommendations
from app.agents.sub_question_agent import generate_sub_questions
from app.agents.code_interpreter_agent import generate_and_execute_code
from app.agents.web_scraper_agent import WebScraperAgent

# Config settings import
from app.core.config import settings
# Other libraries
from typing import List, Dict
import logging

logger = logging.getLogger(__name__)

# Initialize models
openai_model = ChatOpenAI(api_key=settings.OPENAI_API_KEY, model="gpt-4o")
claude_model = ChatAnthropic(api_key=settings.ANTHROPIC_API_KEY, model="claude-3-5-sonnet-20241022")
gemini_model = ChatGoogleGenerativeAI(api_key=settings.GOOGLE_API_KEY, model="gemini-1.5-flash")

# Define the prompt template
prompt = ChatPromptTemplate.from_template("""
You are a helpful AI assistant. Use the following conversation history to provide contextually relevant responses.

{chat_history}
User: {input}
Assistant:""")

# Initialize conversation chains for each model
openai_chain = prompt | openai_model | StrOutputParser()
claude_chain = prompt | claude_model | StrOutputParser()
gemini_chain = prompt | gemini_model | StrOutputParser()

# Model selection function
def get_model_chain(model_name: str):
    """Returns the appropriate model chain based on the model name."""
    if model_name == "gpt-4o":
        return openai_chain
    elif model_name == "claude-3-5-sonnet-20241022":
        return claude_chain
    elif model_name == "gemini-1.5-flash":
        return gemini_chain
    else:
        raise ValueError(f"Unsupported model: {model_name}")

async def get_chat_response(chat_history: List[Dict], message: str, model_name: str = "gpt-4"):
    """
    Generates a response from the specified model using the provided chat history and current message.

    :param chat_history: List of message dictionaries containing 'role' and 'content'.
    :param message: The current user message.
    :param model_name: The model to use for response generation.
    :return: The generated assistant response as a string.
    """
    # Format the chat history
    formatted_history = ""
    for msg in chat_history:
        role = "User" if msg["role"] == "user" else "Assistant"
        formatted_history += f"{role}: {msg['content']}\n"

    # Prepare input data
    input_data = {
        "chat_history": formatted_history,
        "input": message
    }

    # Get the appropriate model chain
    chain = get_model_chain(model_name)

    # Generate response using the selected chain
    async for chunk in chain.astream(input_data):
        yield chunk
        
async def handle_code_interpreter_request(input_text: str):
    """
    Handles requests for code execution by generating and running Python code.
    """
    return await generate_and_execute_code(input_text)

async def run_manager_bot(user_input: str):
    """
    Runs the manager bot to get model recommendations for the given user input.
    :param user_input: The user message that needs model recommendations.
    """
    recommendations = await get_model_recommendations(user_input)
    # Log the recommendations for inspection
    if recommendations:
        logger.info(f"Manager Bot Recommendations (Inside run_manager_bot): {recommendations}")
    else:
        logger.error("Manager Bot returned None or an unexpected format.")
    return recommendations        
        
async def run_web_scraper_agent(query: str, output_to_file: bool = True) -> Dict:
    """
    Runs the Web Scraper Agent to fetch real-time information based on the query.
    :param query: The query to research and scrape information for.
    :param output_to_file: Determines whether the output is written to a file or returned directly.
    :return: A dictionary with the report and additional metadata like sources, costs, and images.
    """
    try:
        scraper_agent = WebScraperAgent(query=query)
        result = await scraper_agent.fetch_report(output_to_file=output_to_file)
        logger.info(f"Web Scraper Agent Result: {result}")
        return result
    except Exception as e:
        logger.error(f"Error running Web Scraper Agent: {e}")
        return {"error": str(e)}
    
async def run_llm_model_and_log(model_name: str, message: str, chat_history: List[Dict]):
    """
    Runs a specified LLM model and logs its output to llm_data.txt in one go after generation.
    
    :param model_name: Name of the model to use.
    :param message: The user message for which the model will generate a response.
    :param chat_history: List of previous conversation history, each with 'role' and 'content'.
    """
    # Ensure the directory exists
    output_dir = os.path.join("app", "data")
    os.makedirs(output_dir, exist_ok=True)  # Create directory if it doesn't exist
    
    # Select model chain based on model_name
    model_chain = get_model_chain(model_name)
    
    # Format the chat history to match expected input format
    formatted_history = ""
    for msg in chat_history:
        role = "User" if msg["role"] == "user" else "Assistant"
        formatted_history += f"{role}: {msg['content']}\n"

    # Prepare input data including both chat_history and message
    input_data = {
        "chat_history": formatted_history,
        "input": message
    }

    # Collect all chunks into a single string
    response_content = ""
    async for chunk in model_chain.astream(input_data):
        response_content += chunk

    # Define the contextual message, user prompt, and response
    output_text = (
        "The following output was provided by a general LLM:\n\n"
        f"User Prompt:\n{message}\n\n"
        f"LLM Response:\n{response_content}\n\n"
    )

    # Append the entire content to llm_data.txt in one go without erasing existing content
    output_path = os.path.join(output_dir, "llm_data.txt")
    try:
        with open(output_path, "a") as file:  # Open in append mode
            file.write(output_text)  # Write all content at once
        print(f"Successfully wrote to {output_path}")  # Optional: Logging confirmation
    except Exception as e:
        print(f"Error writing to {output_path}: {e}")


async def gemini_flash_aggregator(chat_history: list, file_paths: list):
    """
    Reads data from specified file paths and uses Gemini Flash to generate a final output
    based on the user's intent inferred from the chat history and aggregated data.
    
    :param chat_history: List of message dictionaries containing 'role' and 'content'.
    :param file_paths: List of file paths to aggregate data from.
    :return: The aggregated response from the Gemini Flash model.
    """
    # Format the chat history similar to get_chat_response
    formatted_history = ""
    for msg in chat_history:
        role = "User" if msg["role"] == "user" else "Assistant"
        formatted_history += f"{role}: {msg['content']}\n"

    # Aggregate data from each file
    aggregated_data = ""
    for file_path in file_paths:
        if os.path.exists(file_path):
            with open(file_path, "r") as file:
                aggregated_data += file.read() + "\n\n"  # Separator between contents

    # Define a prompt to guide the model for a user-friendly output
    prompt = """
    You are an AI assistant with a deep understanding of user intent. Based on the provided conversation context and aggregated data from different agents on the user input, adapt your response to the user's question and give a comprehensive output with the help of given data. Important! Don't mention the data sources explicitly.
    """

    # Prepare the input data for Gemini Flash, including prompt, chat_history, and aggregated data
    input_data = {
        "chat_history": formatted_history,
        "input": prompt + aggregated_data
    }
    
    # log the input data
    logger.info(f"Input data for Gemini Flash Aggregator: {input_data}")

    # Use the Gemini Flash model to generate the final response
    gemini_flash_chain = get_model_chain("gpt-4o")
    final_output = ""

    # Generate the output asynchronously
    async for chunk in gemini_flash_chain.astream(input_data):
        yield chunk
        
async def run_sub_question_agent(user_input: str):
    """
    Runs the sub-question generator to create sub-questions for the user's request.
    :param user_input: The user message to analyze for potential sub-questions.
    :return: JSON dictionary with sub-questions if applicable.
    """
    sub_questions = await generate_sub_questions(user_input)
    # Log the sub-questions for inspection
    if sub_questions:
        logger.info(f"Sub-Question Generator Output: {sub_questions}")
    else:
        logger.info("No sub-questions generated or sub-question generator returned an empty result.")
    return sub_questions
