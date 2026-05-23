import Link from 'next/link';
import { TagRow } from '@/components/tag';

/**
 * Shared chrome for any long-form page (project deep-dives + writing posts).
 * Centers the reading column, places the eyebrow + title + meta block at
 * the top, and renders children inside .prose-editorial.
 */

export interface ArticleShellProps {
  kicker: string; // e.g. "Project · 2026"
  title: string;
  dek?: string; // The pull-quote subtitle under the title
  meta?: React.ReactNode; // Right-rail-style meta line (date · read time · etc.)
  tags?: string[];
  children: React.ReactNode;
  backHref?: string;
  backLabel?: string;
}

export function ArticleShell({
  kicker,
  title,
  dek,
  meta,
  tags,
  children,
  backHref = '/',
  backLabel = 'Index',
}: ArticleShellProps) {
  return (
    <article className="max-w-page mx-auto px-6 sm:px-10">
      <div className="pt-12 pb-2">
        <Link
          href={backHref}
          className="text-[11px] tracking-eyebrow uppercase text-ink-faint hover:text-ink transition-colors"
        >
          ← {backLabel}
        </Link>
      </div>

      <header className="pt-10 pb-12 max-w-reading">
        <div className="text-[11px] tracking-eyebrow uppercase text-ink-faint mb-5">
          {kicker}
        </div>
        <h1 className="font-serif text-[44px] sm:text-[56px] leading-[1.05] tracking-tight text-ink">
          {title}
        </h1>
        {dek && (
          <p className="mt-5 font-serif italic text-[22px] leading-[1.4] text-ink-muted">
            {dek}
          </p>
        )}
        {(meta || tags) && (
          <div className="mt-7 pt-5 border-t border-paper-edge flex flex-wrap items-center gap-x-6 gap-y-3 text-[12px] tracking-eyebrow uppercase text-ink-soft">
            {meta && <div>{meta}</div>}
            {tags && <TagRow tags={tags} />}
          </div>
        )}
      </header>

      <div className="prose-editorial max-w-reading pb-16">{children}</div>
    </article>
  );
}
