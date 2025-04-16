from config.database import parking_slot_collection, parking_collection
from models.ParkingSlotModel import ParkingSlot, ParkingSlotOut
from models.ParkingModel import Parking
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
    try:
        # Validate ObjectId format
        if not ObjectId.is_valid(parkingSlot_id):
            raise HTTPException(status_code=400, detail="Invalid parking slot ID format")
        
        # Find the parking slot
        result = await parking_slot_collection.find_one({"_id": ObjectId(parkingSlot_id)})
        
        # Check if slot exists
        if not result:
            raise HTTPException(status_code=404, detail="Parking slot not found")
        
        # Convert ObjectId fields to strings
        result["_id"] = str(result["_id"])
        if "parking_id" in result and isinstance(result["parking_id"], ObjectId):
            result["parking_id"] = str(result["parking_id"])
        
        return ParkingSlotOut(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

async def generateParkingSlots(parking_id: str):
    # Fetch parking details
    parking = await parking_collection.find_one({"_id": ObjectId(parking_id)})
    if not parking:
        raise HTTPException(status_code=404, detail="Parking not found")

    # Delete existing slots for this parking
    await parking_slot_collection.delete_many({"parking_id": ObjectId(parking_id)})

    # Initialize slot counter
    slots_to_insert = []
    
    # Generate TwoWheeler slots
    for i in range(1, parking["totalCapacityTwoWheeler"] + 1):
        slot = {
            "parking_id": ObjectId(parking_id),
            "slotNumber": i,
            "slotName": f"Slot{i}T",
            "parkingTag": "2Wheeler",
            "used": False
        }
        slots_to_insert.append(slot)

    # Generate FourWheeler slots
    for i in range(1, parking["totalCapacityFourWheeler"] + 1):
        slot = {
            "parking_id": ObjectId(parking_id),
            "slotNumber": i + parking["totalCapacityTwoWheeler"],
            "slotName": f"Slot{i}F",
            "parkingTag": "4Wheeler",
            "used": False
        }
        slots_to_insert.append(slot)

    # Insert all slots
    if slots_to_insert:
        await parking_slot_collection.insert_many(slots_to_insert)

    return {
        "message": f"Successfully generated {len(slots_to_insert)} parking slots",
        "parking_id": parking_id,
        "total_slots": len(slots_to_insert)
    }

async def getParkingSlotsByParkingId(parking_id: str):
    try:
        if not ObjectId.is_valid(parking_id):
            raise HTTPException(status_code=400, detail="Invalid parking ID format")

        slots = await parking_slot_collection.find({"parking_id": ObjectId(parking_id)}).to_list(length=None)

        for slot in slots:
            slot["_id"] = str(slot["_id"])
            slot["parking_id"] = str(slot["parking_id"])

        return [ParkingSlotOut(**slot) for slot in slots]
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")