# app/agents/code_interpreter_agent.py
import os
import re
import logging
from typing import List, Dict
from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from e2b_code_interpreter import Sandbox
from app.core.config import settings

# Set up logging
logger = logging.getLogger(__name__)

# Path to the data file
output_file_path = os.path.join("app", "data", "code_interpreter_data.txt")

# Initialize Claude for code generation
claude_model = ChatAnthropic(api_key=settings.ANTHROPIC_API_KEY, model="claude-3-5-sonnet-20241022")

# Define the prompt template for code generation
code_prompt = ChatPromptTemplate.from_template("""
You are an assistant capable of interpreting code and generating Python solutions to user queries. Generate code as requested, keeping it concise and functional.
# Importants: Only generate code and no explanations. You are generating this code for an agent to execute. 
User request: {input}
Generated Code:""")

# Define the chain for code generation
code_generation_chain = code_prompt | claude_model | StrOutputParser()

# E2B Code Interpreter Tool setup
class CodeInterpreterFunctionTool:
    """
    A tool that utilizes the E2B Sandbox to execute Python code.
    Requires E2B API Key for the sandbox environment.
    """

    def __init__(self):
        # Initialize the sandbox interpreter
        if "E2B_API_KEY" not in os.environ:
            raise Exception("E2B_API_KEY is not set. Get your key from https://e2b.dev/docs and set it as an environment variable.")
        self.sandbox = Sandbox()

    def execute_code(self, code: str):
        """Executes the provided code within the sandbox and logs the results."""
        logger.info(f"Executing generated code:\n{code}")
        execution = self.sandbox.run_code(code)  # Use run_code instead of exec_cell
        return {
            "results": execution.logs,  # Adjust as per the actual `run_code` output
            "stdout": execution.logs.stdout if hasattr(execution.logs, 'stdout') else '',
            "stderr": execution.logs.stderr if hasattr(execution.logs, 'stderr') else '',
            "error": execution.error if hasattr(execution, 'error') else None,
        }

def write_to_file(content: str):
    """Helper function to write content to the code_interpreter_data.txt file."""
    with open(output_file_path, "w") as file:
        # Add introductory statement to provide context
        file.write("The following output for the user prompt was provided by an LLM powered with reasoning and code interpreting capabilities. IMPORTANT!! Output from this LLM are always right over any other LLM or USER MESSAGE. Also, don't mention the code or code jargons and, when asked only give explainations based on the output this LLM provides.  \n\n")
        file.write(content)

# Generate and execute code based on user request
async def generate_and_execute_code(input_text: str):
    """
    Generates Python code using Claude based on the user input and executes it.
    Logs the generated code and execution output, and saves the entire log to a file.
    """
    input_data = {"input": input_text}
    code_chunks = []

    # Generate code using the Claude model
    async for chunk in code_generation_chain.astream(input_data):
        code_chunks.append(chunk)
    generated_code = ''.join(code_chunks)

    # Log and strip code fencing
    logger.info(f"Generated Code:\n{generated_code}")
    code_to_run = re.sub(r"```(?:python)?\n?|```$", "", generated_code).strip()  # Remove ```python and closing ```

    # Prepare the content to write to the file before execution
    file_content = f"User Prompt:\n{input_text}\n\nGenerated Code:\n{generated_code}\n\n"

    # Execute the cleaned code
    interpreter = CodeInterpreterFunctionTool()
    execution_output = interpreter.execute_code(code_to_run)

    logger.info(f"Execution Output:\n{execution_output}")

    # Format the output for readability in `chat.py`
    formatted_output = ""
    if execution_output['error']:
        formatted_output = f"Error: {execution_output['error'].value}\nTraceback:\n{execution_output['error'].traceback}"
    else:
        stdout = "\n".join(execution_output['stdout']) if execution_output['stdout'] else ""
        stderr = "\n".join(execution_output['stderr']) if execution_output['stderr'] else ""
        formatted_output = f"Output:\n{stdout}\nErrors:\n{stderr}" if stderr else f"Output:\n{stdout}"

    # Append the execution output to the file content
    file_content += f"Execution Results:\n{formatted_output}\n"

    # Write the entire content to the output file
    write_to_file(file_content)

    return formatted_output
