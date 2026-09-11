import Link from "next/link";
import { site } from "@/src/config/constants";

interface LegalPageProps {
  title: string;
  children: React.ReactNode;
}

// Shared shell for /terms and /privacy.
const LegalPage = ({ title, children }: LegalPageProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-16 default-text">
      <Link
        href="/"
        className="font-mono text-sm opacity-40 hover:opacity-100 transition-opacity"
      >
        &larr; home
      </Link>
      <h1 className="font-mono text-2xl font-medium mt-8">{title}</h1>
      <p className="font-mono text-xs opacity-50 mt-2">
        Last updated {site.policiesUpdated}
      </p>
      <div className="mt-8 flex flex-col gap-6 text-[15px] leading-relaxed [&_h2]:font-mono [&_h2]:text-sm [&_h2]:uppercase [&_h2]:tracking-wide [&_h2]:opacity-60 [&_h2]:mt-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1 [&_a]:underline [&_a]:underline-offset-2">
        {children}
      </div>
      <p className="font-mono text-xs opacity-40 mt-12">
        <Link href="/terms">terms</Link> · <Link href="/privacy">privacy</Link>
      </p>
    </div>
  );
};

export { LegalPage };
