from datetime import datetime, timedelta, timezone
from passlib.context import CryptContext
from jose import jwt, JWTError

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(plain_password:str)-> str:
    return pwd_context.hash(plain_password)

def verify_password(plain_password:str, hashed_password:str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

## JWT login tokens
SECRET_KEY = "dev-must-change-before-deployment"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 #Tokens only available for 24 hours

def create_access_token(data:dict)-> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc)+ timedelta(minutes = ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token:str)-> dict | None:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms =[ALGORITHM])
        return payload
    except JWTError:
        return None

