from fastapi import APIRouter
from models.ParkingModel import Parking, ParkingOut
from controllers.ParkingController import getAllParking, addParking, deleteParking, getParkingById, getParkingByUserId, getParkingByLocationId

router = APIRouter()

@router.get("/parkings/")
async def get_parkings():
    return await getAllParking()

@router.post("/parking/")
async def post_parking(parking: Parking):
    return await addParking(parking)

@router.delete("/parking/{parking_id}")
async def delete_parking(parking_id: str):
    return await deleteParking(parking_id)

@router.get("/parking/{parking_id}")
async def get_parking_byId(parking_id: str):
    return await getParkingById(parking_id)

@router.get("/parking/user/{user_id}")
async def get_parking_by_user(user_id: str):
    return await getParkingByUserId(user_id)

@router.get("/parking/location/{location_id}")
async def get_parking_by_location(location_id: str):
    return await getParkingByLocationId(location_id)
