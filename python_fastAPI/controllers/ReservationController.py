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

    # reservation.user_id = ObjectId(reservation.user_id)
    # reservation.parking_id = ObjectId(reservation.parking_id)
    # reservation.parkingSlot_id = ObjectId(reservation.parkingSlot_id)
    # reservation.vehicle_id = ObjectId(reservation.vehicle_id)
    result = await reservation_collection.insert_one(reservation.dict())
    return {"message": "Reservation Created Successfully."}

async def deleteReservation(reservation_id: str):
    await reservation_collection.delete_one({"_id": ObjectId(reservation_id)})
    return {"message": "Reservation Deleted Successfully."}

async def getReservationById(reservation_id: str):
    result = await reservation_collection.find_one({"_id": ObjectId(reservation_id)})
    return ReservationOut(**result)

async def createReservationWithLogic(data: dict):
    from datetime import datetime
    from bson import ObjectId

    # 1. Extract data
    booking_date = datetime.strptime(data["bookingDate"], "%Y-%m-%d")
    parking_id = data["parking_id"]
    user_id = data["user_id"]
    vehicle_id = data["vehicle_id"]
    start_time = data["startTime"]
    end_time = data["endTime"]
    payment_status = data["paymentStatus"]

    # 2. Get vehicle details
    vehicle = await vehicle_collection.find_one({"_id": ObjectId(vehicle_id)})
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    vehicle_type = vehicle.get("vehicleType")
    if not vehicle_type:
        raise HTTPException(status_code=400, detail="Vehicle type missing")

    # 3. Get parking details
    parking = await parking_collection.find_one({"_id": ObjectId(parking_id)})
    if not parking:
        raise HTTPException(status_code=404, detail="Parking not found")

    # 4. Determine matching slot type
    slot_tag = "2Wheeler" if vehicle_type == "2Wheeler" else "4Wheeler"

    # 5. Find available slot
    available_slot = await parking_slot_collection.find_one({
        "parking_id": ObjectId(parking_id),
        "parkingTag": slot_tag,
        "used": False
    })

    if not available_slot:
        raise HTTPException(status_code=404, detail="No available slots for this vehicle type")

    # 6. Mark slot as used
    await parking_slot_collection.update_one(
        {"_id": available_slot["_id"]},
        {"$set": {"used": True}}
    )

    # 7. Calculate cost
    rate_key = "hourlyChargeTwoWheeler" if slot_tag == "2Wheeler" else "hourlyChargeFourWheeler"
    hourly_rate = parking.get(rate_key, 0)
    duration = end_time - start_time
    total_cost = hourly_rate * duration

    # 8. Create reservation object
    # reservation = Reservation(
    #     user_id=user_id,
    #     parking_id=parking_id,
    #     parkingSlot_id=str(available_slot["_id"]),
    #     vehicle_id=vehicle_id,
    #     bookingDate=booking_date,
    #     startTime=start_time,
    #     endTime=end_time,
    #     paymentStatus=payment_status,
    #     amountPaid=total_cost,
    #     securityAmountPaid=0  # Optional logic to add this
    # )

    # # Add reservation to DB
    # insert_result = await reservation_collection.insert_one(reservation.dict())
    reservation = Reservation(
        user_id=str(user_id),
        parking_id=str(parking_id),
        parkingSlot_id=str(available_slot["_id"]),
        vehicle_id=str(vehicle_id),
        bookingDate=booking_date,
        startTime=start_time,
        endTime=end_time,
        paymentStatus=payment_status,
        amountPaid=total_cost,
        securityAmountPaid=0  # Optional logic to add this
        # ...
    )

    # Convert string IDs to ObjectId before insert
    reservation.user_id = ObjectId(reservation.user_id)
    reservation.parking_id = ObjectId(reservation.parking_id)
    reservation.parkingSlot_id = ObjectId(reservation.parkingSlot_id)
    reservation.vehicle_id = ObjectId(reservation.vehicle_id)

    # Insert
    insert_result = await reservation_collection.insert_one(reservation.dict())

    # Return custom response
    return {
    "message": "Reservation Created Successfully.",
    "amountPaid": total_cost,
    "slotName": available_slot.get("slotName"),
    "reservation_id": str(insert_result.inserted_id)
}


async def getReservationsByUser_id(user_id: str):
    reservations = await reservation_collection.find({"user_id": ObjectId(user_id)}).to_list(length=None)
    for res in reservations:
        res["_id"] = str(res["_id"])
        res["user_id"] = str(res["user_id"])
        res["parking_id"] = str(res["parking_id"])
        res["parkingSlot_id"] = str(res["parkingSlot_id"])
        res["vehicle_id"] = str(res["vehicle_id"])
    return [ReservationOut(**res) for res in reservations]

async def getReservationsByParking_id(parking_id: str):
    reservations = await reservation_collection.find({"parking_id": ObjectId(parking_id)}).to_list(length=None)
    for res in reservations:
        res["_id"] = str(res["_id"])
        res["user_id"] = str(res["user_id"])
        res["parking_id"] = str(res["parking_id"])
        res["parkingSlot_id"] = str(res["parkingSlot_id"])
        res["vehicle_id"] = str(res["vehicle_id"])
    return [ReservationOut(**res) for res in reservations]



async def updatePaymentStatus(reservation_id: str):
    result = await reservation_collection.update_one(
        {"_id": ObjectId(reservation_id)},
        {"$set": {"paymentStatus": "confirm"}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Reservation not found or already updated")
    return {"message": "Payment status updated to 'confirm'"}


# async def updatePaymentStatus(reservation_id: str, new_status: str):
#     result = await reservation_collection.update_one(
#         {"_id": ObjectId(reservation_id)},
#         {"$set": {"paymentStatus": new_status}}
#     )

#     if result.modified_count == 0:
#         raise HTTPException(status_code=404, detail="Reservation not found or status already up to date")

#     return {"message": "Payment status updated successfully"}


async def create_reservation(reservation_data: dict):
    reservation_data["user_id"] = ObjectId(reservation_data["user_id"])
    reservation_data["parking_id"] = ObjectId(reservation_data["parking_id"])
    reservation_data["parkingSlot_id"] = ObjectId(reservation_data["parkingSlot_id"])
    reservation_data["vehicle_id"] = ObjectId(reservation_data["vehicle_id"])
    
    new_reservation = await reservation_collection.insert_one(reservation_data)
    created_reservation = await reservation_collection.find_one({"_id": new_reservation.inserted_id})
    return created_reservation