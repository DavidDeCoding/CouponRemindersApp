from pydantic import BaseModel


class ImageToTextRequest(BaseModel):
    imageBytes: str
