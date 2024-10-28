# Opus0 - AI on Steroids, Designed to Maximize Productivity

![Opus0 Logo](https://i.ibb.co/x3w6mdx/opusLogo.png)

**Revolutionize productivity with Opus0**, an open-source LLM workspace designed for unparalleled performance. Imagine a workspace where cutting-edge AI models collaborate in real-time, optimized specifically for your work. By employing a swarm of **state-of-the-art LLMs**, **custom specialized Retrieval-Augmented Generators (RAGs)**, and **AI agencies**, Opus0 delivers insights that are smarter, richer, and more precise.

## Table of Contents

1. [Introduction](#introduction)
   - [Overview](#overview)
   - [Key Features](#key-features)
   - [Project Goals](#project-goals)
2. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation Guide](#installation-guide)
     - [Cloning the Repository](#cloning-the-repository)
     - [Setting Up Environment Variables](#setting-up-environment-variables)
     - [Installing Dependencies](#installing-dependencies)
   - [Running the Application](#running-the-application)
3. [Project Architecture](#project-architecture)
   - [System Overview](#system-overview)
   - [Components Interaction](#components-interaction)
     - [Frontend and Backend Communication](#frontend-and-backend-communication)
     - [Data Flow](#data-flow)
4. [Backend Components](#backend-components)
   - [AI Engine](#ai-engine)
     - [Responsibilities](#responsibilities)
     - [File Structure](#file-structure-ai)
     - [Packages Used](#packages-used-ai)
     - [Environment Variables](#environment-variables-ai)
   - [Service Backend](#service-backend)
     - [Responsibilities](#responsibilities-backend)
     - [File Structure](#file-structure-backend)
     - [Packages Used](#packages-used-backend)
     - [Environment Variables](#environment-variables-backend)
5. [Frontend Components](#frontend-components)
   - [Web Client](#web-client)
     - [Responsibilities](#responsibilities-frontend)
     - [File Structure](#file-structure-frontend)
     - [Packages Used](#packages-used-frontend)
     - [Environment Variables](#environment-variables-frontend)
6. [Detailed File and Folder Breakdown](#detailed-file-and-folder-breakdown)
   - [AI Engine Files and Folders](#ai-engine-files-and-folders)
     - [Description of Key Files](#key-files-ai)
     - [Purpose of Each Folder](#folder-purpose-ai)
   - [Service Backend Files and Folders](#service-backend-files-and-folders)
     - [Description of Key Files](#key-files-backend)
     - [Purpose of Each Folder](#folder-purpose-backend)
   - [Web Client Files and Folders](#web-client-files-and-folders)
     - [Description of Key Files](#key-files-frontend)
     - [Purpose of Each Folder](#folder-purpose-frontend)
7. [Communication Protocols](#communication-protocols)
   - [WebSockets](#websockets)
   - [REST APIs](#rest-apis)
   - [Other Protocols](#other-protocols)
8. [Contributing to the Project](#contributing-to-the-project)
   - [How to Contribute](#how-to-contribute)
   - [Code of Conduct](#code-of-conduct)
   - [Reporting Issues](#reporting-issues)
9. [Additional Resources](#additional-resources)
   - [FAQs](#faqs)
   - [Tutorials](#tutorials)
   - [Community Links](#community-links)
10. [License](#license)

---

## Introduction

### Overview

**Opus0** is an open-source **LLM workspace** designed to enhance productivity through a swarm-based AI architecture. It deploys a team of **LLM agents** and **specialized Retrieval-Augmented Generators (RAGs)** to handle diverse tasks, providing insights tailored for work. The platform’s autonomous agents simplify complex operations, so users can focus on their goals without the need for technical setup.

### Key Features

- **Open-Source AI Engine**: Fully accessible and community-driven.
- **Dynamic AI Swarm**: Automatically deploys LLM agents and RAGs for varied tasks.
- **Command-Based Functionality**: Use commands (e.g., `/`) for specialized tasks, deep research, and custom outputs like PDFs, quizzes, and more.
- **Streamlined Experience**: Operates complex processes autonomously, making productivity seamless.

### Project Goals

To create an advanced, open-source LLM architecture that accelerates AI research, enhances productivity, and adapts to user needs transparently.

## Getting Started

### Prerequisites

To set up and run **Opus0**, make sure you have the following:

- **Python 3.10+**: Required for the AI backend.
- **Poetry**: Dependency management tool for Python. [Install Poetry](https://python-poetry.org/docs/#installation).
- **Node.js and npm**: Required for the frontend (React with Vite). You can download it [here](https://nodejs.org/).
- **MongoDB**: MongoDB is used for data storage. Make sure you have a MongoDB cluster and note the credentials.

### Installation Guide

#### Cloning the Repository

Start by cloning the **Opus0** repository to your local machine:

```bash
git clone <repository-url>
cd opus0
```

#### Setting Up Environment Variables

For **Opus0** to function correctly, the AI backend requires several API keys and configurations. You’ll need to create a `.env` file in the root of the `ai-backend` directory and add the following variables:

```env
# Example format for the .env file
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
GOOGLE_API_KEY=your_google_api_key_here

# Services (code interpreter and internet search)
E2B_API_KEY=your_e2b_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here

# Scraper and Retriever Configurations
SCRAPER=bs                           # Set to "browser" if using Selenium-based dynamic scraping
RETRIEVER=tavily                      # Or another search engine like bing, google, etc.

# Frontend and Backend Configurations
FRONTEND_URL=http://localhost:5173
PORT=8000
DEBUG=True
MONGODB_USERNAME=your_mongodb_username
MONGODB_PASSWORD=your_mongodb_password
MONGODB_HOST=your_mongodb_cluster_url
MONGODB_DATABASE=opus0
```

Replace each placeholder (your_openai_api_key_here, etc.) with your actual API keys and MongoDB credentials.

### Installing Dependencies

Once the environment variables are set, proceed with installing dependencies for both the AI backend and frontend.

### Running the Application

1. **AI Backend**  
   The AI backend is written in Python and requires Python 3.10+ and Poetry for dependency management.

   - Navigate to the `ai-backend` directory:

     ```bash
     cd ai-backend
     ```

   - Install dependencies using Poetry:

     ```bash
     poetry install
     ```

   - Run the AI backend:

     ```bash
     poetry run python run.py
     ```

   This will start the AI backend, which listens for requests on the port specified in your `.env` file.

2. **Frontend**  
   The frontend is built with React and Vite. Before setting up, ensure Node.js and npm are installed.

   - Navigate to the frontend directory:

     ```bash
     cd ../web-client
     ```

   - Install frontend dependencies:

     ```bash
     npm install
     ```

   - Run the frontend:
     ```bash
     npm run dev
     ```

This command starts the frontend development server, typically available at http://localhost:5173.

## Project Architecture

The **Opus0** project is organized into three main components:

- **AI Backend** (`ai-backend`): Manages the core AI functionalities, including agent handling, API routing, and language model services.
- **Web Client** (`web-client`): The frontend interface built with React and Vite, providing an interactive user experience for interacting with Opus0’s AI capabilities.
- **Backend** (`backend`): This Node.js backend, though currently inactive, will eventually handle user authentication, payments, and other auxiliary services.

The following tree represents the project’s folder structure:

```plaintext
├── ai-backend
│   ├── app
│   │   ├── agents
│   │   ├── api
│   │   ├── core
│   │   ├── data
│   │   ├── db.py
│   │   ├── main.py
│   │   └── services
│   ├── poetry.lock
│   ├── pyproject.toml
│   └── run.py
├── backend
│   ├── controllers
│   ├── index.js
│   ├── package.json
│   ├── package-lock.json
│   └── routes
├── web-client
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── contexts
│   │   ├── hooks
│   │   ├── pages
│   │   ├── services
│   │   └── utils
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```
