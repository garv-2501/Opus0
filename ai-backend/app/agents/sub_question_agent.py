# app/agents/sub_question_agent.py

from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from app.core.config import settings
import logging
import json
import re

# Set up logging
logger = logging.getLogger(__name__)

# Initialize the sub-question generator model
sub_question_model = ChatOpenAI(api_key=settings.OPENAI_API_KEY, model="gpt-4o")

# Define the prompt template for generating sub-questions
sub_question_prompt = ChatPromptTemplate.from_template("""
Role: You are an assistant AI responsible for breaking down complex user requests into sub-questions if needed. Your task is to analyze the user's request and generate logical, sequential sub-questions only if the request is complex enough to warrant it. Use multi-shot examples to guide your approach.

Instructions:
- **Objective**: Determine whether the user’s request requires sub-questions. If it does, generate the sub-questions in a logical sequence.
- **Output Format**:
  - Provide your response in **JSON format** with the following structure:
    ```json
    {{
      "sub_questions": ["Sub-question 1", "Sub-question 2", ...]
    }}
    ```
  - If no sub-questions are required, return an empty list for `sub_questions`.
- **Rules**:
  - **Do Not** include explanations or any extra information outside the JSON structure.
  - Only generate sub-questions if necessary based on the request's complexity.
  - Each question will be fed back to a model separately with no history or context for detailed responses. It should be contextually relevant and logically connected to the main request.

Examples:

- **User Request**: "Write a detailed report on climate change covering causes, impacts, and potential solutions."
- **Assistant Output**:
    ```json
    {{
      "sub_questions": [
        "What are the primary causes of climate change?",
        "What are the major impacts of climate change on different ecosystems?",
        "What are potential solutions to mitigate climate change effects?"
      ]
    }}

- **User Request**: "Summarize the theory of relativity."
- **Assistant Output**:
    ```json
    {{
      "sub_questions": []
    }}
    ```

- **User Request**: "Explain machine learning and its applications in the healthcare industry, including data privacy concerns and ethical implications."
- **Assistant Output**:
    ```json
    {{
      "sub_questions": [
        "What is machine learning and how does it work?",
        "What are the main applications of machine learning in healthcare?",
        "What data privacy concerns arise with machine learning in healthcare?",
        "What are the ethical implications of using machine learning in healthcare?"
      ]
    }}
    ```

User Request:
{input}

Assistant Output:
""")

async def generate_sub_questions(user_input: str):
    """
    Calls the sub-question generator to create sub-questions for the user’s request.
    :param user_input: The message from the user.
    :return: JSON string with sub-questions.
    """
    # Prepare the prompt input
    input_data = {"input": user_input}
    response_contents = []

    # Run the sub-question model
    async for chunk in (sub_question_prompt | sub_question_model).astream(input_data):
        # Extract only the 'content' field from each chunk if it exists
        if hasattr(chunk, 'content') and chunk.content:
            response_contents.append(chunk.content)
    
    # Join the contents and log the raw JSON output
    response_text = ''.join(response_contents).strip()
    logger.info(f"Raw Sub-Question Generator Response: {response_text}")  # Log raw response

    # Remove code fences if present (```json ... ```)
    cleaned_response = re.sub(r"^```(?:json)?|```$", "", response_text, flags=re.MULTILINE).strip()

    try:
        # Parse the response into JSON format
        sub_questions = json.loads(cleaned_response)
        logger.info(f"Sub-Question Generator Output: {sub_questions}")
        return sub_questions
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse sub-question generator output as JSON: {e} | Response: {cleaned_response}")
        return {"sub_questions": []}
