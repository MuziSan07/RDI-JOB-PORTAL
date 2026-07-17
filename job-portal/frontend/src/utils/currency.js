// ─────────────────────────────────────────────────────────────────────────────
// Currency support for a global portal. Amounts are stored with an ISO 4217
// code, never assumed to be USD. Formatting is delegated to Intl so each
// currency gets its own symbol, grouping, and decimal rules (JPY has no minor
// unit, KWD has three, and so on).
// ─────────────────────────────────────────────────────────────────────────────

// Shown at the top of pickers: RDI's operating regions first, then the majors.
const PRIORITY = ['USD', 'PKR', 'AFN', 'AED', 'EUR', 'GBP', 'SAR', 'INR'];

// Used only when the browser cannot enumerate currencies itself.
const FALLBACK_CODES = [
    'USD', 'EUR', 'GBP', 'PKR', 'AFN', 'AED', 'SAR', 'INR', 'CAD', 'AUD', 'NZD', 'CHF',
    'CNY', 'JPY', 'KRW', 'SGD', 'HKD', 'MYR', 'IDR', 'THB', 'PHP', 'VND', 'BDT', 'LKR',
    'NPR', 'IRR', 'IQD', 'QAR', 'KWD', 'BHD', 'OMR', 'JOD', 'LBP', 'EGP', 'TRY', 'ILS',
    'ZAR', 'NGN', 'KES', 'GHS', 'TZS', 'UGX', 'ETB', 'MAD', 'DZD', 'TND', 'BRL', 'MXN',
    'ARS', 'CLP', 'COP', 'PEN', 'RUB', 'UAH', 'PLN', 'CZK', 'HUF', 'RON', 'SEK', 'NOK',
    'DKK', 'ISK',
];

const PERIOD_LABEL = {
    HOUR: 'hour',
    DAY: 'day',
    WEEK: 'week',
    MONTH: 'month',
    YEAR: 'year',
};

const toNumber = (v) => {
    if (v === null || v === undefined || v === '') return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
};

// Every ISO 4217 code the runtime knows about, newest browsers included.
const allCodes = () => {
    try {
        const codes = Intl.supportedValuesOf('currency');
        if (Array.isArray(codes) && codes.length) return codes;
    } catch (_) { /* older browser: fall through */ }
    return FALLBACK_CODES;
};

/** The symbol for a currency ("$", "₨", "AED"), falling back to the code. */
export const currencySymbol = (code) => {
    if (!code) return '';
    try {
        const part = new Intl.NumberFormat(undefined, { style: 'currency', currency: code })
            .formatToParts(0)
            .find((p) => p.type === 'currency');
        return part ? part.value : code;
    } catch (_) {
        return code;
    }
};

const currencyName = (code) => {
    try {
        const name = new Intl.DisplayNames(undefined, { type: 'currency' }).of(code);
        return name && name !== code ? name : code;
    } catch (_) {
        return code;
    }
};

let cachedList = null;

/** Full currency list as [{ code, name, symbol }], priority codes first. */
export const getCurrencies = () => {
    if (cachedList) return cachedList;
    const codes = allCodes();
    const rank = (c) => {
        const i = PRIORITY.indexOf(c);
        return i === -1 ? PRIORITY.length : i;
    };
    cachedList = codes
        .map((code) => ({ code, name: currencyName(code), symbol: currencySymbol(code) }))
        .sort((a, b) => rank(a.code) - rank(b.code) || a.code.localeCompare(b.code));
    return cachedList;
};

/**
 * Format an amount in its own currency, e.g. 50000 + 'PKR' -> "PKR 50,000".
 * Cents are shown only when the amount actually has them.
 */
export const formatMoney = (amount, code = 'USD') => {
    const n = toNumber(amount);
    if (n === null) return '';
    const hasCents = !Number.isInteger(n);
    try {
        return new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: code || 'USD',
            minimumFractionDigits: hasCents ? 2 : 0,
            maximumFractionDigits: hasCents ? 2 : 0,
        }).format(n);
    } catch (_) {
        // Unknown/unsupported code: still show the amount with its code.
        return `${code || ''} ${n.toLocaleString()}`.trim();
    }
};

/** Plain grouped number, no currency, used for the upper half of a range. */
const formatPlain = (amount) => {
    const n = toNumber(amount);
    if (n === null) return '';
    const hasCents = !Number.isInteger(n);
    return n.toLocaleString(undefined, {
        minimumFractionDigits: hasCents ? 2 : 0,
        maximumFractionDigits: hasCents ? 2 : 0,
    });
};

/**
 * Format a salary range with its currency and pay period.
 * e.g. (50000, 80000, 'PKR', 'MONTH') -> "PKR 50,000 – 80,000 / month"
 */
export const formatSalaryRange = (min, max, code = 'USD', period) => {
    const lo = toNumber(min);
    const hi = toNumber(max);
    if (lo === null && hi === null) return '';

    let body;
    if (lo !== null && hi !== null && lo !== hi) {
        body = `${formatMoney(lo, code)} – ${formatPlain(hi)}`;
    } else {
        body = formatMoney(lo !== null ? lo : hi, code);
    }
    const per = PERIOD_LABEL[period];
    return per ? `${body} / ${per}` : body;
};

/**
 * Preferred salary text for a job: use the structured currency-aware fields when
 * present, otherwise fall back to the legacy free-text salary_range.
 */
export const formatJobSalary = (job) => {
    if (!job) return '';
    const structured = formatSalaryRange(job.salary_min, job.salary_max, job.salary_currency, job.salary_period);
    if (structured) return structured;
    return (job.salary_range || '').trim();
};
