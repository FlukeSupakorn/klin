"""FastAPI exception handlers."""
from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handler for Pydantic's validation errors."""
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()},
    )


async def generic_exception_handler(request: Request, exc: Exception):
    """Handler for all other exceptions."""
    return JSONResponse(
        status_code=500,
        content={"detail": f"An unexpected error occurred: {exc}"},
    )
