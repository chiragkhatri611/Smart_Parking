from pydantic import BaseModel, Field, validator
from bson import ObjectId

class Location(BaseModel):
    locationName: str

class LocationOut(Location):
    id: str = Field(alias="_id")

    @validator("id", pre=True, always=True)
    def convert_objectId(cls, v):
        if isinstance(v, ObjectId):
            return str(v)
        return v
