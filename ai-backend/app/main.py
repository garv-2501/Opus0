# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import socketio
from app.api.routes import chat
from app.core.config import settings
from app.db import db  # Import to ensure the connection is established

import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(origin) for origin in settings.CORS_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')
socket_app = socketio.ASGIApp(sio, app)

# Log the database connection status
logger.info("Database connection is established.")

@sio.on('connect')
async def connect(sid, environ):
    logger.info(f"Client connected: {sid}")

@sio.on('disconnect')
async def disconnect(sid):
    logger.info(f"Client disconnected: {sid}")

@sio.on('chat_message')
async def handle_message(sid, message):
    logger.info(f"Received message from {sid}: {message}")
    
    # Emit '[START]' to indicate the beginning of the response
    await sio.emit('chat_response', '[START]', room=sid)

    # Process the message and emit the response chunks
    response_generator = chat.process_message(message)
    async for chunk in response_generator:
        await sio.emit('chat_response', chunk, room=sid)

    # Emit '[END]' to indicate the end of the response
    await sio.emit('chat_response', '[END]', room=sid)
