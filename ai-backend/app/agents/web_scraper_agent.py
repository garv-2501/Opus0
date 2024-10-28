import os
import logging
from gpt_researcher import GPTResearcher
from typing import Dict

# Initialize logging for this agent
logger = logging.getLogger(__name__)

class WebScraperAgent:
    def __init__(self, query: str, max_links: int = 5):
        """
        Initializes the Web Scraper Agent with a query and a maximum number of links.
        :param query: The query to research.
        :param max_links: The maximum number of links to retrieve.
        """
        self.query = query
        self.max_links = max_links
        self.researcher = GPTResearcher(query=self.query, report_type="resource_report")  # Use "resource_report" to focus on resources

    async def fetch_report(self) -> Dict:
        """
        Conducts research based on the query and returns only the links (sources).
        :return: A dictionary containing only the links to sources.
        """
        logger.info(f"Starting research for query: {self.query}")

        # Conduct the research to gather sources
        await self.researcher.conduct_research()
        
        # Fetch only the source URLs, limiting to the max_links specified
        research_sources = self.researcher.get_source_urls()[:self.max_links]

        # Combine the links into a simple text format
        links_text = f"Sources:\n" + "\n".join(research_sources) + "\n"

        # Define the output path for saving the links
        output_path = os.path.join("app", "data", "internet_data.txt")

        # Write the links to the file, overwriting any existing content
        with open(output_path, "w") as file:
            file.write(links_text)

        logger.info(f"Saved links-only research data to {output_path}")

        # Return only the sources in the output
        return {
            "sources": research_sources
        }
