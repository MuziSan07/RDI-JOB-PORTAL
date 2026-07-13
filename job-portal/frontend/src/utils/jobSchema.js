// Builds Google-standard JobPosting structured data (JSON-LD) from a job object.
// https://developers.google.com/search/docs/appearance/structured-data/job-posting

const CANONICAL_ORIGIN = 'https://hr.rdi.world';

const addDays = (iso, days) => {
    const d = iso ? new Date(iso) : new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString();
};

export function buildJobPostingSchema(job) {
    if (!job) return null;

    const url = `${CANONICAL_ORIGIN}/jobs/${job.slug || job.id}`;

    const schema = {
        '@context': 'https://schema.org/',
        '@type': 'JobPosting',
        title: job.title,
        description: job.description || job.required_skills || job.title,
        datePosted: job.created_at,
        validThrough: addDays(job.created_at, 30), // 30-day validity window
        employmentType: job.employment_type || 'FULL_TIME',
        identifier: {
            '@type': 'PropertyValue',
            name: 'RDI Job Portal',
            value: String(job.id),
        },
        hiringOrganization: {
            '@type': 'Organization',
            name: job.department_name || 'Rupani Development Initiatives',
            sameAs: CANONICAL_ORIGIN,
            logo: job.department_logo || `${CANONICAL_ORIGIN}/RDI.png`,
        },
        url,
        directApply: true,
    };

    // Salary → baseSalary (only when structured amounts are provided)
    const min = job.salary_min != null && job.salary_min !== '' ? Number(job.salary_min) : null;
    const max = job.salary_max != null && job.salary_max !== '' ? Number(job.salary_max) : null;
    if (min != null || max != null) {
        const value = { '@type': 'QuantitativeValue', unitText: job.salary_period || 'MONTH' };
        if (min != null && max != null && min !== max) { value.minValue = min; value.maxValue = max; }
        else { value.value = min != null ? min : max; }
        schema.baseSalary = {
            '@type': 'MonetaryAmount',
            currency: job.salary_currency || 'USD',
            value,
        };
    }

    // Location: remote → TELECOMMUTE (worldwide); on-site/hybrid → the job's place.
    const hasPlace = job.location_city || job.location_country;
    if (job.job_type === 'remote') {
        schema.jobLocationType = 'TELECOMMUTE';
        schema.applicantLocationRequirements = { '@type': 'AdministrativeArea', name: 'Worldwide' };
    } else if (hasPlace) {
        schema.jobLocation = {
            '@type': 'Place',
            address: {
                '@type': 'PostalAddress',
                addressLocality: job.location_city || undefined,
                addressCountry: job.location_country || undefined,
            },
        };
        if (job.job_type === 'hybrid') schema.jobLocationType = 'TELECOMMUTE';
    } else {
        // No location set → treat as globally open so the posting stays valid.
        schema.jobLocationType = 'TELECOMMUTE';
        schema.applicantLocationRequirements = { '@type': 'AdministrativeArea', name: 'Worldwide' };
    }

    return schema;
}

// Inject (or replace) a <script type="application/ld+json"> for the job, and
// return a cleanup function that removes it. Safe for React effects.
export function injectJobPostingSchema(job) {
    if (typeof document === 'undefined') return () => {};
    const schema = buildJobPostingSchema(job);
    if (!schema) return () => {};

    const id = 'job-posting-schema';
    document.getElementById(id)?.remove();

    const el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    el.textContent = JSON.stringify(schema);
    document.head.appendChild(el);

    return () => { document.getElementById(id)?.remove(); };
}
