import gspread
from google.oauth2.service_account import Credentials
from gspread.exceptions import WorksheetNotFound
from typing import Any
import logging

from gspread.utils import ValueInputOption

logging.basicConfig(level=logging.INFO)

SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive"
]


def get_spreadsheet(sheet_url: str) -> gspread.Spreadsheet:
    creds = Credentials.from_service_account_file("creds.json", scopes=SCOPES)
    client = gspread.authorize(creds)
    return client.open_by_url(sheet_url)


def get_or_create_worksheet(spreadsheet: gspread.Spreadsheet, title: str = "__raw") -> gspread.Worksheet:
    try:
        return spreadsheet.worksheet(title)
    except WorksheetNotFound:
        logging.warning(f"Worksheet '{title}' not found. Creating new one.")
        return spreadsheet.add_worksheet(title=title, rows=10000, cols=20)


def write_to_sheet(sheet_url: str, data: list[dict[str, Any]], worksheet_name: str = "__raw") -> None:
    if not data:
        logging.warning("Data is empty — nothing to write.")
        return

    logging.info("Opening spreadsheet...")
    spreadsheet = get_spreadsheet(sheet_url)

    logging.info(f"Getting worksheet '{worksheet_name}'...")
    worksheet = get_or_create_worksheet(spreadsheet, worksheet_name)

    logging.info("Clearing worksheet...")
    worksheet.clear()

    headers = list(data[0].keys())
    rows = [list(row.values()) for row in data]

    logging.info(f"Writing {len(rows)} rows to sheet...")
    worksheet.append_rows([headers] + rows, value_input_option=ValueInputOption.user_entered)

    logging.info("Data successfully written to Google Sheet.")
