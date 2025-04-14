from fastapi import APIRouter
from controllers.UserController import addUser,getAllUsers,loginUser,forgotPassword,resetPassword, getUserById, updateUser,changePassword
from models.UserModel import User,UserOut,UserLogin,ResetPasswordReq,UserUpdate,ChangePasswordReq
 

router = APIRouter()

@router.post("/user/")
async def post_user(user:User):
    return await addUser(user)

@router.get("/users/")
async def get_users():
    return await getAllUsers()

# In UserRoutes.py
@router.get("/user/{userId}", response_model=UserOut)
async def get_user_by_id(userId: str):
    return await getUserById(userId)

@router.put("/user/{userId}", response_model=UserOut)  # New update route
async def update_user(userId: str, update_data: UserUpdate):
    return await updateUser(userId, update_data)

# @router.delete("/user/{userId}")
# async def delete_user(userId:str):
#     return await deleteUser(userId)

@router.post("/user/login/")
async def login_user(user:UserLogin):
    return await loginUser(user)
 
@router.post("/forgotpassword")
async def forgot_password(email:str):
    return await forgotPassword(email)
 
@router.post("/resetpassword")
async def reset_password(data:ResetPasswordReq):
    return await resetPassword(data)

@router.post("/changepassword")
async def change_password(data: ChangePasswordReq):
    return await changePassword(data)