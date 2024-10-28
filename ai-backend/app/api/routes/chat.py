# app/api/routes/chat.py
from app.services.langchain_service import get_chat_response, handle_code_interpreter_request
from app.db import chat_histories_collection, ADMIN_USER_ID, ADMIN_CONVERSATION_ID
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

async def process_message(message: str, model_name: str = "gemini-1.5-flash"):
    """
    Processes an incoming user message by either using a general chat model or triggering the coding agent,
    logging responses and storing chat history.

    :param message: The incoming user message.
    :param model_name: The model to use for generating the assistant's response.
    :return: Yields chunks of the assistant's response.
    """
    try:
        # Define the fixed conversation_id for the admin user
        conversation_id = ADMIN_CONVERSATION_ID
        
        # Retrieve the existing chat_history document
        chat_history_doc = chat_histories_collection.find_one({
            "conversation_id": conversation_id,
            "user_id": ADMIN_USER_ID
        })
        
        if not chat_history_doc:
            # Create a new chat_history document if it doesn't exist
            chat_history_doc = {
                "conversation_id": conversation_id,
                "user_id": ADMIN_USER_ID,
                "messages": []
            }
            chat_histories_collection.insert_one(chat_history_doc)
            logger.info(f"Created new chat history with conversation_id: {conversation_id}")
        
        # Extract the messages array
        chat_history = chat_history_doc.get("messages", [])
        
        # Append the incoming user message to the chat history
        user_message = {
            "role": "user",
            "content": message,
            "timestamp": datetime.utcnow()
        }
        chat_histories_collection.update_one(
            {"conversation_id": conversation_id, "user_id": ADMIN_USER_ID},
            {"$push": {"messages": user_message}}
        )
        logger.info(f"Appended user message to conversation_id: {conversation_id}")
        
        # Check if the message requests code interpretation (e.g., contains "run code")
        if "run code" in message.lower():
            logger.info("Triggering the code interpreter agent.")
            execution_result = await handle_code_interpreter_request(message)
            response_content = f"Execution Results:\n{execution_result}"
            yield response_content  # Stream output directly to the client
            
            # Append the execution result to chat history as an assistant message
            assistant_message = {
                "role": "assistant",
                "content": response_content,
                "timestamp": datetime.utcnow()
            }
            chat_histories_collection.update_one(
                {"conversation_id": conversation_id, "user_id": ADMIN_USER_ID},
                {"$push": {"messages": assistant_message}}
            )
            logger.info(f"Appended code interpreter response to conversation_id: {conversation_id}")
        else:
            # Generate response using the selected model if no code interpretation is needed
            assistant_response_chunks = []
            async for chunk in get_chat_response(chat_history, message, model_name=model_name):
                assistant_response_chunks.append(chunk)
                yield chunk  # Stream each chunk to the client as it's generated
            
            # Combine all chunks to form the complete response
            assistant_response = ''.join(assistant_response_chunks)
            
            # Append the assistant's response as a single message to the chat history
            assistant_message = {
                "role": "assistant",
                "content": assistant_response,
                "timestamp": datetime.utcnow()
            }
            chat_histories_collection.update_one(
                {"conversation_id": conversation_id, "user_id": ADMIN_USER_ID},
                {"$push": {"messages": assistant_message}}
            )
            logger.info(f"Appended assistant response to conversation_id: {conversation_id}")
    
    except Exception as e:
        logger.error(f"Error processing message: {e}")
        yield "An error occurred while processing your message."
