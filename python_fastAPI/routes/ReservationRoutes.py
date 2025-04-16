from fastapi import APIRouter
from models.ReservationModel import Reservation, ReservationOut
from controllers.ReservationController import getAllReservations, addReservation, deleteReservation, getReservationById

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

