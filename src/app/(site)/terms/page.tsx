import type { Metadata } from "next";
import { LegalPage } from "@/src/components/legal-page";
import { site } from "@/src/config/constants";

export const metadata: Metadata = { title: `Terms of Service · ${site.name}` };

const TermsPage = () => {
  return (
    <LegalPage title="Terms of Service">
      <p>
        {site.name} is a free typing game. By using it you agree to these terms. If
        you don&apos;t agree, don&apos;t use the site.
      </p>

      <h2>Your account</h2>
      <ul>
        <li>
          You can play without an account. An account is only needed to save results
          and appear on the leaderboard.
        </li>
        <li>
          You&apos;re responsible for keeping your password safe and for anything
          done with your account.
        </li>
        <li>
          One person, one account. Don&apos;t impersonate others or pick a display
          name that&apos;s offensive or misleading.
        </li>
      </ul>

      <h2>Fair play</h2>
      <ul>
        <li>
          Results must come from you typing. Scripts, macros, auto-typers or
          tampering with requests are not allowed.
        </li>
        <li>
          We may remove results or accounts that we believe are cheating, without
          notice.
        </li>
      </ul>

      <h2>Content</h2>
      <p>
        Typing passages are generated automatically from public sources and may
        occasionally be inaccurate or odd. They are provided for practice only and
        don&apos;t reflect our views.
      </p>

      <h2>Availability</h2>
      <p>
        The site is provided as-is, with no guarantee of uptime or that your data
        will be preserved. It&apos;s a side project; we may change or shut it down at
        any time.
      </p>

      <h2>Liability</h2>
      <p>
        To the extent permitted by law, we are not liable for any loss or damage
        arising from your use of the site.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms. The date at the top tells you when. Continued use
        after a change means you accept it.
      </p>

      <h2>Contact</h2>
      <p>
        <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
      </p>
    </LegalPage>
  );
};

export default TermsPage;
