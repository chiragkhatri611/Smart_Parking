from fastapi import APIRouter
from models.ParkingSlotModel import ParkingSlot, ParkingSlotOut
from controllers.ParkingSlotController import getAllParkingSlots, addParkingSlot, deleteParkingSlot, getParkingSlotById, generateParkingSlots, getParkingSlotsByParkingId

router = APIRouter()

@router.get("/parkingSlots/")
async def get_parkingSlots():
    return await getAllParkingSlots()

@router.post("/parkingSlot/")
async def post_parkingSlot(slot: ParkingSlot):
    return await addParkingSlot(slot)

@router.delete("/parkingSlot/{parkingSlot_id}")
async def delete_parkingSlot(parkingSlot_id: str):
    return await deleteParkingSlot(parkingSlot_id)

@router.get("/parkingSlot/{parkingSlot_id}")
async def get_parkingSlot_byId(parkingSlot_id: str):
    return await getParkingSlotById(parkingSlot_id)

@router.post("/parkingSlots/generate/{parking_id}")
async def generate_parkingSlots(parking_id: str):
    return await generateParkingSlots(parking_id)

@router.get("/parkingSlots/parking/{parking_id}")
async def get_parkingSlots_by_parking_id(parking_id: str):
    return await getParkingSlotsByParkingId(parking_id)
