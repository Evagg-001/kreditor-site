from pathlib import Path
import json
import uuid
import re
from datetime import datetime


BASE = Path(".")


LEADS_FILE = BASE / "api" / "leads.json"
CRM_FILE = BASE / "crm" / "database.json"
LOG_FILE = BASE / "logs" / "system.log"



def load_json(file, default):

    if not file.exists():
        return default

    with open(
        file,
        "r",
        encoding="utf-8"
    ) as f:
        return json.load(f)



def save_json(file, data):

    file.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    with open(
        file,
        "w",
        encoding="utf-8"
    ) as f:

        json.dump(
            data,
            f,
            ensure_ascii=False,
            indent=4
        )



def validate_phone(phone):

    pattern = r"^\+?[0-9\s\-\(\)]{10,20}$"

    return bool(
        re.match(pattern, phone)
    )



def validate_email(email):

    pattern = r"^[^@]+@[^@]+\.[^@]+$"

    return bool(
        re.match(pattern, email)
    )



def create_lead(
    name,
    phone,
    email,
    role,
    problem
):

    if not validate_phone(phone):

        raise ValueError(
            "Некорректный телефон"
        )


    if email and not validate_email(email):

        raise ValueError(
            "Некорректный email"
        )



    lead_id = str(uuid.uuid4())



    lead = {

        "id": lead_id,

        "created":
        str(datetime.now()),

        "name":
        name,

        "phone":
        phone,

        "email":
        email,

        "role":
        role,

        "problem":
        problem,

        "status":
        "NEW"

    }



    leads = load_json(
        LEADS_FILE,
        []
    )


    leads.append(
        lead
    )


    save_json(
        LEADS_FILE,
        leads
    )



    crm = load_json(
        CRM_FILE,
        {
            "clients": [],
            "cases": [],
            "documents": [],
            "tasks": []
        }
    )



    crm["clients"].append({

        "id": lead_id,

        "name":
        name,

        "phone":
        phone,

        "role":
        role

    })



    crm["cases"].append({

        "id":
        lead_id,

        "client_id":
        lead_id,

        "category":
        role,

        "status":
        "NEW",

        "description":
        problem

    })



    save_json(
        CRM_FILE,
        crm
    )



    with open(
        LOG_FILE,
        "a",
        encoding="utf-8"
    ) as log:

        log.write(

            f"{datetime.now()} NEW LEAD {lead_id}\n"

        )



    return lead



if __name__ == "__main__":


    test = create_lead(

        name="Тестовый клиент",

        phone="+79990000000",

        email="test@example.com",

        role="Бизнес",

        problem="Проверка CRM ядра"

    )


    print(
        """
============================
KREDITOR LEAD ENGINE
============================

Создана заявка:

"""
    )


    print(
        json.dumps(
            test,
            ensure_ascii=False,
            indent=4
        )
    )
