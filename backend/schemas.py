from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone:str | None = None
    password:str

class UserLogin(BaseModel):
    email : EmailStr
    password : str

class UserOut(BaseModel):
    id : str
    full_name : str
    email : EmailStr
    phone : str
    created_at :datetime

class Config:
    from_attributes = True #Lets this build automatically from a SQLAlchemy user object

class Token(BaseModel):
    access_token : str
    token_type:str = "bearer"



