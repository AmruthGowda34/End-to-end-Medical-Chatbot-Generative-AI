from fastapi import FastAPI, Request
from fastapi.responses import PlainTextResponse
from twilio.twiml.messaging_response import MessagingResponse

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello from Medibot"}

@app.post("/")
async def root_post():
    return {"message": "POST received at /"}

@app.post("/sms")
async def sms_reply(request: Request):
    form = await request.form()
    incoming_msg = form.get("Body", "")
    
    resp = MessagingResponse()
    resp.message(f"You said: {incoming_msg}")
    return PlainTextResponse(str(resp), media_type="application/xml")
