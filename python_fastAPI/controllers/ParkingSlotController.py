from config.database import parking_slot_collection, parking_collection
from models.ParkingSlotModel import ParkingSlot, ParkingSlotOut
from bson import ObjectId
from fastapi import HTTPException

async def getAllParkingSlots():
    slots = await parking_slot_collection.find().to_list(length=None)

    for slot in slots:
        if "parking_id" in slot and isinstance(slot["parking_id"], ObjectId):
            slot["parking_id"] = str(slot["parking_id"])

        parking = await parking_collection.find_one({"_id": ObjectId(slot["parking_id"])})
        
        if parking:
            parking["_id"] = str(parking["_id"])
            slot["parking"] = parking

    return [ParkingSlotOut(**slot) for slot in slots]

async def addParkingSlot(slot: ParkingSlot):
    slot.parking_id = ObjectId(slot.parking_id)
    result = await parking_slot_collection.insert_one(slot.dict())
    return {"message": "Parking Slot Created Successfully."}

async def deleteParkingSlot(parkingSlot_id: str):
    await parking_slot_collection.delete_one({"_id": ObjectId(parkingSlot_id)})
    return {"message": "Parking Slot Deleted Successfully."}

async def getParkingSlotById(parkingSlot_id: str):
    result = await parking_slot_collection.find_one({"_id": ObjectId(parkingSlot_id)})
    return ParkingSlotOut(**result)
