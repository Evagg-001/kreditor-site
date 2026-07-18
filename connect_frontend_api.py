from pathlib import Path

FILES = [
    "index.html",
    "contacts.html",
    "faq.html"
]

SCRIPT = """

<script>

async function sendLead(data){

const response = await fetch(
"http://127.0.0.1:8000/api/leads",
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(data)
}
);

return await response.json();

}

</script>

"""


for file in FILES:

    path = Path(file)

    if path.exists():

        content = path.read_text(
            encoding="utf-8"
        )

        if "sendLead" not in content:

            path.write_text(
                content + SCRIPT,
                encoding="utf-8"
            )

            print("[CONNECTED]", file)

        else:

            print("[SKIP]", file)


print("FRONTEND API CONNECTED")
