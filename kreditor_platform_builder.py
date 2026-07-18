from pathlib import Path
import json
from datetime import datetime


ROOT = Path(".")


def write_file(path, content):

    file = ROOT / path

    file.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    file.write_text(
        content,
        encoding="utf-8"
    )

    print("[CREATE]", path)



# ==========================
# API структура
# ==========================


write_file(
"api/leads.json",
"[]"
)



write_file(
"api/README.md",
"""
# KREDITOR API

Модуль обработки обращений.

Будущая структура:

lead
 |
client
 |
case
 |
document
"""
)



# ==========================
# CRM структура
# ==========================


crm = {

    "clients": [],
    "cases": [],
    "documents": [],
    "tasks": []

}


write_file(
"crm/database.json",
json.dumps(
    crm,
    ensure_ascii=False,
    indent=4
)
)



# ==========================
# Логи
# ==========================


write_file(
"logs/system.log",
f"""
KREDITOR PLATFORM INIT

{datetime.now()}

"""
)



# ==========================
# Отчет
# ==========================


report = {

    "module":
    "KREDITOR PLATFORM CORE",

    "created":

    [
        "api",
        "crm",
        "logs"
    ],

    "status":
    "initialized"

}



write_file(
"kreditor_platform_status.json",
json.dumps(
report,
ensure_ascii=False,
indent=4
)
)



print(
"""
============================
KREDITOR PLATFORM BUILDER
============================

Создано:

API
CRM
LOG SYSTEM

Статус:
READY

============================
"""
)
