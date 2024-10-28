# app/services/langchain_service.py
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from app.agents.code_interpreter_agent import generate_and_execute_code
from app.core.config import settings
from typing import List, Dict

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