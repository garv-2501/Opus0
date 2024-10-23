# app/db.py
import logging
from pymongo import MongoClient
from app.core.config import settings
import urllib.parse
from bson.objectid import ObjectId

# Configure logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)  # Set to INFO or DEBUG as needed
handler = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)

# Define the Admin User ID
ADMIN_USER_ID = ObjectId("66fc04934566f7bcddc13806")

# Define the Conversation ID (fixed for admin user)
ADMIN_CONVERSATION_ID = "admin_conversation"

def get_database():
    try:
        # Escape the password to handle special characters
        escaped_password = urllib.parse.quote_plus(settings.MONGODB_PASSWORD)
        
        # Construct the MongoDB URI
        mongo_uri = (
            f"mongodb+srv://{settings.MONGODB_USERNAME}:{escaped_password}@"
            f"{settings.MONGODB_HOST}/{settings.MONGODB_DATABASE}?retryWrites=true&w=majority&appName=Cluster0"
        )
        
        # Create a MongoClient
        client = MongoClient(mongo_uri)
        
        # Select the database
        db = client.get_database()
        
        # Test the connection
        client.admin.command('ping')
        logger.info("Successfully connected to MongoDB Atlas.")
        return db
    except Exception as e:
        logger.error(f"Error connecting to MongoDB Atlas: {e}")
        raise e

# Initialize the database connection
db = get_database()

# Define your collections
users_collection = db.users
chat_histories_collection = db.chat_histories

# Retrieve the Admin User Document
admin_user = users_collection.find_one({"_id": ADMIN_USER_ID})

if admin_user:
    logger.info(f"Admin user '{admin_user['email']}' is logged in.")
else:
    logger.error("Admin user not found in the 'users' collection.")
    raise Exception("Admin user does not exist.")
