# app/services/langchain_service.py
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from app.core.config import settings
from typing import List, Dict

# Initialize the LangChain model
model = ChatOpenAI(api_key=settings.OPENAI_API_KEY, model="gpt-4")  # Specify the model if needed

# Define the prompt template to include chat history
prompt = ChatPromptTemplate.from_template("""
You are a helpful AI assistant. Use the following conversation history to provide contextually relevant responses.

{chat_history}
User: {input}
Assistant:""")

# Initialize the conversation chain with the custom prompt
chain = prompt | model | StrOutputParser()

async def get_chat_response(chat_history: List[Dict], message: str):
    """
    Generates a response from the LLM using the provided chat history and current message.

    :param chat_history: A list of message dictionaries containing 'role' and 'content'.
    :param message: The current user message.
    :return: The generated assistant response as a string.
    """
    # Format the chat history into a readable string
    formatted_history = ""
    for msg in chat_history:
        role = "User" if msg["role"] == "user" else "Assistant"
        formatted_history += f"{role}: {msg['content']}\n"
    
    # Prepare the input for the chain
    input_data = {
        "chat_history": formatted_history,
        "input": message
    }
    
    # Generate the response using LangChain
    async for chunk in chain.astream(input_data):
        yield chunk
