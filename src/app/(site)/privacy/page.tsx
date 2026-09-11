import type { Metadata } from "next";
import { LegalPage } from "@/src/components/legal-page";
import { site } from "@/src/config/constants";

export const metadata: Metadata = { title: `Privacy Policy · ${site.name}` };

const PrivacyPage = () => {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        This explains what {site.name} stores about you and why. Short version: as
        little as we can.
      </p>

      <h2>Without an account</h2>
      <p>
        Nothing is stored. Your rounds live only in your browser tab and are gone
        when you close it. We don&apos;t use analytics or advertising trackers.
      </p>

      <h2>With an account</h2>
      <ul>
        <li>
          <strong>Email and display name</strong> — to sign you in and show you on
          the leaderboard. If you sign in with Google, we receive your Google name,
          email and profile picture URL. We never see your Google password.
        </li>
        <li>
          <strong>Password</strong> — stored hashed, never in plain text.
        </li>
        <li>
          <strong>Typing results</strong> — for each completed round: words per
          minute, accuracy, keystrokes, start and end time, and which passage you
          typed.
        </li>
        <li>
          <strong>Session cookie</strong> — keeps you signed in. It&apos;s the only
          cookie we set.
        </li>
      </ul>

      <h2>What&apos;s public</h2>
      <p>
        Your display name, average and best speed, and number of rounds appear on the
        public leaderboard once you&apos;ve played five rounds. Your email is never
        shown.
      </p>

      <h2>Email</h2>
      <p>
        We only email you for account reasons: verifying your address, resetting your
        password, or confirming an email change. Delivery is handled by Resend. No
        newsletters.
      </p>

      <h2>Third parties</h2>
      <ul>
        <li>
          <strong>Google</strong> — only if you choose to sign in with Google.
        </li>
        <li>
          <strong>Resend</strong> — sends the account emails above.
        </li>
        <li>
          <strong>Cloudflare</strong> — serves the site and sees standard connection
          data such as IP address.
        </li>
        <li>
          <strong>OpenAI</strong> — generates typing passages from public topics.
          Nothing about you or your typing is sent to it.
        </li>
      </ul>

      <h2>Deleting your data</h2>
      <p>
        Email <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a> from
        your account address and we&apos;ll delete your account and all its results.
      </p>

      <h2>Changes</h2>
      <p>We may update this policy; the date at the top tells you when.</p>
    </LegalPage>
  );
};

export default PrivacyPage;
