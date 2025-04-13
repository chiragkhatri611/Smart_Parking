from fastapi import FastAPI
from routes.RoleRoutes import router as role_router
from routes.UserRoutes import router as user_router
from routes.LocationRoutes import router as location_router
from routes.VehicleRoutes import router as vehicle_router
from routes.ParkingRoutes import router as parking_router
from routes.ParkingSlotRoutes import router as parking_slot_router
from routes.ReservationRoutes import router as reservation_router




#import cors middleware
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(role_router)
app.include_router(user_router)
app.include_router(location_router)
app.include_router(vehicle_router)
app.include_router(parking_router)
app.include_router(parking_slot_router)
app.include_router(reservation_router)


#routes