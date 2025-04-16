from pydantic import BaseModel, Field, validator
from bson import ObjectId
from datetime import datetime

class Reservation(BaseModel):
    user_id: str
    parking_id: str
    parkingSlot_id: str
    vehicle_id: str
    bookingDate: datetime
    startTime: int
    endTime: int
    paymentStatus: str
    amountPaid: int
    securityAmountPaid: int

class ReservationOut(Reservation):
    id: str = Field(alias="_id")

    @validator("id", pre=True, always=True)
    def convert_objectId(cls, v):
        if isinstance(v, ObjectId):
            return str(v)
        return v
