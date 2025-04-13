from fastapi import APIRouter
from models.LocationModel import Location, LocationOut
from controllers.LocationController import getAllLocations, addLocation, deleteLocation, getLocationById

router = APIRouter()

@router.get("/locations/")
async def get_locations():
    return await getAllLocations()

@router.post("/location/")
async def post_location(location: Location):
    return await addLocation(location)

@router.delete("/location/{location_id}")
async def delete_location(location_id: str):
    return await deleteLocation(location_id)

@router.get("/location/{location_id}")
async def get_location_byId(location_id: str):
    return await getLocationById(location_id)
