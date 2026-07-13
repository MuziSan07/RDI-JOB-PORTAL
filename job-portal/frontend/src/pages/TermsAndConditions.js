import React from 'react';
import { LegalPage, H2, P, B, UL, LI, Callout } from '../components/legal/LegalLayout';

const LAST_UPDATED = 'July 2026';

const SECTIONS = [
    { id: 'acceptance', label: '1. Acceptance of Terms' },
    { id: 'definitions', label: '2. Definitions' },
    { id: 'eligibility', label: '3. Eligibility' },
    { id: 'accounts', label: '4. Accounts & Security' },
    { id: 'acceptable-use', label: '5. Acceptable Use' },
    { id: 'job-seekers', label: '6. Job Seeker Terms' },
    { id: 'employers', label: '7. Employer & Department Terms' },
    { id: 'user-content', label: '8. User Content & License' },
    { id: 'ip', label: '9. Intellectual Property' },
    { id: 'prohibited', label: '10. Prohibited Conduct' },
    { id: 'third-party', label: '11. Third-Party Content & Links' },
    { id: 'no-guarantee', label: '12. No Employment Guarantee' },
    { id: 'disclaimers', label: '13. Disclaimer of Warranties' },
    { id: 'liability', label: '14. Limitation of Liability' },
    { id: 'indemnification', label: '15. Indemnification' },
    { id: 'disputes', label: '16. Disputes & Governing Law' },
    { id: 'termination', label: '17. Termination' },
    { id: 'general', label: '18. General Provisions' },
    { id: 'changes', label: '19. Changes to These Terms' },
];

const TermsAndConditions = () => (
    <LegalPage
        badge="Terms & Conditions"
        title="The terms of using RDI Job Portal."
        intro={
            'These Terms & Conditions ("Terms") are a binding legal agreement governing your access ' +
            'to and use of RDI Job Portal, operated by Rupani Development Initiatives ("RDI", "we", ' +
            '"us", "our"). Please read them carefully — by using the Platform you agree to be bound.'
        }
        lastUpdated={LAST_UPDATED}
        sections={SECTIONS}
    >
        <H2 id="acceptance">1. Acceptance of Terms</H2>
        <P>
            By accessing, browsing, registering for, or otherwise using the Platform, you agree to be
            bound by these Terms and by our Privacy Policy and Cookie Policy, which are incorporated by
            reference. If you do not agree, you must not access or use the Platform. If you use the
            Platform on behalf of an organization, you represent and warrant that you have authority to
            bind that organization to these Terms, and "you" refers to that organization.
        </P>

        <H2 id="definitions">2. Definitions</H2>
        <UL>
            <LI><B>"Platform"</B> means the RDI Job Portal website, applications, APIs, and related services.</LI>
            <LI><B>"Job Seeker"</B> means a user who uses the Platform to search and apply for roles.</LI>
            <LI><B>"Employer"</B> means an employer, department, or hiring entity that posts listings or reviews candidates.</LI>
            <LI><B>"User Content"</B> means any content you submit, upload, or transmit through the Platform, including profiles, résumés, and documents.</LI>
        </UL>

        <H2 id="eligibility">3. Eligibility</H2>
        <P>
            You must be of legal working age in your jurisdiction and capable of forming a binding
            contract to use the Platform. By using it, you represent and warrant that you meet these
            requirements, that all information you provide is accurate, current, and complete, and that
            your use complies with all laws applicable to you.
        </P>

        <H2 id="accounts">4. Accounts &amp; Security</H2>
        <P>
            You are responsible for maintaining the confidentiality of your account credentials and for
            all activity that occurs under your account, whether or not authorized by you. You agree to
            provide accurate registration details, keep them current, and notify us promptly of any
            actual or suspected unauthorized use. We may suspend, restrict, or terminate any account we
            reasonably believe has been compromised, used in violation of these Terms, or used
            unlawfully.
        </P>

        <H2 id="acceptable-use">5. Acceptable Use</H2>
        <P>You agree to use the Platform lawfully and in good faith. In particular, you agree to:</P>
        <UL>
            <LI>Provide truthful, accurate, and non-misleading information in your profile and applications.</LI>
            <LI>Use the Platform only for genuine job-search or recruitment purposes.</LI>
            <LI>Respect the rights, privacy, and dignity of other users.</LI>
            <LI>Comply with all applicable laws, regulations, and these Terms.</LI>
        </UL>

        <H2 id="job-seekers">6. Job Seeker Terms</H2>
        <P>
            As a Job Seeker, you are solely responsible for the accuracy and completeness of the
            information in your profile, résumé, and applications. Submitting false, misleading, or
            fraudulent information may result in removal of your content and termination of your
            account. When you apply to a listing, you authorize us to disclose your profile and attached
            documents to the relevant Employer. RDI does not guarantee any interview, assessment
            outcome, offer, or employment.
        </P>

        <H2 id="employers">7. Employer &amp; Department Terms</H2>
        <P>
            Employers and hiring departments agree to use candidate information solely for legitimate
            recruitment purposes and in compliance with all applicable employment, anti-discrimination,
            and data-protection laws. Employers must post accurate job descriptions, must not use the
            Platform to collect data for unrelated purposes, must not discriminate unlawfully, and must
            keep candidate data confidential and secure. RDI is not a party to any employment
            relationship formed through the Platform and is not responsible for any Employer's hiring
            decisions, conduct, or compliance.
        </P>

        <H2 id="user-content">8. User Content &amp; License</H2>
        <P>
            You retain ownership of your User Content. By submitting User Content, you grant RDI a
            non-exclusive, worldwide, royalty-free, sublicensable license to host, store, reproduce,
            adapt (for formatting and display), and share it as reasonably necessary to operate the
            Platform and deliver the services you request — for example, transmitting your application to
            an Employer. You represent and warrant that you own or have the necessary rights to your User
            Content and that it does not violate these Terms, any law, or the rights of any third party.
            You are solely responsible for your User Content.
        </P>

        <H2 id="ip">9. Intellectual Property</H2>
        <P>
            The Platform and all associated software, source code, design, text, graphics, logos,
            trademarks, and other materials (excluding User Content) are owned by RDI or its licensors
            and are protected by intellectual property and other laws. Except for the limited,
            revocable, non-exclusive, non-transferable right to use the Platform for its intended
            purpose, no rights are granted to you. You may not copy, modify, distribute, sell, lease,
            reverse engineer, decompile, frame, or create derivative works from any part of the Platform
            without our prior written consent.
        </P>

        <H2 id="prohibited">10. Prohibited Conduct</H2>
        <P>You agree that you will not:</P>
        <UL>
            <LI>Post or transmit unlawful, fraudulent, defamatory, obscene, harassing, or discriminatory content.</LI>
            <LI>Impersonate any person or entity or misrepresent your identity or affiliation.</LI>
            <LI>Upload viruses or malicious code, or attempt to gain unauthorized access to the Platform, accounts, or systems.</LI>
            <LI>Scrape, crawl, harvest, index, or collect data from the Platform by automated means without our prior written permission.</LI>
            <LI>Probe, scan, or test the vulnerability of the Platform, or breach or circumvent any security or authentication measure.</LI>
            <LI>Interfere with, disrupt, or place an unreasonable load on the Platform or its infrastructure.</LI>
            <LI>Use the Platform to send spam or unsolicited communications, or for any purpose that is unlawful or prohibited by these Terms.</LI>
        </UL>

        <H2 id="third-party">11. Third-Party Content &amp; Links</H2>
        <P>
            The Platform may contain listings, links, and content provided by Employers and other third
            parties. We do not endorse, and are not responsible for, the accuracy, legality, or
            reliability of any third-party content, including job listings, or for any dealings between
            you and any third party. Any such dealings are solely between you and that third party.
        </P>

        <H2 id="no-guarantee">12. No Employment Guarantee &amp; Assumption of Risk</H2>
        <P>
            The Platform is a venue that connects Job Seekers and Employers. RDI is not an employer,
            employment agency, or recruiter, and does not guarantee the availability, quality, safety,
            or legality of any listing, the truth or accuracy of any listing or User Content, the
            ability of Employers to offer roles, or that a Job Seeker will be hired. You use the Platform,
            and rely on any listing or User Content, at your own risk.
        </P>

        <H2 id="disclaimers">13. Disclaimer of Warranties</H2>
        <Callout>
            THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE", WITHOUT WARRANTIES OF ANY KIND, WHETHER
            EXPRESS, IMPLIED, OR STATUTORY, INCLUDING THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS
            FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
        </Callout>
        <P>
            To the fullest extent permitted by law, RDI does not warrant that the Platform will be
            uninterrupted, timely, secure, or error-free, that defects will be corrected, or that the
            Platform or its servers are free of harmful components. No advice or information, whether
            oral or written, obtained from RDI or through the Platform creates any warranty not expressly
            stated in these Terms.
        </P>

        <H2 id="liability">14. Limitation of Liability</H2>
        <Callout>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, RDI AND ITS AFFILIATES, OFFICERS, EMPLOYEES, AGENTS,
            AND PARTNERS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
            EXEMPLARY, OR PUNITIVE DAMAGES, OR FOR ANY LOSS OF PROFITS, REVENUE, DATA, GOODWILL, OR
            BUSINESS OPPORTUNITY, ARISING OUT OF OR RELATED TO YOUR USE OF, OR INABILITY TO USE, THE
            PLATFORM.
        </Callout>
        <P>
            To the maximum extent permitted by law, the total aggregate liability of RDI arising out of
            or relating to the Platform or these Terms will not exceed the greater of (a) the total
            amounts you paid to RDI, if any, in the twelve months preceding the event giving rise to the
            claim, or (b) one hundred U.S. dollars (USD 100). These limitations apply regardless of the
            legal theory on which the claim is based and even if RDI has been advised of the possibility
            of such damages. Some jurisdictions do not allow certain of these exclusions or limitations,
            so they apply to you only to the extent permitted by law.
        </P>

        <H2 id="indemnification">15. Indemnification</H2>
        <P>
            You agree to defend, indemnify, and hold harmless RDI and its affiliates, officers,
            employees, agents, and partners from and against any claims, liabilities, damages, losses,
            costs, and expenses, including reasonable legal fees, arising out of or related to your use
            of the Platform, your User Content, your violation of these Terms, or your violation of any
            law or the rights of any third party.
        </P>

        <H2 id="disputes">16. Disputes &amp; Governing Law</H2>
        <P>
            These Terms, and any dispute or claim arising out of or in connection with them or the
            Platform, are governed by the laws of the jurisdiction of RDI's principal place of business
            for the entity that provides the Platform to you, without regard to its conflict-of-laws
            rules. You and RDI agree to submit to the exclusive jurisdiction of the competent courts of
            that location, except where mandatory local law grants you the right to bring proceedings in,
            or requires the application of the law of, your place of residence.
        </P>
        <P>
            Before commencing any formal proceedings, you agree to first contact us through the Platform
            and attempt in good faith to resolve the dispute informally. To the extent permitted by law,
            any claim must be brought within one (1) year after it arises, and you agree to resolve
            disputes on an individual basis and waive any right to participate in a class or
            representative action.
        </P>

        <H2 id="termination">17. Termination</H2>
        <P>
            You may stop using the Platform and request deletion of your account at any time. We may
            suspend, restrict, or terminate your access, in whole or in part, with or without notice, if
            you violate these Terms, if we are required to do so by law, or if we reasonably determine it
            is necessary to protect the Platform, its users, or third parties. Provisions that by their
            nature should survive termination — including User Content licenses granted, intellectual
            property, disclaimers, limitation of liability, indemnification, and dispute resolution —
            will survive.
        </P>

        <H2 id="general">18. General Provisions</H2>
        <UL>
            <LI><B>Entire agreement</B> — these Terms, together with the Privacy Policy and Cookie Policy, are the entire agreement between you and RDI regarding the Platform and supersede any prior agreements.</LI>
            <LI><B>Severability</B> — if any provision is found unenforceable, it will be limited or removed to the minimum extent necessary, and the remaining provisions will remain in full force.</LI>
            <LI><B>No waiver</B> — our failure to enforce any provision is not a waiver of our right to do so later.</LI>
            <LI><B>Assignment</B> — you may not assign or transfer these Terms without our consent; we may assign them in connection with a merger, acquisition, or sale of assets.</LI>
            <LI><B>Force majeure</B> — RDI is not liable for any failure or delay caused by events beyond its reasonable control.</LI>
            <LI><B>Electronic communications</B> — you consent to receive communications from us electronically, and agree that electronic notices satisfy any legal requirement that a communication be in writing.</LI>
        </UL>

        <H2 id="changes">19. Changes to These Terms</H2>
        <P>
            We may update these Terms from time to time. When we make material changes, we will update
            the "Last updated" date above and, where appropriate, provide additional notice through the
            Platform. Your continued use of the Platform after the changes take effect constitutes
            acceptance of the revised Terms. If you do not agree to the updated Terms, you must stop
            using the Platform.
        </P>
    </LegalPage>
);

export default TermsAndConditions;
