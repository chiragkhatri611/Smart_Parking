from config.database import vehicle_collection, user_collection
from models.VehicleModel import Vehicle, VehicleOut
from bson import ObjectId
from fastapi import HTTPException

async def getAllVehicles():
    vehicles = await vehicle_collection.find().to_list(length=None)

    for vehicle in vehicles:
        if "user_id" in vehicle and isinstance(vehicle["user_id"], ObjectId):
            vehicle["user_id"] = str(vehicle["user_id"])

        user = await user_collection.find_one({"_id": ObjectId(vehicle["user_id"])})
        if user:
            user["_id"] = str(user["_id"])
            vehicle["user"] = user

    return [VehicleOut(**vehicle) for vehicle in vehicles]

async def addVehicle(vehicle: Vehicle):
    vehicle.user_id = ObjectId(vehicle.user_id)
    result = await vehicle_collection.insert_one(vehicle.dict())
    return {"message": "Vehicle Created Successfully."}

async def deleteVehicle(vehicleId: str):
    await vehicle_collection.delete_one({"_id": ObjectId(vehicleId)})
    return {"message": "Vehicle Deleted Successfully."}

# async def getVehicleById(vehicleId: str):
#     result = await vehicle_collection.find_one({"_id": ObjectId(vehicleId)})
#     return VehicleOut(**result)

async def getVehicleById(vehicleId: str):
    try:
        result = await vehicle_collection.find_one({"_id": ObjectId(vehicleId)})
        if result:
            if "user_id" in result and isinstance(result["user_id"], ObjectId):
                result["user_id"] = str(result["user_id"])

            user = await user_collection.find_one({"_id": ObjectId(result["user_id"])})
            if user:
                user["_id"] = str(user["_id"])
                result["user"] = user

            return VehicleOut(**result)
        else:
            raise HTTPException(status_code=404, detail="Vehicle not found")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
async def getVehicleByUserId(userId: str):
    try:
        vehicles = await vehicle_collection.find({"user_id": ObjectId(userId)}).to_list(length=None)

        for vehicle in vehicles:
            vehicle["user_id"] = str(vehicle["user_id"])
            user = await user_collection.find_one({"_id": ObjectId(userId)})
            if user:
                user["_id"] = str(user["_id"])
                vehicle["user"] = user

        return [VehicleOut(**vehicle) for vehicle in vehicles]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))