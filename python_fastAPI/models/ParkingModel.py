from pydantic import BaseModel, Field, validator
from bson import ObjectId

class Parking(BaseModel):
    title: str
    address: str
    location_id: str
    user_id: str
    otherInformation: str
    active: bool
    totalCapacityTwoWheeler: int
    totalCapacityFourWheeler: int
    hourlyChargeTwoWheeler: float
    hourlyChargeFourWheeler: float
    parkingType: str
    lat: str
    log: str

class ParkingOut(Parking):
    id: str = Field(alias="_id")

    @validator("id", pre=True, always=True)
    def convert_objectId(cls, v):
        if isinstance(v, ObjectId):
            return str(v)
        return v
