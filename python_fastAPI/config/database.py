from motor.motor_asyncio import AsyncIOMotorClient

#db url
MONGO_URL = "mongodb://localhost:27017"
DATABASE_NAME ="25_internship_fast"

client = AsyncIOMotorClient(MONGO_URL)
db = client[DATABASE_NAME]
role_collection = db["roles"]
user_collection = db["users"]
location_collection = db["locations"]
vehicle_collection = db["vehicles"]
parking_collection = db["parkings"]
parking_slot_collection = db["parking_slots"]
reservation_collection = db["reservations"]

