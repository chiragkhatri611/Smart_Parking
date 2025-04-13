from pydantic import BaseModel, Field, validator
from bson import ObjectId

class Vehicle(BaseModel):
    user_id: str
    registrationNum: str
    vehicleType: str

class VehicleOut(Vehicle):
    id: str = Field(alias="_id")

    @validator("id", pre=True, always=True)
    def convert_objectId(cls, v):
        if isinstance(v, ObjectId):
            return str(v)
        return v
