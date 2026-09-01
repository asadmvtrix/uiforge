from fastapi import APIRouter
from fastapi.responses import HTMLResponse, JSONResponse


router = APIRouter()


@router.get("/")
async def get_status():
    return HTMLResponse(
        content="<h3>UIForge backend is running. Open the frontend to generate code.</h3>"
    )


@router.get("/health")
async def get_health():
    return JSONResponse({"ok": True, "service": "uiforge-api"})
