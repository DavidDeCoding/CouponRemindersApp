from pydantic import BaseModel


class ImageToTextResponse(BaseModel):
    text: str
