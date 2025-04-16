from pydantic import BaseModel, Field, validator
from bson import ObjectId

class ParkingSlot(BaseModel):
    parking_id: str
    slotNumber: int
    slotName: str
    parkingTag: str
    Used: bool
    # minimumParkingMinutes: int
    # suvSupported: bool

class ParkingSlotOut(ParkingSlot):
    id: str = Field(alias="_id")

    @validator("id", pre=True, always=True)
    def convert_objectId(cls, v):
        if isinstance(v, ObjectId):
            return str(v)
        return v
