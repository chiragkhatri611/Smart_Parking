from config.database import location_collection
from models.LocationModel import Location, LocationOut
from bson import ObjectId

async def getAllLocations():
    locations = await location_collection.find().to_list(length=None)
    return [LocationOut(**loc) for loc in locations]

async def addLocation(location: Location):
    result = await location_collection.insert_one(location.dict())
    return {"message": "Location Created Successfully."}

async def deleteLocation(location_id: str):
    await location_collection.delete_one({"_id": ObjectId(location_id)})
    return {"message": "Location Deleted Successfully."}

async def getLocationById(location_id: str):
    result = await location_collection.find_one({"_id": ObjectId(location_id)})
    return LocationOut(**result)
