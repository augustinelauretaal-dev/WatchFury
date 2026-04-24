import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy',
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

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-gray-300">Privacy Policy</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-3">Last updated: January 1, 2025</p>
        <p className="text-sm text-gray-400 leading-relaxed max-w-3xl">
          WatchFury (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is committed to protecting your privacy. This Privacy
          Policy explains what information we collect, how we use it, and the choices you have
          regarding your information when you visit and use WatchFury (the &ldquo;Service&rdquo;). Please read
          this policy carefully before using our site.
        </p>
      </div>

      {/* Sections */}
      <Section title="Introduction">
        <p>
          WatchFury is a free K-drama and Asian drama streaming index that aggregates publicly
          available video embed links. We believe in being fully transparent about our data
          practices, and this Privacy Policy is our commitment to explaining exactly what we
          collect and why.
        </p>
        <p>
          This policy applies to all visitors and registered users of WatchFury, regardless of
          how you access the Service — whether via desktop browser, mobile browser, or any
          other means. By using WatchFury, you consent to the data practices described in this
          policy. If you do not agree with any part of this policy, please discontinue use of
          the Service.
        </p>
      </Section>

      <Section title="Information We Collect">
        <p>
          <strong className="text-gray-200 font-semibold">Information you provide directly:</strong>{' '}
          If you create an account, we collect your email address and any display name you
          choose to set. We do not require your real name, phone number, or physical address.
          You may optionally provide additional profile information at your discretion.
        </p>
        <p>
          <strong className="text-gray-200 font-semibold">Automatically collected information:</strong>{' '}
          When you visit WatchFury, certain technical information is automatically collected,
          including your browser type and version, operating system, IP address (which may be
          anonymized), the pages you visit, time spent on those pages, referring URLs, and
          general geographic region (country/city level, derived from IP). This data helps us
          understand how the Service is used and how to improve it.
        </p>
        <p>
          <strong className="text-gray-200 font-semibold">Watch history and watchlist:</strong>{' '}
          If you are signed in, we store your watch history, watchlist entries, and episode
          progress locally and/or on our servers to provide continuity across your sessions.
          This data is tied to your account and used solely to personalize your experience.
        </p>
        <p>
          <strong className="text-gray-200 font-semibold">Cookies and local storage:</strong>{' '}
          We use browser cookies, localStorage, and similar technologies to maintain sessions,
          remember your preferences (such as subtitle language, playback server, and theme), and
          collect anonymized analytics. See the Cookies section below for more details.
        </p>
      </Section>

      <Section title="How We Use Your Information">
        <p>We use the information we collect for the following purposes:</p>
        <ul className="list-disc list-inside space-y-2 pl-2 marker:text-primary">
          <li>To provide, operate, and maintain the WatchFury Service</li>
          <li>To personalize your experience, including drama recommendations and resuming watch progress</li>
          <li>To remember your preferences and settings across visits and devices</li>
          <li>To send essential service-related communications, such as account verification or policy update notices</li>
          <li>To monitor, analyze, and improve site performance, usability, and content offerings</li>
          <li>To detect, investigate, and prevent fraudulent activity, abuse, or violations of our Terms of Service</li>
          <li>To comply with applicable legal obligations</li>
        </ul>
        <p>
          We do <strong className="text-gray-200 font-semibold">not</strong> sell, rent, or
          trade your personal information to any third party for their marketing purposes. We do
          not use your personal data to build advertising profiles or serve targeted ads.
        </p>
      </Section>

      <Section title="Third-Party Services">
        <p>
          WatchFury relies on several third-party services to function. Each of these parties
          operates independently and has its own privacy policy. We encourage you to review
          their policies directly:
        </p>
        <ul className="list-disc list-inside space-y-2 pl-2 marker:text-primary">
          <li>
            <strong className="text-gray-200 font-semibold">TMDB (The Movie Database):</strong>{' '}
            All drama metadata, titles, descriptions, poster images, and cast information are
            sourced from TMDB&apos;s public API under their terms of service. Visit{' '}
            <a
              href="https://www.themoviedb.org/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              tmdb.org/privacy-policy
            </a>{' '}
            for details.
          </li>
          <li>
            <strong className="text-gray-200 font-semibold">Video embed providers:</strong>{' '}
            Video streams are served via third-party embed providers including but not limited to
            VidSrc, 2Embed, and EmbedSu. When you initiate playback, your browser connects
            directly to these providers&apos; servers. They may collect their own usage data, including
            your IP address and viewing activity. WatchFury is not responsible for those data
            practices.
          </li>
          <li>
            <strong className="text-gray-200 font-semibold">Analytics:</strong>{' '}
            We may use privacy-respecting analytics tools to understand aggregate site traffic.
            Where possible, we configure these tools to anonymize IP addresses and avoid storing
            personally identifiable information.
          </li>
        </ul>
        <p>
          We make reasonable efforts to work with third-party providers that respect user
          privacy, but we cannot control or be held responsible for their independent practices.
        </p>
      </Section>

      <Section title="Cookies">
        <p>
          Cookies are small text files stored in your browser that help websites remember
          information about your visit. WatchFury uses the following types of cookies:
        </p>
        <ul className="list-disc list-inside space-y-2 pl-2 marker:text-primary">
          <li>
            <strong className="text-gray-200 font-semibold">Essential cookies:</strong>{' '}
            Required for the Service to function. These include session tokens for keeping you
            signed in and security cookies that help protect your account. You cannot opt out of
            these without affecting your ability to use the Service.
          </li>
          <li>
            <strong className="text-gray-200 font-semibold">Preference cookies:</strong>{' '}
            Store your user settings such as selected subtitle language, preferred video server,
            and display preferences so we can restore them on your next visit.
          </li>
          <li>
            <strong className="text-gray-200 font-semibold">Analytics cookies:</strong>{' '}
            Help us understand how visitors navigate and interact with the site. These cookies
            collect anonymized, aggregated data only and cannot be used to identify individual
            users.
          </li>
        </ul>
        <p>
          You can disable or delete cookies at any time through your browser settings. Please
          note that disabling essential cookies will prevent you from signing in and may break
          certain features of the Service. Third-party embed providers may set their own cookies
          when you play a video, which are governed by their respective policies.
        </p>
      </Section>

      <Section title="Data Security">
        <p>
          We take the security of your personal information seriously and implement reasonable
          technical and organizational measures to protect it. These measures include encrypted
          data transmission over HTTPS, securely hashed and salted passwords (we never store
          passwords in plain text), and restricted access controls on our infrastructure.
        </p>
        <p>
          However, no method of transmission over the internet or method of electronic storage
          is completely secure. While we strive to use commercially acceptable means to protect
          your personal information, we cannot guarantee absolute security. In the event of a
          data breach that affects your rights and freedoms, we will notify affected users as
          required by applicable law.
        </p>
        <p>
          You are responsible for maintaining the confidentiality of your account credentials.
          We recommend using a strong, unique password for your WatchFury account and enabling
          any additional security features available to you.
        </p>
      </Section>

      <Section title="Children's Privacy">
        <p>
          WatchFury is not directed to, and is not intended for use by, children under the age
          of 13. We do not knowingly collect personal information from children under 13. If
          you are a parent or legal guardian and believe that your child has provided us with
          personal information without your consent, please contact us immediately through our{' '}
          <Link href="/request" className="text-primary hover:underline">
            Request page
          </Link>
          .
        </p>
        <p>
          Upon receiving such a notification, we will take prompt steps to delete the
          relevant information from our systems. If you are between the ages of 13 and 18,
          please review this Privacy Policy with a parent or guardian before using the Service.
        </p>
      </Section>

      <Section title="Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time to reflect changes in our
          practices, the Service, applicable law, or other factors. When we make changes, we
          will update the &ldquo;Last updated&rdquo; date at the top of this page.
        </p>
        <p>
          For material changes — those that significantly affect your rights or how we use your
          data — we will make a reasonable effort to notify users through a prominent notice on
          the site or via email if you have an account. We encourage you to review this policy
          periodically to stay informed. Your continued use of WatchFury after any changes
          constitutes acceptance of the updated Privacy Policy.
        </p>
      </Section>

      <Section title="Contact Us">
        <p>
          If you have any questions, concerns, or requests regarding this Privacy Policy — including
          requests to access, correct, or delete your personal data — please reach out to us. The
          best way to contact our team is through our{' '}
          <Link href="/request" className="text-primary hover:underline">
            Request page
          </Link>
          , where you can submit a message directly.
        </p>
        <p>
          We aim to respond to all privacy-related inquiries within 5 business days. For
          urgent data concerns, please include &ldquo;PRIVACY REQUEST&rdquo; in the subject or title of
          your message so we can prioritize your inquiry.
        </p>
      </Section>

    </div>
  );
}
