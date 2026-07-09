// Global country → national-ID (NIC) format registry.
// Mirror of backend/accounts/countries.py — keep the two in sync.
// `regex` strings are compiled with `new RegExp(...)`.

export const COUNTRIES = [
    { code: 'PK', name: 'Pakistan',             idLabel: 'CNIC',           regex: '^\\d{5}-\\d{7}-\\d$',                                         placeholder: '12345-1234567-1' },
    { code: 'IN', name: 'India',                idLabel: 'Aadhaar',        regex: '^\\d{4}\\s?\\d{4}\\s?\\d{4}$',                                placeholder: '1234 5678 9012' },
    { code: 'US', name: 'United States',        idLabel: 'SSN',            regex: '^\\d{3}-\\d{2}-\\d{4}$',                                      placeholder: '123-45-6789' },
    { code: 'GB', name: 'United Kingdom',       idLabel: 'NINO',           regex: '^[A-Za-z]{2}\\d{6}[A-Za-z]$',                                 placeholder: 'AB123456C' },
    { code: 'CA', name: 'Canada',               idLabel: 'SIN',            regex: '^\\d{3}-?\\d{3}-?\\d{3}$',                                    placeholder: '123-456-789' },
    { code: 'AU', name: 'Australia',            idLabel: 'TFN',            regex: '^\\d{9}$',                                                    placeholder: '123456789' },
    { code: 'BD', name: 'Bangladesh',           idLabel: 'NID',            regex: '^(\\d{10}|\\d{13}|\\d{17})$',                                 placeholder: '1234567890' },
    { code: 'LK', name: 'Sri Lanka',            idLabel: 'NIC',            regex: '^(\\d{9}[VvXx]|\\d{12})$',                                    placeholder: '123456789V' },
    { code: 'NP', name: 'Nepal',                idLabel: 'National ID',    regex: '^\\d{6,12}$',                                                 placeholder: '123456789' },
    { code: 'AE', name: 'United Arab Emirates', idLabel: 'Emirates ID',    regex: '^784-?\\d{4}-?\\d{7}-?\\d$',                                  placeholder: '784-1234-1234567-1' },
    { code: 'SA', name: 'Saudi Arabia',         idLabel: 'National ID',    regex: '^[12]\\d{9}$',                                                placeholder: '1234567890' },
    { code: 'TR', name: 'Turkey',               idLabel: 'T.C. Kimlik No', regex: '^\\d{11}$',                                                   placeholder: '12345678901' },
    { code: 'EG', name: 'Egypt',                idLabel: 'National ID',    regex: '^\\d{14}$',                                                   placeholder: '12345678901234' },
    { code: 'NG', name: 'Nigeria',              idLabel: 'NIN',            regex: '^\\d{11}$',                                                   placeholder: '12345678901' },
    { code: 'GH', name: 'Ghana',                idLabel: 'Ghana Card',     regex: '^GHA-?\\d{9}-?\\d$',                                          placeholder: 'GHA-123456789-0' },
    { code: 'KE', name: 'Kenya',                idLabel: 'National ID',    regex: '^\\d{7,8}$',                                                  placeholder: '12345678' },
    { code: 'ZA', name: 'South Africa',         idLabel: 'ID Number',      regex: '^\\d{13}$',                                                   placeholder: '1234567890123' },
    { code: 'DE', name: 'Germany',              idLabel: 'Tax ID',         regex: '^\\d{11}$',                                                   placeholder: '12345678901' },
    { code: 'FR', name: 'France',               idLabel: 'INSEE',          regex: '^[12]\\d{14}$',                                               placeholder: '189127612345678' },
    { code: 'ES', name: 'Spain',                idLabel: 'DNI',            regex: '^\\d{8}[A-Za-z]$',                                            placeholder: '12345678Z' },
    { code: 'IT', name: 'Italy',                idLabel: 'Codice Fiscale', regex: '^[A-Za-z]{6}\\d{2}[A-Za-z]\\d{2}[A-Za-z]\\d{3}[A-Za-z]$',     placeholder: 'RSSMRA85M01H501Z' },
    { code: 'PL', name: 'Poland',               idLabel: 'PESEL',          regex: '^\\d{11}$',                                                   placeholder: '44051401359' },
    { code: 'RU', name: 'Russia',               idLabel: 'Passport',       regex: '^\\d{4}\\s?\\d{6}$',                                          placeholder: '1234 567890' },
    { code: 'BR', name: 'Brazil',               idLabel: 'CPF',            regex: '^\\d{3}\\.?\\d{3}\\.?\\d{3}-?\\d{2}$',                        placeholder: '123.456.789-00' },
    { code: 'MX', name: 'Mexico',               idLabel: 'CURP',           regex: '^[A-Za-z]{4}\\d{6}[A-Za-z]{6}[0-9A-Za-z]\\d$',                placeholder: 'GOMC850101HDFLLR09' },
    { code: 'CN', name: 'China',                idLabel: 'Resident ID',    regex: '^\\d{17}[\\dXx]$',                                            placeholder: '11010519491231002X' },
    { code: 'JP', name: 'Japan',                idLabel: 'My Number',      regex: '^\\d{12}$',                                                   placeholder: '123456789012' },
    { code: 'KR', name: 'South Korea',          idLabel: 'RRN',            regex: '^\\d{6}-?\\d{7}$',                                            placeholder: '900101-1234567' },
    { code: 'ID', name: 'Indonesia',            idLabel: 'KTP (NIK)',      regex: '^\\d{16}$',                                                   placeholder: '1234567890123456' },
    { code: 'MY', name: 'Malaysia',             idLabel: 'MyKad',          regex: '^\\d{6}-?\\d{2}-?\\d{4}$',                                    placeholder: '123456-78-9012' },
    { code: 'PH', name: 'Philippines',          idLabel: 'PhilSys (PSN)',  regex: '^\\d{4}-?\\d{4}-?\\d{4}$',                                    placeholder: '1234-5678-9012' },
    { code: 'SG', name: 'Singapore',            idLabel: 'NRIC',           regex: '^[STFGstfg]\\d{7}[A-Za-z]$',                                  placeholder: 'S1234567D' },
    { code: 'OTHER', name: 'Other / International', idLabel: 'National ID', regex: '^[A-Za-z0-9\\- ]{4,20}$',                                    placeholder: 'Enter your national ID' },
].sort((a, b) => (a.code === 'OTHER' ? 1 : b.code === 'OTHER' ? -1 : a.name.localeCompare(b.name)));

const BY_CODE = COUNTRIES.reduce((m, c) => { m[c.code] = c; return m; }, {});

export const getCountry = (code) => (code ? BY_CODE[String(code).toUpperCase()] : null);

// The label to show for the ID field given a selected country code.
export const idLabelFor = (code) => {
    const c = getCountry(code);
    return c ? c.idLabel : 'National ID';
};

export const placeholderFor = (code) => {
    const c = getCountry(code);
    return c ? c.placeholder : 'National ID';
};

// Returns { valid: bool, message: string|null }
export const validateNationalId = (code, value) => {
    const v = (value || '').trim();
    if (!v) return { valid: false, message: 'National ID is required.' };
    const c = getCountry(code);
    if (!c) {
        return /^[A-Za-z0-9\- ]{4,20}$/.test(v)
            ? { valid: true, message: null }
            : { valid: false, message: 'Enter a valid national ID.' };
    }
    try {
        return new RegExp(c.regex).test(v)
            ? { valid: true, message: null }
            : { valid: false, message: `Invalid ${c.idLabel} format for ${c.name}. Example: ${c.placeholder}` };
    } catch (e) {
        return { valid: true, message: null };
    }
};

export default COUNTRIES;
