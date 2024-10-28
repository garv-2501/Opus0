# app/agents/manager_bot.py

from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from app.core.config import settings
import logging
import json
import re  # Import regex for cleaning the response


# Set up logging
logger = logging.getLogger(__name__)

# Initialize the manager bot model
manager_model = ChatOpenAI(api_key=settings.OPENAI_API_KEY, model="gpt-4o")

# Define the prompt template for the manager bot
manager_prompt = ChatPromptTemplate.from_template("""
Role: You are a manager AI responsible for analyzing user requests and assigning them to the most suitable models or agents from a predefined list, based on their capabilities and best use cases.

Available Models and Agents:

1. **claude-3-5-sonnet-20241022**
   - **Best for**:
     - Coding tasks
     - Complex reasoning
     - Multilingual translations
     - Composing essays with specific tones and literary devices
   - **Examples**:
     - "Write a Python function to reverse a linked list."
     - "Translate the following text to Spanish: 'Good morning, how are you?'"
     - "Write an essay on the effects of climate change using metaphors and similes."

2. **gpt-4o**
   - **Best for**:
     - General questions requiring JSON output
     - Tasks that don't need extensive reasoning
   - **Examples**:
     - "Provide a JSON list of the top 10 largest cities by population."
     - "What is the chemical formula for water?"

3. **gemini-1.5-flash**
   - **Best for**:
     - Fast responses to simple queries
     - Questions that don't require deep reasoning
   - **Examples**:
     - "Who is the president of the United States?"
     - "What is the boiling point of water?"

4. **code_interpreter_agent**
   - **Best for**:
     - Mathematical calculations
     - Problem-solving requiring precise, discrete outputs
     - Avoiding LLM hallucinations in critical computations
   - **Examples**:
     - "Calculate the factorial of 20."
     - "Solve this equation: 2x + 5 = 15."
     - "Count the number of vowels in the word 'encyclopedia'."

5. **web_scraper_agent**
   - **Best for**:
     - Retrieving up-to-date information from the internet
     - Accessing current news, events, or updated documentation
   - **Examples**:
     - "What's the current weather in New York City?"
     - "Find the latest stock price of Tesla."

Instructions:

- **Objective**: Determine the most appropriate model(s) or agent(s) to handle the user's request effectively.
- **Selection Criteria**:
  - **Primary Priority**: Quality of output and correct allocation to models/agents.
  - **Secondary Priority**: Efficiency of the system (prefer fewer models when possible).
- **Multiple Assignments**: You may assign more than one model or agent if necessary due to the complexity of the task.
- **Output Format**:
  - Provide your response in **JSON format** with the following structure:

    ```json
    {{
      "models": ["model_or_agent_name", "another_model_if_applicable"]
    }}
    ```

- **Rules**:
  - **Do Not** include any explanations, reasoning, or additional text outside the JSON output.
  - **Do Not** mention any irrelevant information.

Examples:

- **User Request**: "Translate 'Hello, world!' into Japanese and write a short poem about the sunrise."
- **Assistant Output**:

    ```json
    {{
      "models": ["claude-3-5-sonnet-20241022"]
    }}
    ```

- **User Request**: "What is the current price of Bitcoin?"
- **Assistant Output**:

    ```json
    {{
      "models": ["web_scraper_agent"]
    }}
    ```

- **User Request**: "Calculate the sum of all prime numbers between 1 and 100."
- **Assistant Output**:

    ```json
    {{
      "models": ["code_interpreter_agent"]
    }}
    ```

- **User Request**: "Provide a JSON of the top 10 programming languages by popularity."
- **Assistant Output**:

    ```json
    {{
      "models": ["gpt-4o"]
    }}
    ```

- **User Request**: "Who is Albert Einstein and what are his most significant contributions to science?"
- **Assistant Output**:

    ```json
    {{
      "models": ["gemini-1.5-flash"]
    }}
    ```

- **User Request**: "Write a Python script to analyze stock market data and use the latest data to predict trends."
- **Assistant Output**:

    ```json
    {{
      "models": ["claude-3-5-sonnet-20241022", "web_scraper_agent"]
    }}
    ```

- **User Request**: "Solve this math problem: What's the derivative of sin(x)? Also, explain the concept."
- **Assistant Output**:

    ```json
    {{
      "models": ["code_interpreter_agent", "claude-3-5-sonnet-20241022"]
    }}
    ```

User Request:
{input}

Assistant Output:
""")

async def get_model_recommendations(user_input: str):
    """
    Calls the manager bot to determine which models to assign to the user’s request.
    :param user_input: The message from the user.
    :return: JSON string with model recommendations.
    """
    # Prepare the prompt input
    input_data = {"input": user_input}
    response_contents = []

    # Run the manager model
    async for chunk in (manager_prompt | manager_model).astream(input_data):
        # Extract only the 'content' field from each chunk if it exists
        if hasattr(chunk, 'content') and chunk.content:
            response_contents.append(chunk.content)
    
    # Join the contents and log the raw JSON output
    response_text = ''.join(response_contents).strip()
    logger.info(f"Raw Manager Bot Response: {response_text}")  # Log raw response

    # Remove code fences if present (```json ... ```)
    cleaned_response = re.sub(r"^```(?:json)?|```$", "", response_text, flags=re.MULTILINE).strip()

    try:
        # Parse the response into JSON format
        recommendations = json.loads(cleaned_response)
        logger.info(f"Manager Bot Model Recommendations: {recommendations}")
        return recommendations
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse manager bot output as JSON: {e} | Response: {cleaned_response}")
        return None