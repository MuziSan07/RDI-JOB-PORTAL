import React from 'react';
import { LegalPage, H2, P, B, UL, LI, Callout } from '../components/legal/LegalLayout';
import { BRAND, FONT } from '../components/brand/brandTheme';

const LAST_UPDATED = 'July 2026';

const SECTIONS = [
    { id: 'what-are-cookies', label: '1. What Are Cookies' },
    { id: 'how-we-use', label: '2. How We Use Them' },
    { id: 'categories', label: '3. Categories We Use' },
    { id: 'consent', label: '4. Your Consent & Choices' },
    { id: 'managing', label: '5. Managing Cookies' },
    { id: 'third-party', label: '6. Third-Party Services' },
    { id: 'changes', label: '7. Changes to This Policy' },
];

const COOKIE_ROWS = [
    {
        category: 'Essential',
        purpose: 'Authentication and session tokens (held in your browser’s local storage) that sign you in and keep your session secure. The Platform cannot function without these.',
        duration: 'Until you log out or clear storage',
        status: 'Always active',
        optional: false,
    },
    {
        category: 'Preferences',
        purpose: 'Remember your choices — including your cookie-consent decision and display settings — so your experience stays consistent.',
        duration: 'Until you clear it',
        status: 'Optional',
        optional: true,
    },
    {
        category: 'Analytics',
        purpose: 'If enabled, help us understand how the Platform is used, in aggregate, so we can improve performance and usability. Set only where you have consented.',
        duration: 'Up to 24 months',
        status: 'Consent required',
        optional: true,
    },
];

const CookieTable = () => (
    <div style={{ overflowX: 'auto', borderTop: `1px solid ${BRAND.ink}`, margin: '4px 0 20px' }}>
        <table style={{ width: '100%', minWidth: 620, borderCollapse: 'collapse', fontFamily: FONT }}>
            <thead>
                <tr>
                    {['Category', 'Purpose', 'Duration', 'Status'].map((h) => (
                        <th
                            key={h}
                            style={{
                                textAlign: 'left', padding: '14px 16px 12px 0', verticalAlign: 'bottom',
                                fontSize: 11.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                                color: BRAND.muted, borderBottom: `1px solid ${BRAND.line}`,
                            }}
                        >
                            {h}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {COOKIE_ROWS.map((row) => (
                    <tr key={row.category}>
                        <td style={{ padding: '16px 16px 16px 0', fontSize: 14.5, fontWeight: 700, color: BRAND.ink, borderBottom: `1px solid ${BRAND.line}`, whiteSpace: 'nowrap', verticalAlign: 'top' }}>
                            {row.category}
                        </td>
                        <td style={{ padding: '16px 16px 16px 0', fontSize: 14, lineHeight: 1.6, color: BRAND.slate, borderBottom: `1px solid ${BRAND.line}`, verticalAlign: 'top' }}>
                            {row.purpose}
                        </td>
                        <td style={{ padding: '16px 16px 16px 0', fontSize: 14, color: BRAND.slate, borderBottom: `1px solid ${BRAND.line}`, verticalAlign: 'top' }}>
                            {row.duration}
                        </td>
                        <td style={{ padding: '16px 0', fontSize: 13.5, fontWeight: 600, color: row.optional ? BRAND.gold : BRAND.green, borderBottom: `1px solid ${BRAND.line}`, whiteSpace: 'nowrap', verticalAlign: 'top' }}>
                            {row.status}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const Code = ({ children }) => (
    <code style={{ background: BRAND.surfaceAlt, border: `1px solid ${BRAND.line}`, padding: '1px 6px', borderRadius: 4, fontSize: 13.5, color: BRAND.ink }}>
        {children}
    </code>
);

const CookiePolicy = () => (
        <LegalPage
            badge="Cookie Policy"
            title="How and why we use cookies."
            intro={
                'This Cookie Policy explains how RDI Job Portal, operated by Rupani Development ' +
                'Initiatives ("RDI", "we", "us"), uses cookies and similar technologies such as browser ' +
                'local storage to keep you signed in and improve your experience.'
            }
            lastUpdated={LAST_UPDATED}
            sections={SECTIONS}
        >
            <H2 id="what-are-cookies">1. What Are Cookies</H2>
            <P>
                Cookies are small text files placed on your device when you visit a website. Similar
                technologies, such as browser local storage, let a site store data locally in your
                browser. Together, these technologies help the Platform remember information about your
                visit, keep you signed in, and understand how the service is used.
            </P>
            <P>
                RDI Job Portal relies primarily on <B>browser local storage</B> to hold your
                authentication and session tokens, along with a small preference value that records your
                cookie choices.
            </P>

            <H2 id="how-we-use">2. How We Use Them</H2>
            <UL>
                <LI><B>To keep you signed in</B> — authentication and session tokens are stored so you don’t have to log in on every page.</LI>
                <LI><B>To remember your choices</B> — such as your cookie-consent decision and display preferences.</LI>
                <LI><B>To understand and improve usage</B> — where enabled and consented, aggregate analytics help us make the Platform faster and easier to use.</LI>
            </UL>
            <P>
                We do <B>not</B> use cookies for behavioral advertising, and we do not sell information
                collected through cookies or local storage.
            </P>

            <H2 id="categories">3. Categories We Use</H2>
            <P>The table below summarizes the categories of cookies and storage we use, their purpose, and how long they typically last.</P>
            <CookieTable />

            <H2 id="consent">4. Your Consent &amp; Choices</H2>
            <P>
                Essential storage is necessary for the Platform to work and is always active. For any
                non-essential cookies, we ask for your consent through the cookie banner shown on your
                first visit, where you can accept or decline. Declining non-essential cookies will not
                prevent you from using the core features of the Platform.
            </P>

            <H2 id="managing">5. Managing Cookies</H2>
            <P>
                You can change your consent choice at any time by clearing the <Code>cookie_consent</Code>
                value stored in your browser, after which the banner will appear again on your next
                visit.
            </P>
            <P>
                Most browsers also let you view, block, or delete cookies and clear local storage through
                their settings. Please note that blocking essential storage or clearing your session data
                will sign you out and may prevent parts of the Platform from working.
            </P>

            <H2 id="third-party">6. Third-Party Services</H2>
            <P>
                Some features may rely on trusted third-party providers (for example, hosting, content
                delivery, or analytics) that could set their own cookies or process data under their own
                privacy policies. Where any such non-essential third-party technology is used, it is set
                only after you provide consent. We do not permit third parties to use cookies on the
                Platform to track you across other websites for advertising.
            </P>

            <H2 id="changes">7. Changes to This Policy</H2>
            <P>
                We may update this Cookie Policy from time to time to reflect changes in the technologies
                we use or in the law. When we make material changes, we will update the "Last updated"
                date above. Please review this page periodically.
            </P>

            <Callout>
                This Cookie Policy should be read together with our Privacy Policy, which explains more
                fully how we handle the personal information we collect through the Platform.
            </Callout>
        </LegalPage>
);

export default CookiePolicy;
