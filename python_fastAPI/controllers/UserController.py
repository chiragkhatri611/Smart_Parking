from models.UserModel import User,UserOut,UserLogin,ResetPasswordReq,UserUpdate,ChangePasswordReq
from bson import ObjectId
from config.database import user_collection,role_collection
from fastapi import HTTPException
from fastapi.responses import JSONResponse
import bcrypt
from utils.SendMail import send_mail
import datetime
from fastapi import Response
import jwt


async def addUser(user:User):
    #typeCast
    #print("user....",user.role_id)
    #convert string id to object it comp.,, to mongo db
    user.role_id = ObjectId(user.role_id)
    print("after type cast",user.role_id)
    result = await user_collection.insert_one(user.dict())
    send_mail(user.email,"User Created","User created successfully")
    #mail...
    #return {"Message":"user created successfully"}
    
    return JSONResponse(status_code=201,content={"message":"User created successfully"})
    #raise HTTPException(status_code=500,detail="User not created")

# async def getAllUsers():
#     users = await user_collection.find().to_list()
#     print("users",users)
#     return [UserOut(**user) for user in users]

async def getAllUsers():
    users = await user_collection.find().to_list(length=None)

    for user in users:
        # Convert role_id from ObjectId to str before validation
        if "role_id" in user and isinstance(user["role_id"], ObjectId):
            user["role_id"] = str(user["role_id"])
        
        # Fetch role details
        role = await role_collection.find_one({"_id": ObjectId(user["role_id"])})  
        
        if role:
            role["_id"] = str(role["_id"])  # Convert role _id to string
            user["role"] = role

    return [UserOut(**user) for user in users]

# async def deleteUser(UserId:str):
#     result = await user_collection.delete_one({"_id":ObjectId(UserId)})
#     print("after delete result",result)
#     return {"Message":"User Deleted Successfully!"}

async def getUserById(userId: str):
    try:
        # Convert string ID to ObjectId for MongoDB query
        user = await user_collection.find_one({"_id": ObjectId(userId)})
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Convert ObjectId fields to strings
        user["_id"] = str(user["_id"])
        user["role_id"] = str(user["role_id"])
        
        # Fetch role details
        role = await role_collection.find_one({"_id": ObjectId(user["role_id"])})
        if role:
            role["_id"] = str(role["_id"])
            user["role"] = role
            
        return UserOut(**user)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid user ID format")
    
async def updateUser(userId: str, update_data: UserUpdate):
    try:
        # Convert userId to ObjectId
        obj_id = ObjectId(userId)

        # Prepare update dictionary, excluding None values
        update_dict = {k: v for k, v in update_data.dict().items() if v is not None}

        # Check if email is being updated and already exists
        if "email" in update_dict:
            existing_user = await user_collection.find_one({"email": update_dict["email"]})
            if existing_user and str(existing_user["_id"]) != userId:
                raise HTTPException(status_code=400, detail="Email already in use")

        # Update user in MongoDB
        result = await user_collection.update_one(
            {"_id": obj_id},
            {"$set": update_dict}
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="User not found")

        # Fetch updated user for response
        updated_user = await user_collection.find_one({"_id": obj_id})
        updated_user["_id"] = str(updated_user["_id"])
        updated_user["role_id"] = str(updated_user["role_id"])

        # Fetch role details
        role = await role_collection.find_one({"_id": ObjectId(updated_user["role_id"])})
        if role:
            role["_id"] = str(role["_id"])
            updated_user["role"] = role

        return UserOut(**updated_user)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid user ID format")

async def loginUser(request:UserLogin):
#async def loginUser(email:str,password:str):
    #norma; password : plain text --> encr
    
    foundUser = await user_collection.find_one({"email":request.email})
    print(":foundUser",foundUser)
    
    foundUser["_id"] = str(foundUser["_id"])
    foundUser["role_id"] = str(foundUser["role_id"])
    
    if foundUser is None:
        raise HTTPException(status_code=404,detail="User not found")
    #compare password
    if "password" in foundUser and bcrypt.checkpw(request.password.encode(),foundUser["password"].encode()):
        #database role.. roleid
        role = await role_collection.find_one({"_id":ObjectId(foundUser["role_id"])})
        foundUser["role"] = role
        token = generate_token(foundUser["email"])
        return {"message": "user login success", "token": token, "user": UserOut(**foundUser)}

    raise HTTPException(status_code=404, detail="Invalid password")
    #     return {"message":"user login success","user":UserOut(**foundUser)}
    # else:
    #     raise HTTPException(status_code=404,detail="Invalid password")
    
SECRET_KEY ="royal"
def generate_token(email:str):
    expiration =datetime.datetime.utcnow()+datetime.timedelta(hours=1)
    payload = {"sub":email,"exp":expiration}
    token = jwt.encode(payload,SECRET_KEY,algorithm="HS256")
    return token
 
 
async def forgotPassword(email:str):
    foundUser = await user_collection.find_one({"email":email})
    if not foundUser:
        raise HTTPException(status_code=404,detail="email not found")
    
    token = generate_token(email)
    resetLink = f"http://localhost:5173/resetpassword/{token}"
    body = f"""
    <html>
        <h1>HELLO THIS IS RESET PASSWORD LINK EXPIRES IN 1 hour</h1>
        <a href= "{resetLink}">RESET PASSWORD</a>
    </html>
    """
    subject = "RESET PASSWORD"
    send_mail(email,subject,body)
    return {"message":"reset link sent successfully"}
    
 
async def resetPassword(data: ResetPasswordReq):
    try:
        payload =jwt.decode(data.token, SECRET_KEY, algorithms="HS256") #{"sub":"email...",exp:}
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=421, detail="Token is not valid...")
        # Hash the new password and decode the result to store it as a string
        hashed_password = bcrypt.hashpw(data.password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        await user_collection.update_one({"email": email}, {"$set": {"password": hashed_password}})
 
        return {"message": "Password updated successfully"}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=500, detail="JWT is expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=500, detail="JWT is invalid")    

# In UserController.py
# async def changePassword(data: ChangePasswordReq):
    try:
        # Decode the JWT token to get the email
        payload = jwt.decode(data.token, SECRET_KEY, algorithms="HS256")
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token")

        # Find the user by email
        user = await user_collection.find_one({"email": email})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Verify the old password
        if not bcrypt.checkpw(data.oldPassword.encode("utf-8"), user["password"].encode("utf-8")):
            raise HTTPException(status_code=401, detail="Incorrect old password")

        # Hash the new password
        hashed_password = bcrypt.hashpw(data.password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

        # Update the password in the database
        await user_collection.update_one({"email": email}, {"$set": {"password": hashed_password}})

        return {"message": "Password changed successfully"}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token is expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
# In UserController.py
async def changePassword(data: ChangePasswordReq):
    try:
        # Find the user by ID
        user = await user_collection.find_one({"_id": ObjectId(data.userId)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Verify the old password
        if not bcrypt.checkpw(data.oldPassword.encode("utf-8"), user["password"].encode("utf-8")):
            raise HTTPException(status_code=401, detail="Incorrect old password")

        # Hash the new password
        hashed_password = bcrypt.hashpw(data.password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

        # Update the password in the database
        await user_collection.update_one({"_id": ObjectId(data.userId)}, {"$set": {"password": hashed_password}})

        return {"message": "Password changed successfully"}
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid user ID format")