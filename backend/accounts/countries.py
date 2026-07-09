"""
Global country → national-ID (NIC) format registry.

Each entry: code (ISO 3166-1 alpha-2), name, id_label (what the ID is called),
regex (format pattern — kept simple so the SAME pattern works in Python `re`
and JavaScript RegExp), placeholder and example.

The matching frontend copy lives at
job-portal/frontend/src/constants/countries.js — keep the two in sync.
"""
import re

COUNTRIES = [
    {"code": "PK", "name": "Pakistan",        "id_label": "CNIC",            "regex": r"^\d{5}-\d{7}-\d$",                                             "placeholder": "12345-1234567-1"},
    {"code": "IN", "name": "India",           "id_label": "Aadhaar",         "regex": r"^\d{4}\s?\d{4}\s?\d{4}$",                                      "placeholder": "1234 5678 9012"},
    {"code": "US", "name": "United States",   "id_label": "SSN",             "regex": r"^\d{3}-\d{2}-\d{4}$",                                          "placeholder": "123-45-6789"},
    {"code": "GB", "name": "United Kingdom",  "id_label": "NINO",            "regex": r"^[A-Za-z]{2}\d{6}[A-Za-z]$",                                   "placeholder": "AB123456C"},
    {"code": "CA", "name": "Canada",          "id_label": "SIN",             "regex": r"^\d{3}-?\d{3}-?\d{3}$",                                        "placeholder": "123-456-789"},
    {"code": "AU", "name": "Australia",       "id_label": "TFN",             "regex": r"^\d{9}$",                                                      "placeholder": "123456789"},
    {"code": "BD", "name": "Bangladesh",      "id_label": "NID",             "regex": r"^(\d{10}|\d{13}|\d{17})$",                                     "placeholder": "1234567890"},
    {"code": "LK", "name": "Sri Lanka",       "id_label": "NIC",             "regex": r"^(\d{9}[VvXx]|\d{12})$",                                       "placeholder": "123456789V"},
    {"code": "NP", "name": "Nepal",           "id_label": "National ID",     "regex": r"^\d{6,12}$",                                                   "placeholder": "123456789"},
    {"code": "AE", "name": "United Arab Emirates", "id_label": "Emirates ID","regex": r"^784-?\d{4}-?\d{7}-?\d$",                                      "placeholder": "784-1234-1234567-1"},
    {"code": "SA", "name": "Saudi Arabia",    "id_label": "National ID",     "regex": r"^[12]\d{9}$",                                                  "placeholder": "1234567890"},
    {"code": "TR", "name": "Turkey",          "id_label": "T.C. Kimlik No",  "regex": r"^\d{11}$",                                                     "placeholder": "12345678901"},
    {"code": "EG", "name": "Egypt",           "id_label": "National ID",     "regex": r"^\d{14}$",                                                     "placeholder": "12345678901234"},
    {"code": "NG", "name": "Nigeria",         "id_label": "NIN",             "regex": r"^\d{11}$",                                                     "placeholder": "12345678901"},
    {"code": "GH", "name": "Ghana",           "id_label": "Ghana Card",      "regex": r"^GHA-?\d{9}-?\d$",                                             "placeholder": "GHA-123456789-0"},
    {"code": "KE", "name": "Kenya",           "id_label": "National ID",     "regex": r"^\d{7,8}$",                                                    "placeholder": "12345678"},
    {"code": "ZA", "name": "South Africa",    "id_label": "ID Number",       "regex": r"^\d{13}$",                                                     "placeholder": "1234567890123"},
    {"code": "DE", "name": "Germany",         "id_label": "Tax ID",          "regex": r"^\d{11}$",                                                     "placeholder": "12345678901"},
    {"code": "FR", "name": "France",          "id_label": "INSEE",           "regex": r"^[12]\d{14}$",                                                 "placeholder": "189127612345678"},
    {"code": "ES", "name": "Spain",           "id_label": "DNI",             "regex": r"^\d{8}[A-Za-z]$",                                              "placeholder": "12345678Z"},
    {"code": "IT", "name": "Italy",           "id_label": "Codice Fiscale",  "regex": r"^[A-Za-z]{6}\d{2}[A-Za-z]\d{2}[A-Za-z]\d{3}[A-Za-z]$",         "placeholder": "RSSMRA85M01H501Z"},
    {"code": "PL", "name": "Poland",          "id_label": "PESEL",           "regex": r"^\d{11}$",                                                     "placeholder": "44051401359"},
    {"code": "RU", "name": "Russia",          "id_label": "Passport",        "regex": r"^\d{4}\s?\d{6}$",                                              "placeholder": "1234 567890"},
    {"code": "BR", "name": "Brazil",          "id_label": "CPF",             "regex": r"^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$",                               "placeholder": "123.456.789-00"},
    {"code": "MX", "name": "Mexico",          "id_label": "CURP",            "regex": r"^[A-Za-z]{4}\d{6}[A-Za-z]{6}[0-9A-Za-z]\d$",                   "placeholder": "GOMC850101HDFLLR09"},
    {"code": "CN", "name": "China",           "id_label": "Resident ID",     "regex": r"^\d{17}[\dXx]$",                                               "placeholder": "11010519491231002X"},
    {"code": "JP", "name": "Japan",           "id_label": "My Number",       "regex": r"^\d{12}$",                                                     "placeholder": "123456789012"},
    {"code": "KR", "name": "South Korea",     "id_label": "RRN",             "regex": r"^\d{6}-?\d{7}$",                                               "placeholder": "900101-1234567"},
    {"code": "ID", "name": "Indonesia",       "id_label": "KTP (NIK)",       "regex": r"^\d{16}$",                                                     "placeholder": "1234567890123456"},
    {"code": "MY", "name": "Malaysia",        "id_label": "MyKad",           "regex": r"^\d{6}-?\d{2}-?\d{4}$",                                        "placeholder": "123456-78-9012"},
    {"code": "PH", "name": "Philippines",     "id_label": "PhilSys (PSN)",   "regex": r"^\d{4}-?\d{4}-?\d{4}$",                                        "placeholder": "1234-5678-9012"},
    {"code": "SG", "name": "Singapore",       "id_label": "NRIC",            "regex": r"^[STFGstfg]\d{7}[A-Za-z]$",                                    "placeholder": "S1234567D"},
    {"code": "OTHER", "name": "Other / International", "id_label": "National ID", "regex": r"^[A-Za-z0-9\- ]{4,20}$",                                  "placeholder": "Enter your national ID"},
]

_BY_CODE = {c["code"]: c for c in COUNTRIES}


def get_country(code):
    if not code:
        return None
    return _BY_CODE.get(code.upper())


def validate_national_id(country_code, value):
    """
    Returns (is_valid: bool, error_message: str|None).
    Unknown country codes are accepted (fall back to a permissive check) so the
    feature never blocks a legitimate user from a country not yet in the registry.
    """
    value = (value or "").strip()
    if not value:
        return False, "National ID is required."

    country = get_country(country_code)
    if not country:
        # unknown / unset country → accept any reasonable id
        if re.match(r"^[A-Za-z0-9\- ]{4,20}$", value):
            return True, None
        return False, "Enter a valid national ID."

    if re.match(country["regex"], value):
        return True, None
    return False, f'Invalid {country["id_label"]} format for {country["name"]}. Example: {country["placeholder"]}'
