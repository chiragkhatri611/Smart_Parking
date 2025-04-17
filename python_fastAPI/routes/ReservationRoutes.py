from fastapi import APIRouter
from models.ReservationModel import Reservation, ReservationOut
from controllers.ReservationController import getAllReservations, addReservation, deleteReservation, getReservationById, getReservationsByUser_id, getReservationsByParking_id, createReservationWithLogic, updatePaymentStatus

router = APIRouter()

@router.get("/reservations/")
async def get_reservations():
    return await getAllReservations()

@router.post("/reservation/")
async def post_reservation(reservation: Reservation):
    return await addReservation(reservation)

@router.delete("/reservation/{reservation_id}")
async def delete_reservation(reservation_id: str):
    return await deleteReservation(reservation_id)

@router.get("/reservation/{reservation_id}")
async def get_reservation_byId(reservation_id: str):
    return await getReservationById(reservation_id)

@router.post("/reservation/auto/")
async def create_reservation_auto(reservation: dict):
    from controllers.ReservationController import createReservationWithLogic
    return await createReservationWithLogic(reservation)

# ✅ Get reservations by user ID
@router.get("/reservations/user/{user_id}")
async def get_reservations_by_user(user_id: str):
    return await getReservationsByUser_id(user_id)

# ✅ Get reservations by parking ID
@router.get("/reservations/parking/{parking_id}")
async def get_reservations_by_parking(parking_id: str):
    return await getReservationsByParking_id(parking_id)

# ✅ Update payment status by reservation ID
@router.put("/reservation/payment/confirm/{reservation_id}")
async def confirm_payment_status(reservation_id: str):
    return await updatePaymentStatus(reservation_id)