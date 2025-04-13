from config.database import parking_collection, location_collection, user_collection
from models.ParkingModel import Parking, ParkingOut
from bson import ObjectId
from fastapi import HTTPException

async def getAllParking():
    parkings = await parking_collection.find().to_list(length=None)

    for parking in parkings:
        if "location_id" in parking and isinstance(parking["location_id"], ObjectId):
            parking["location_id"] = str(parking["location_id"])
        
        if "user_id" in parking and isinstance(parking["user_id"], ObjectId):
            parking["user_id"] = str(parking["user_id"])

        location = await location_collection.find_one({"_id": ObjectId(parking["location_id"])});
        user = await user_collection.find_one({"_id": ObjectId(parking["user_id"])});

        if location:
            location["_id"] = str(location["_id"])
            parking["location"] = location

        if user:
            user["_id"] = str(user["_id"])
            parking["user"] = user

    return [ParkingOut(**parking) for parking in parkings]

async def addParking(parking: Parking):
    parking.location_id = ObjectId(parking.location_id)
    parking.user_id = ObjectId(parking.user_id)
    result = await parking_collection.insert_one(parking.dict())
    return {"message": "Parking Created Successfully."}

async def deleteParking(parking_id: str):
    await parking_collection.delete_one({"_id": ObjectId(parking_id)})
    return {"message": "Parking Deleted Successfully."}

# async def getParkingById(parking_id: str):
#     result = await parking_collection.find_one({"_id": ObjectId(parking_id)})
#     return ParkingOut(**result)
async def getParkingById(parking_id: str):
    result = await parking_collection.find_one({"_id": ObjectId(parking_id)})
    if not result:
        raise HTTPException(status_code=404, detail="Parking not found")
    
    result["_id"] = str(result["_id"])
    result["location_id"] = str(result["location_id"])
    result["user_id"] = str(result["user_id"])

    return ParkingOut(**result)

async def getParkingByUserId(user_id: str):
    parkings = await parking_collection.find({"user_id": ObjectId(user_id)}).to_list(length=None)

    for parking in parkings:
        parking["user_id"] = str(parking["user_id"])
        parking["location_id"] = str(parking["location_id"])

        location = await location_collection.find_one({"_id": ObjectId(parking["location_id"])});
        user = await user_collection.find_one({"_id": ObjectId(parking["user_id"])});

        if location:
            location["_id"] = str(location["_id"])
            parking["location"] = location

        if user:
            user["_id"] = str(user["_id"])
            parking["user"] = user

    return [ParkingOut(**parking) for parking in parkings]

async def getParkingByLocationId(location_id: str):
    parkings = await parking_collection.find({
        "location_id": ObjectId(location_id),
        "active": True  # Only return active parking records
    }).to_list(length=None)

    for parking in parkings:
        parking["user_id"] = str(parking["user_id"])
        parking["location_id"] = str(parking["location_id"])

        location = await location_collection.find_one({"_id": ObjectId(parking["location_id"])})

        if location:
            location["_id"] = str(location["_id"])
            parking["location"] = location

    return [ParkingOut(**parking) for parking in parkings]
