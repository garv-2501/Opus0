# app/agents/web_scraper_agent.py
import os
import logging
from gpt_researcher import GPTResearcher
from typing import Dict

# Initialize logging for this agent
logger = logging.getLogger(__name__)

class WebScraperAgent:
    def __init__(self, query: str):
        """
        Initializes the Web Scraper Agent with a query for a comprehensive research report.
        :param query: The query to research.
        """
        self.query = query
        self.researcher = GPTResearcher(query=self.query, report_type="research_report")  # Use "research_report" for in-depth research

    async def fetch_report(self, output_to_file: bool = True) -> Dict:
        """
        Conducts research based on the query and returns a comprehensive report.
        If `output_to_file` is False, directly returns the response without writing to a file.

        :param output_to_file: Determines whether to write the output to a file or return it directly.
        :return: A dictionary containing the full report, sources, costs, images, and other metadata.
        """
        logger.info(f"Starting comprehensive research for query: {self.query}")

        # Conduct the research and generate the report
        await self.researcher.conduct_research()
        full_report = await self.researcher.write_report()
        
        # Gather additional details like sources, costs, and images
        research_sources = self.researcher.get_source_urls()
        research_costs = self.researcher.get_costs()
        research_images = self.researcher.get_research_images()

        # Combine the contextual message, user input, and detailed report data
        complete_data = (
            "The following output was provided by an LLM that has internet searching and research capabilities. Use the information and references given where useful. OUTPUT:\n\n"
            f"User Query:\n{self.query}\n\n"
            f"Research Report:\n{full_report}\n\n"
            f"Sources:\n" + "\n".join(research_sources) + "\n\n"
            f"Research Costs: {research_costs}\n"
            f"Number of Research Images: {len(research_images)}"
        )

        # If output_to_file is True, write all data to the file
        if output_to_file:
            output_path = os.path.join("app", "data", "internet_data.txt")
            with open(output_path, "w") as file:
                file.write(complete_data)
            logger.info(f"Saved comprehensive research data to {output_path}")
        else:
            # Log that the data was returned directly
            logger.info("Returning research data directly without saving to file.")
            return {
                "data": complete_data,
                "sources": research_sources,
                "costs": research_costs,
                "images": research_images
            }

        # Return all research data
        return {
            "data": full_report,
            "sources": research_sources,
            "costs": research_costs,
            "images": research_images
        }
