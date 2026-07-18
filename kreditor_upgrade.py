from pathlib import Path
import json
from datetime import datetime


PROJECT = Path(".")


result = {
    "project": "KREDITOR",
    "date": str(datetime.now()),
    "files": [],
    "html_pages": [],
    "warnings": []
}


# поиск файлов

for file in PROJECT.rglob("*"):

    if file.is_file():

        result["files"].append(
            str(file)
        )


# поиск страниц

for html in PROJECT.rglob("*.html"):

    result["html_pages"].append(
        str(html)
    )


# проверки


if not (PROJECT / "robots.txt").exists():

    result["warnings"].append(
        "Нет robots.txt"
    )


if not (PROJECT / "sitemap.xml").exists():

    result["warnings"].append(
        "Нет sitemap.xml"
    )


if not (PROJECT / "package.json").exists():

    result["warnings"].append(
        "Нет package.json"
    )



with open(
    "kreditor_audit.json",
    "w",
    encoding="utf-8"
) as f:

    json.dump(
        result,
        f,
        ensure_ascii=False,
        indent=4
    )


print(
"""
=========================
KREDITOR AUDIT COMPLETE
=========================

Создан файл:

kreditor_audit.json

"""
)


print(
"HTML страниц:",
len(result["html_pages"])
)


print(
"Проблем:",
len(result["warnings"])
)