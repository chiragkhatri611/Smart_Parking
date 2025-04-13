from config.database import reservation_collection, user_collection, parking_collection, parking_slot_collection, vehicle_collection
from models.ReservationModel import Reservation, ReservationOut
from bson import ObjectId
from fastapi import HTTPException

async def getAllReservations():
    reservations = await reservation_collection.find().to_list(length=None)

    for res in reservations:
        if "user_id" in res and isinstance(res["user_id"], ObjectId):
            res["user_id"] = str(res["user_id"])

        if "parking_id" in res and isinstance(res["parking_id"], ObjectId):
            res["parking_id"] = str(res["parking_id"])

        if "parkingSlot_id" in res and isinstance(res["parkingSlot_id"], ObjectId):
            res["parkingSlot_id"] = str(res["parkingSlot_id"])

        if "vehicle_id" in res and isinstance(res["vehicle_id"], ObjectId):
            res["vehicle_id"] = str(res["vehicle_id"])

        user = await user_collection.find_one({"_id": ObjectId(res["user_id"])})
        parking = await parking_collection.find_one({"_id": ObjectId(res["parking_id"])})
        parking_slot = await parking_slot_collection.find_one({"_id": ObjectId(res["parkingSlot_id"])})
        vehicle = await vehicle_collection.find_one({"_id": ObjectId(res["vehicle_id"])})

        if user:
            user["_id"] = str(user["_id"])
            res["user"] = user

        if parking:
            parking["_id"] = str(parking["_id"])
            res["parking"] = parking

        if parking_slot:
            parking_slot["_id"] = str(parking_slot["_id"])
            res["parkingSlot"] = parking_slot

        if vehicle:
            vehicle["_id"] = str(vehicle["_id"])
            res["vehicle"] = vehicle

    return [ReservationOut(**res) for res in reservations]

async def addReservation(reservation: Reservation):
    reservation.user_id = ObjectId(reservation.user_id)
    reservation.parking_id = ObjectId(reservation.parking_id)
    reservation.parkingSlot_id = ObjectId(reservation.parkingSlot_id)
    reservation.vehicle_id = ObjectId(reservation.vehicle_id)
    result = await reservation_collection.insert_one(reservation.dict())
    return {"message": "Reservation Created Successfully."}

async def deleteReservation(reservation_id: str):
    await reservation_collection.delete_one({"_id": ObjectId(reservation_id)})
    return {"message": "Reservation Deleted Successfully."}

async def getReservationById(reservation_id: str):
    result = await reservation_collection.find_one({"_id": ObjectId(reservation_id)})
    return ReservationOut(**result)
