from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from lead_engine import create_lead


app = FastAPI(
    title="KREDITOR API",
    version="1.0"
)


class LeadRequest(BaseModel):

    name: str

    phone: str

    email: str = ""

    role: str

    problem: str



@app.get("/")
def home():

    return {

        "service":
        "KREDITOR API",

        "status":
        "working"

    }



@app.post("/api/leads")
def create_new_lead(
    lead: LeadRequest
):

    try:

        result = create_lead(

            name=lead.name,

            phone=lead.phone,

            email=lead.email,

            role=lead.role,

            problem=lead.problem

        )


        return {

            "success":
            True,

            "lead":
            result

        }


    except Exception as e:

        raise HTTPException(

            status_code=400,

            detail=str(e)

        )
