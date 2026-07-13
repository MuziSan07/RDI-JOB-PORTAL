import React from 'react';
import { LegalPage, H2, H3, P, B, UL, LI, Callout } from '../components/legal/LegalLayout';

const LAST_UPDATED = 'July 2026';

const SECTIONS = [
    { id: 'who-we-are', label: '1. Who We Are' },
    { id: 'scope', label: '2. Scope of This Policy' },
    { id: 'information-we-collect', label: '3. Information We Collect' },
    { id: 'how-we-use', label: '4. How We Use Information' },
    { id: 'legal-bases', label: '5. Legal Bases for Processing' },
    { id: 'sharing', label: '6. Sharing & Disclosure' },
    { id: 'cookies', label: '7. Cookies & Tracking' },
    { id: 'retention', label: '8. Data Retention' },
    { id: 'your-rights', label: '9. Your Rights & Choices' },
    { id: 'security', label: '10. Security' },
    { id: 'international', label: '11. International Transfers' },
    { id: 'third-party', label: '12. Third-Party Services' },
    { id: 'children', label: "13. Children's Privacy" },
    { id: 'changes', label: '14. Changes to This Policy' },
];

const PrivacyPolicy = () => (
    <LegalPage
        badge="Privacy Policy"
        title="Your privacy, respected end to end."
        intro={
            'This policy explains what personal information RDI Job Portal, operated by ' +
            'Rupani Development Initiatives ("RDI", "we", "us", "our"), collects, why we collect ' +
            'it, how we use and protect it, and the choices and rights you have.'
        }
        lastUpdated={LAST_UPDATED}
        sections={SECTIONS}
    >
        <H2 id="who-we-are">1. Who We Are</H2>
        <P>
            RDI Job Portal is a recruitment platform operated by Rupani Development Initiatives, an
            organization with operations in the United States, Pakistan, Afghanistan, and the United
            Arab Emirates. RDI is the controller responsible for the personal information processed
            through the website, applications, and related services (together, the <B>"Platform"</B>).
        </P>
        <P>
            By creating an account or otherwise using the Platform, you acknowledge that you have read
            and understood this Privacy Policy. If you do not agree with it, you must not use the
            Platform.
        </P>

        <H2 id="scope">2. Scope of This Policy</H2>
        <P>
            This policy applies to personal information we process about job seekers, employer and
            department users, and visitors to the Platform. It does not apply to the independent
            practices of employers, departments, or third parties who receive your information through
            the Platform — once an employer receives your application, their own handling of that data
            is governed by their policies and applicable law.
        </P>

        <H2 id="information-we-collect">3. Information We Collect</H2>
        <P>We collect information you provide, information generated through your use of the Platform, and information from your device.</P>
        <H3>Account information</H3>
        <P>
            When you register, we collect your name, email address, phone number, user type, password
            (which we store only in salted, hashed form and never in plain text), and your account
            preferences.
        </P>
        <H3>Profile, résumé, and application data</H3>
        <P>
            To help you apply for roles, we collect your professional profile: work history, education,
            skills, current role, and expected salary. Depending on the requirements of the roles you
            apply to, this may include additional identifiers such as a national identity number (for
            example, a CNIC), father's name, date of birth, nationality, and address. Some of these
            fields may constitute sensitive personal data. You choose what to provide — we ask that you
            submit only what is necessary for the applications you intend to make.
        </P>
        <H3>Uploaded documents</H3>
        <P>
            You may upload résumés, cover letters, certificates, and supporting files. These documents
            are stored on our systems and are disclosed to an employer or department only when you
            submit an application to their listing.
        </P>
        <H3>Usage and device data</H3>
        <P>
            We automatically collect technical information such as your IP address, browser and device
            type, approximate location derived from your IP, pages viewed, searches performed, and
            interaction timestamps. We use this to operate, secure, and improve the Platform and to
            detect abuse.
        </P>
        <H3>Local storage and cookies</H3>
        <P>
            We use browser local storage and a limited set of cookies to keep you signed in, remember
            your choices, and understand how the Platform is used. See <B>Cookies &amp; Tracking</B> below
            and our Cookie Policy for details.
        </P>

        <H2 id="how-we-use">4. How We Use Information</H2>
        <UL>
            <LI>To create and manage your account and authenticate your sessions.</LI>
            <LI>To display your profile to employers and to process the applications you submit.</LI>
            <LI>To recommend relevant roles and improve matching between candidates and openings.</LI>
            <LI>To administer skills assessments and to communicate application status and outcomes.</LI>
            <LI>To send service messages and, where you have opted in, job alerts and updates.</LI>
            <LI>To operate, maintain, secure, monitor, and improve the Platform.</LI>
            <LI>To detect, investigate, prevent, and respond to fraud, abuse, and security incidents.</LI>
            <LI>To comply with legal obligations and to establish, exercise, or defend legal claims.</LI>
        </UL>

        <H2 id="legal-bases">5. Legal Bases for Processing</H2>
        <P>Where data protection law requires a legal basis, we rely on one or more of the following:</P>
        <UL>
            <LI><B>Performance of a contract</B> — to provide the services you request when you create an account and apply for jobs.</LI>
            <LI><B>Consent</B> — for optional features such as non-essential cookies and marketing or job-alert emails, which you may withdraw at any time.</LI>
            <LI><B>Legitimate interests</B> — to secure the Platform, prevent abuse, understand usage, and improve our services, balanced against your rights and freedoms.</LI>
            <LI><B>Legal obligation</B> — where processing is necessary to comply with applicable law.</LI>
        </UL>

        <H2 id="sharing">6. Sharing &amp; Disclosure</H2>
        <P><B>We do not sell your personal information.</B> We disclose it only in the circumstances below:</P>
        <UL>
            <LI><B>With employers and departments</B> — when you apply to a listing, the relevant employer or hiring department receives your profile, application, and attached documents so they can evaluate your candidacy.</LI>
            <LI><B>With service providers</B> — trusted vendors who host, secure, and support the Platform, acting on our instructions and bound by confidentiality and data-protection obligations.</LI>
            <LI><B>For legal and safety reasons</B> — where we reasonably believe disclosure is required by law, regulation, legal process, or governmental request, or is necessary to protect the rights, property, or safety of RDI, our users, or the public.</LI>
            <LI><B>In corporate transactions</B> — in connection with a merger, acquisition, financing, or reorganization, subject to the receiving party honoring this policy.</LI>
        </UL>

        <H2 id="cookies">7. Cookies &amp; Tracking</H2>
        <P>
            The Platform relies primarily on browser local storage to hold your authentication and
            session tokens, together with a small preference value that records your cookie choices. We
            do not use advertising cookies and do not permit third parties to track you across other
            websites for advertising through the Platform. Full details are in our Cookie Policy.
        </P>

        <H2 id="retention">8. Data Retention</H2>
        <P>
            We retain your personal information for as long as your account is active and for a
            reasonable period afterward as needed to comply with legal, accounting, and record-keeping
            obligations, resolve disputes, prevent fraud and abuse, and enforce our agreements. When
            information is no longer needed for these purposes, we delete it or irreversibly anonymize
            it. You may request deletion of your account at any time, as described below.
        </P>

        <H2 id="your-rights">9. Your Rights &amp; Choices</H2>
        <P>Subject to your local law, you may have the following rights over your personal information:</P>
        <UL>
            <LI><B>Access</B> — obtain confirmation of, and a copy of, the personal data we hold about you.</LI>
            <LI><B>Correction</B> — update or fix inaccurate or incomplete data, much of which you can edit directly from your profile.</LI>
            <LI><B>Deletion</B> — request deletion of your account and associated data, subject to permitted legal retention.</LI>
            <LI><B>Portability</B> — receive certain data in a structured, commonly used, machine-readable format.</LI>
            <LI><B>Objection and restriction</B> — object to or restrict certain processing, and withdraw consent where processing relies on it, without affecting processing already carried out.</LI>
        </UL>
        <P>
            You can exercise most of these rights directly within the Platform through your profile and
            account-management tools, including editing your details and requesting account deletion. We
            may need to verify your identity before acting on a request, and we will respond within the
            timeframe required by applicable law.
        </P>

        <H2 id="security">10. Security</H2>
        <P>
            We use technical and organizational measures designed to protect your information, including
            encryption of data in transit, hashed passwords, access controls, and monitoring. However,
            no method of transmission or storage is completely secure, and we cannot guarantee absolute
            security. You are responsible for keeping your credentials confidential and for using a
            strong, unique password; notify us promptly if you believe your account has been
            compromised.
        </P>

        <H2 id="international">11. International Transfers</H2>
        <P>
            Because RDI operates across the United States, Pakistan, Afghanistan, and the United Arab
            Emirates, and uses service providers that may be located elsewhere, your information may be
            transferred to, stored in, and processed in countries other than your own, which may have
            different data-protection laws. Where we transfer personal data across borders, we take
            steps intended to ensure it remains protected consistent with this policy and applicable
            law.
        </P>

        <H2 id="third-party">12. Third-Party Services</H2>
        <P>
            The Platform may link to, or interoperate with, websites and services operated by third
            parties, including employers. We are not responsible for the content or privacy practices of
            those third parties. We encourage you to review the privacy policies of any third-party
            service before providing them with your information.
        </P>

        <H2 id="children">13. Children's Privacy</H2>
        <P>
            The Platform is intended for individuals who are of legal working age in their jurisdiction
            and is not directed to children. We do not knowingly collect personal information from
            children. If you believe a child has provided us with personal data, please reach out
            through the Platform so we can take appropriate action to remove it.
        </P>

        <H2 id="changes">14. Changes to This Policy</H2>
        <P>
            We may update this Privacy Policy from time to time. When we make material changes, we will
            update the "Last updated" date above and, where appropriate, provide additional notice
            through the Platform. Your continued use of the Platform after the changes take effect
            constitutes acceptance of the revised policy.
        </P>

        <Callout>
            This Privacy Policy forms part of, and should be read together with, our Terms &amp; Conditions
            and Cookie Policy. Together they set out the complete terms on which the Platform is
            provided.
        </Callout>
    </LegalPage>
);

export default PrivacyPolicy;
