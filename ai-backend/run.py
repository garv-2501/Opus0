import uvicorn
from app.main import socket_app
from app.core.config import settings

if __name__ == "__main__":
    uvicorn.run(
        "app.main:socket_app",
        host="0.0.0.0",
        port=settings.PORT,
        reload=settings.DEBUG
    )