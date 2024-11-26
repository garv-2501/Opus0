# app/api/routes/chat.py
from app.services.langchain_service import (
    get_chat_response, 
    handle_code_interpreter_request, 
    run_manager_bot, 
    run_web_scraper_agent, 
    run_llm_model_and_log,
    gemini_flash_aggregator,  # New aggregator function for final output
    run_sub_question_agent  # Newly added sub-question agent function
)
from app.db import chat_histories_collection, ADMIN_USER_ID, ADMIN_CONVERSATION_ID
from datetime import datetime
import asyncio
import logging
import os

logger = logging.getLogger(__name__)

async def process_message(message: str):
    """
    Processes an incoming user message based on manager bot recommendations, 
    running agents and models in parallel and aggregating results.
    """
    try:
        # Step 1: Define the fixed conversation_id for the admin user and retrieve chat history
        conversation_id = ADMIN_CONVERSATION_ID

        # Retrieve the existing chat_history document or create it if not found
        chat_history_doc = chat_histories_collection.find_one({
            "conversation_id": conversation_id,
            "user_id": ADMIN_USER_ID
        })
        
        if not chat_history_doc:
            chat_history_doc = {
                "conversation_id": conversation_id,
                "user_id": ADMIN_USER_ID,
                "messages": []
            }
            chat_histories_collection.insert_one(chat_history_doc)
            logger.info(f"Created new chat history with conversation_id: {conversation_id}")
        
        # Extract chat history messages for the aggregator
        chat_history = chat_history_doc.get("messages", [])

        # Step 2: Add the user message to the chat history
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

        # Step 3: Generate sub-questions based on the user's message and history, if applicable
        sub_questions = await run_sub_question_agent(message)
        if sub_questions:
            logger.info(f"Generated Sub-Questions: {sub_questions}")

        # Step 4: Run manager bot and get model recommendations
        manager_bot_recommendations = await run_manager_bot(message)
        logger.info(f"Manager Bot Recommendations: {manager_bot_recommendations}")

        recommended_models = manager_bot_recommendations.get("models", [])

        # Step 5: Check if only one model/agent is recommended
        if len(recommended_models) == 1 and "code_interpreter_agent" not in recommended_models:
            model_or_agent = recommended_models[0]

            # Directly run the agent or LLM based on the recommendation
            if model_or_agent == "web_scraper_agent":
                output = await run_web_scraper_agent(message, output_to_file=False)
                yield output["data"]  # Stream the output directly

            elif model_or_agent in ["gpt-4o", "claude-3-5-sonnet-20241022", "gemini-1.5-flash"]:
                response_chunks = []
                async for chunk in get_chat_response(chat_history, message, model_name=model_or_agent):
                    response_chunks.append(chunk)
                    yield chunk  # Stream the LLM output directly
                
                # Combine all chunks into a complete response
                output = ''.join(response_chunks)
            
            # Append the output as an assistant message to the chat history
            final_output = output["data"] if isinstance(output, dict) else output
            assistant_message = {
                "role": "assistant",
                "content": final_output,
                "timestamp": datetime.utcnow()
            }
            chat_histories_collection.update_one(
                {"conversation_id": conversation_id, "user_id": ADMIN_USER_ID},
                {"$push": {"messages": assistant_message}}
            )
            logger.info(f"Appended assistant response to conversation_id: {conversation_id}")
        
        else:
            # Step 6: Execute the recommended tasks in parallel for multiple models/agents
            tasks = []
            if "web_scraper_agent" in recommended_models:
                tasks.append(run_web_scraper_agent(message))  # Writes to internet_data.txt

            if "code_interpreter_agent" in recommended_models:
                tasks.append(handle_code_interpreter_request(message))  # Writes to code_interpreter_data.txt

            for model in recommended_models:
                if model in ["gpt-4o", "claude-3-5-sonnet-20241022", "gemini-1.5-flash"]:
                    tasks.append(run_llm_model_and_log(model, message, chat_history))

            # Wait for all tasks to complete
            await asyncio.gather(*tasks)

            # Step 7: Aggregate the results using the Gemini Flash model and yield each chunk as generated
            final_output_chunks = []
            async for chunk in gemini_flash_aggregator(chat_history, ["app/data/internet_data.txt", "app/data/code_interpreter_data.txt", "app/data/llm_data.txt"]):
                final_output_chunks.append(chunk)
                yield chunk  # Stream each chunk to the frontend as it is generated

            # Combine all chunks into a single response for storing in chat history
            final_output = ''.join(final_output_chunks)

            # Step 8: Store the final output in chat history as an assistant message
            assistant_message = {
                "role": "assistant",
                "content": final_output,
                "timestamp": datetime.utcnow()
            }
            chat_histories_collection.update_one(
                {"conversation_id": conversation_id, "user_id": ADMIN_USER_ID},
                {"$push": {"messages": assistant_message}}
            )
            logger.info(f"Appended assistant response to conversation_id: {conversation_id}")

            # Step 9: Clear the data files after storing the assistant response
            data_files = ["app/data/code_interpreter_data.txt", "app/data/internet_data.txt", "app/data/llm_data.txt"]
            for file_path in data_files:
                with open(file_path, "w") as file:
                    file.write("")  # Empty the file contents
            logger.info("Cleared all data files after storing the assistant response.")

    except Exception as e:
        logger.error(f"Error processing message: {e}")
        
        # Define an error message to show in the chat history
        error_message = "An error occurred while processing your message."

        # Add the error message to the chat history as an assistant message
        assistant_error_message = {
            "role": "assistant",
            "content": f"{error_message}\n\n(Note: An error occurred in generating a full response.)",
            "timestamp": datetime.utcnow()
        }
        chat_histories_collection.update_one(
            {"conversation_id": conversation_id, "user_id": ADMIN_USER_ID},
            {"$push": {"messages": assistant_error_message}}
        )
        logger.info(f"Appended error response to conversation_id: {conversation_id}")

        # Yield the error message to the frontend
        yield error_message
