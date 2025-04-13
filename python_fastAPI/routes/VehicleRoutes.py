from fastapi import APIRouter
from models.VehicleModel import Vehicle, VehicleOut
from controllers.VehicleController import getAllVehicles, addVehicle, deleteVehicle, getVehicleById

router = APIRouter()

@router.get("/vehicles/")
async def get_vehicles():
    return await getAllVehicles()

@router.post("/vehicle/")
async def post_vehicle(vehicle: Vehicle):
    return await addVehicle(vehicle)

@router.delete("/vehicle/{vehicleId}")
async def delete_vehicle(vehicleId: str):
    return await deleteVehicle(vehicleId)

@router.get("/vehicle/{vehicleId}")
async def get_vehicle_byId(vehicleId: str):
    return await getVehicleById(vehicleId)
