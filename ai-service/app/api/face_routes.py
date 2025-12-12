"""
Face Recognition API Routes
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import base64

from app.services.face_service import FaceRecognitionService

router = APIRouter()
face_service = FaceRecognitionService()


# ============ Request/Response Models ============

class FaceEncodeRequest(BaseModel):
    """Request to encode a face from base64 image"""
    image_base64: str
    user_id: str


class FaceEncodeResponse(BaseModel):
    """Response with face encoding"""
    success: bool
    user_id: str
    encoding_id: Optional[str] = None
    face_count: int = 0
    message: str


class FaceMatchRequest(BaseModel):
    """Request to match a face against database"""
    image_base64: str


class FaceMatchResult(BaseModel):
    """Single match result"""
    user_id: str
    confidence: float
    display_name: Optional[str] = None


class FaceMatchResponse(BaseModel):
    """Response with matching results"""
    success: bool
    matches: List[FaceMatchResult]
    best_match: Optional[FaceMatchResult] = None
    message: str


class TrainRequest(BaseModel):
    """Request to train model with images"""
    user_id: str
    images_base64: List[str]


class TrainResponse(BaseModel):
    """Training response"""
    success: bool
    user_id: str
    images_processed: int
    message: str


# ============ API Endpoints ============

@router.post("/encode", response_model=FaceEncodeResponse)
async def encode_face(request: FaceEncodeRequest):
    """
    Encode a face from base64 image and store encoding
    
    - **image_base64**: Base64 encoded image (JPEG/PNG)
    - **user_id**: Strapi user ID to associate with face
    """
    try:
        result = await face_service.encode_face(
            image_base64=request.image_base64,
            user_id=request.user_id,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/encode-file", response_model=FaceEncodeResponse)
async def encode_face_file(user_id: str, file: UploadFile = File(...)):
    """
    Encode a face from uploaded file
    
    - **user_id**: Strapi user ID to associate with face
    - **file**: Image file (JPEG/PNG)
    """
    try:
        contents = await file.read()
        image_base64 = base64.b64encode(contents).decode('utf-8')
        
        result = await face_service.encode_face(
            image_base64=image_base64,
            user_id=user_id,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/match", response_model=FaceMatchResponse)
async def match_face(request: FaceMatchRequest):
    """
    Match a face against all stored encodings
    
    - **image_base64**: Base64 encoded image to match
    
    Returns list of matching users sorted by confidence
    """
    try:
        result = await face_service.match_face(
            image_base64=request.image_base64,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/match-file", response_model=FaceMatchResponse)
async def match_face_file(file: UploadFile = File(...)):
    """
    Match an uploaded face image against database
    """
    try:
        contents = await file.read()
        image_base64 = base64.b64encode(contents).decode('utf-8')
        
        result = await face_service.match_face(
            image_base64=image_base64,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/train", response_model=TrainResponse)
async def train_user(request: TrainRequest):
    """
    Train face recognition model with multiple images for a user
    
    - **user_id**: User to train
    - **images_base64**: List of base64 encoded training images
    """
    try:
        result = await face_service.train_user(
            user_id=request.user_id,
            images_base64=request.images_base64,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/user/{user_id}")
async def delete_user_encodings(user_id: str):
    """
    Delete all face encodings for a user
    """
    try:
        result = await face_service.delete_user_encodings(user_id)
        return {"success": result, "message": f"Encodings deleted for user {user_id}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/users")
async def list_enrolled_users():
    """
    List all users with face encodings
    """
    try:
        users = await face_service.list_enrolled_users()
        return {"users": users, "count": len(users)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
