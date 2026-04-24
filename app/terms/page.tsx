import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service',
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
        <span className="w-1 h-6 bg-primary rounded-full inline-block" />
        {title}
      </h2>
      <div className="text-gray-400 leading-relaxed space-y-3 text-sm">
        {children}
      </div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-300">
          Home
        </Link>
        <span>/</span>
        <span className="text-gray-300">Terms of Service</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-white mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500">Last updated: January 1, 2025</p>
        <p className="text-gray-400 text-sm mt-3 leading-relaxed">
          Please read these Terms of Service carefully before using WatchFury. By accessing or using
          our website, you agree to be bound by these terms. If you disagree with any part of these
          terms, you may not access the Service.
        </p>
      </div>

      {/* Sections */}
      <Section title="Acceptance of Terms">
        <p>
          By accessing or using WatchFury (&quot;the Service&quot;, &quot;we&quot;, &quot;us&quot;,
          or &quot;our&quot;) at dramaku.com, you confirm that you are at least 13 years of age and
          agree to be bound by these Terms of Service and all applicable laws and regulations. If
          you are accessing the Service on behalf of an organization, you represent and warrant that
          you have the authority to bind that organization to these terms.
        </p>
        <p>
          These Terms of Service constitute the entire agreement between you and WatchFury regarding
          your use of the Service and supersede any prior agreements. We reserve the right to update
          or modify these terms at any time without prior notice. Your continued use of the Service
          after any changes constitutes your acceptance of the new terms.
        </p>
      </Section>

      <Section title="Description of Service">
        <p>
          WatchFury is a free streaming index that aggregates publicly available embed links to
          Korean dramas, Asian dramas, and related content. Our Service provides:
        </p>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li>A searchable catalog of K-dramas and Asian dramas powered by TMDB metadata</li>
          <li>Aggregated streaming links sourced from publicly available third-party embed providers</li>
          <li>
            Optional user accounts for saving watch history, watchlists, and preferences
          </li>
          <li>Content discovery features such as genre browsing, search, and recommendations</li>
        </ul>
        <p>
          WatchFury acts solely as a directory and index service. We do not produce, upload, host, or
          control any video content. All media is streamed directly from third-party providers over
          which we have no control. The availability, quality, and legality of content from those
          providers is their own responsibility.
        </p>
      </Section>

      <Section title="Educational & Personal Use">
        <p>
          WatchFury is provided for educational and personal, non-commercial use only. The Service is
          intended to help users discover and learn about Korean and Asian drama content for
          personal enjoyment and cultural appreciation.
        </p>
        <p>By using WatchFury, you agree that you will:</p>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li>Use the Service solely for personal, non-commercial purposes</li>
          <li>Not resell, sublicense, or otherwise commercialize access to the Service</li>
          <li>
            Not use the Service in any way that could damage, disable, or impair its operation
          </li>
          <li>Comply with all applicable local, national, and international laws and regulations</li>
          <li>Take responsibility for ensuring that your use of the Service is lawful in your jurisdiction</li>
        </ul>
        <p>
          Users in certain jurisdictions may be subject to local laws regarding the streaming of
          copyrighted content. It is your sole responsibility to understand and comply with the laws
          applicable in your region.
        </p>
      </Section>

      <Section title="Intellectual Property">
        <p>
          WatchFury respects intellectual property rights and expects users to do the same. The
          following clarifications apply to intellectual property on this Service:
        </p>
        <p>
          <strong className="text-gray-300">Drama metadata and images:</strong> All drama titles,
          descriptions, poster images, backdrop images, cast information, and related metadata are
          sourced from The Movie Database (TMDB) under their API terms of service. This content
          belongs to TMDB and its respective contributors.
        </p>
        <p>
          <strong className="text-gray-300">Video content:</strong> All video content belongs to
          its respective copyright holders, including production studios, distributors, and
          broadcasting networks. WatchFury does not claim any ownership of video content. We do not
          host, store, upload, or distribute any video files whatsoever.
        </p>
        <p>
          <strong className="text-gray-300">WatchFury branding:</strong> The WatchFury name, logo, and
          original interface design are our intellectual property. You may not reproduce, distribute,
          or create derivative works based on our branding without prior written consent.
        </p>
        <p>
          <strong className="text-gray-300">User-generated content:</strong> Any content you submit
          to WatchFury (such as comments or reviews, if applicable) remains your property, but you
          grant us a non-exclusive, worldwide license to display and use that content in connection
          with the Service.
        </p>
      </Section>

      <Section title="Prohibited Activities">
        <p>
          You agree not to engage in any of the following prohibited activities while using
          WatchFury:
        </p>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li>
            Attempting to circumvent, disable, or interfere with any security features or
            access controls of the Service
          </li>
          <li>
            Scraping, crawling, harvesting, or otherwise collecting data from WatchFury in bulk
            using automated tools without prior written permission
          </li>
          <li>
            Using the Service for any commercial purpose, including but not limited to reselling
            access or integrating WatchFury content into commercial products
          </li>
          <li>
            Distributing, reproducing, or publicly displaying video content accessed through
            the Service in violation of applicable copyright law
          </li>
          <li>
            Uploading or transmitting viruses, malware, or any other malicious code that could
            compromise the Service or its users
          </li>
          <li>
            Impersonating any person or entity or falsely representing your affiliation with any
            person or entity
          </li>
          <li>
            Using the Service to harass, abuse, or harm other users
          </li>
          <li>
            Attempting to gain unauthorized access to other user accounts or to WatchFury&apos;s
            backend systems
          </li>
          <li>
            Systematically mirroring or archiving the WatchFury website or any portion of its content
          </li>
        </ul>
        <p>
          Violation of these prohibited activities may result in immediate termination of your
          access to the Service and, where applicable, may be reported to appropriate legal
          authorities.
        </p>
      </Section>

      <Section title="Disclaimer of Warranties">
        <p>
          THE SERVICE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS,
          WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT
          PERMITTED BY APPLICABLE LAW, WATCHFURY EXPRESSLY DISCLAIMS ALL WARRANTIES, INCLUDING BUT
          NOT LIMITED TO:
        </p>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li>
            Implied warranties of merchantability, fitness for a particular purpose, and
            non-infringement
          </li>
          <li>
            Warranties regarding the accuracy, reliability, completeness, or timeliness of any
            content available through the Service
          </li>
          <li>
            Warranties that the Service will be uninterrupted, error-free, or free of viruses or
            other harmful components
          </li>
          <li>
            Warranties regarding the continued availability of any particular drama title or
            streaming source
          </li>
        </ul>
        <p>
          WatchFury does not endorse, verify, or take responsibility for the quality, legality, or
          availability of content provided by third-party embed services. Your use of the Service
          is entirely at your own risk.
        </p>
      </Section>

      <Section title="Limitation of Liability">
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, WATCHFURY AND ITS OPERATORS, DIRECTORS,
          EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
          CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
        </p>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li>Loss of profits, revenue, data, or goodwill</li>
          <li>Service interruptions or unavailability</li>
          <li>Unauthorized access to or alteration of your data</li>
          <li>Any content obtained through the Service</li>
          <li>Any conduct or content of any third party on or linked from the Service</li>
        </ul>
        <p>
          In no event shall WatchFury&apos;s total liability to you for all claims relating to the
          Service exceed the greater of (a) the amount you paid to use the Service in the past
          twelve months, or (b) $10 USD. This limitation applies regardless of whether the claim
          is based on warranty, contract, tort, or any other legal theory, and regardless of
          whether WatchFury has been advised of the possibility of such damages.
        </p>
      </Section>

      <Section title="DMCA & Copyright">
        <p>
          WatchFury respects the intellectual property rights of copyright holders and complies with
          the Digital Millennium Copyright Act (DMCA). As a service that indexes third-party embed
          links rather than hosting content directly, we operate under the DMCA&apos;s safe harbor
          provisions.
        </p>
        <p>
          If you are a copyright owner or authorized agent and believe that content accessible
          through WatchFury infringes your copyright, please note that WatchFury does not host any
          video files. For the fastest resolution, we recommend submitting takedown requests
          directly to the relevant embed providers (e.g., VidSrc, 2Embed, EmbedSu).
        </p>
        <p>
          To submit a DMCA notice to WatchFury for removal of links from our index, please visit our{' '}
          <Link href="/dmca" className="text-primary hover:underline">
            DMCA page
          </Link>{' '}
          and complete the copyright takedown form. We will review valid notices and act promptly,
          typically within 3 business days.
        </p>
      </Section>

      <Section title="Termination">
        <p>
          We reserve the right, at our sole discretion, to suspend or permanently terminate your
          access to the Service at any time, with or without notice, for any reason, including but
          not limited to:
        </p>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li>Violation of these Terms of Service</li>
          <li>Conduct that we believe is harmful to other users, third parties, or WatchFury</li>
          <li>Requests from law enforcement or other government agencies</li>
          <li>Unexpected technical or security issues</li>
          <li>Extended periods of inactivity (for user accounts)</li>
        </ul>
        <p>
          Upon termination, your right to use the Service will immediately cease. All provisions of
          these Terms of Service which by their nature should survive termination shall survive,
          including ownership provisions, warranty disclaimers, indemnity, and limitations of
          liability. You may also choose to delete your account at any time through your account
          settings.
        </p>
      </Section>

      <Section title="Changes to Terms">
        <p>
          We reserve the right to modify or replace these Terms of Service at any time at our sole
          discretion. We will provide notice of significant changes by updating the &quot;Last
          updated&quot; date at the top of this page and, where appropriate, by displaying a
          prominent notice on the Service.
        </p>
        <p>
          It is your responsibility to review these Terms periodically for changes. Your continued
          use of the Service following the posting of any changes constitutes acceptance of those
          changes. If you do not agree to the updated terms, you must stop using the Service
          immediately.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          If you have any questions, concerns, or feedback about these Terms of Service, we&apos;d
          love to hear from you. Please use our{' '}
          <Link href="/request" className="text-primary hover:underline">
            Request page
          </Link>{' '}
          to submit your message directly to our team. When contacting us about a legal matter,
          please include &quot;Terms of Service&quot; in your message subject so we can route it
          appropriately.
        </p>
        <p>
          For copyright-related inquiries specifically, please visit our{' '}
          <Link href="/dmca" className="text-primary hover:underline">
            DMCA page
          </Link>{' '}
          instead.
        </p>
      </Section>
    </div>
  );
}
