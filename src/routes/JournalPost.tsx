import { motion } from 'motion/react';
import { useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Seo, { SITE_URL } from '../components/Seo';
import { TLink } from '../lib/transition';
import { POSTS, formatDate } from '../lib/journal';
import NotFound from './NotFound';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function JournalPost() {
  const { slug } = useParams();
  const idx = POSTS.findIndex((p) => p.slug === slug);
  if (idx === -1) return <NotFound />;
  const p = POSTS[idx];
  const prev = POSTS[idx - 1];
  const next = POSTS[idx + 1];

  return (
    <>
      <Seo
        title={p.title}
        description={p.desc}
        type="article"
        path={`/journal/${p.slug}`}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: p.title,
          description: p.desc,
          datePublished: p.date,
          author: { '@type': 'Person', name: 'wahanggaaa' },
          url: `${SITE_URL}/journal/${p.slug}`,
        }}
      />
      <section className="px-5 md:px-10 pt-32 md:pt-44">
        <TLink
          to="/journal"
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/45 hover:text-ink transition-colors"
        >
          [ ← jurnal ]
        </TLink>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, ease: [...EASE] }}
          className="mt-8 max-w-5xl font-serif font-bold tracking-[-0.01em] leading-[1.02] text-[clamp(2rem,6vw,4.5rem)]"
        >
          {p.title}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, delay: 0.3, ease: [...EASE] }}
          className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50"
        >
          <span>{formatDate(p.date)}</span>
          {p.tags.map((t) => (
            <span key={t}>[ {t} ]</span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.45, ease: [...EASE] }}
          className="md-body mt-12 md:mt-16 max-w-2xl"
          dangerouslySetInnerHTML={{ __html: p.html }}
        />

        {/* prev / next — hanya tampil kalau ada tetangga */}
        {(prev || next) && (
          <div className="mt-20 md:mt-28 pt-4 pb-4 grid grid-cols-2 gap-6">
            <div>
              {prev && (
                <TLink to={`/journal/${prev.slug}`} className="group block">
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/45">
                    [ ← sebelumnya ]
                  </span>
                  <span className="block mt-3 font-serif font-bold leading-tight text-[clamp(1.2rem,3vw,2rem)] text-ink/60 group-hover:text-ink transition-colors">
                    {prev.title}
                  </span>
                </TLink>
              )}
            </div>
            <div className="text-right">
              {next && (
                <TLink to={`/journal/${next.slug}`} className="group block">
                  <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/45">
                    [ berikutnya → ]
                  </span>
                  <span className="block mt-3 font-serif font-bold leading-tight text-[clamp(1.2rem,3vw,2rem)] text-ink/60 group-hover:text-ink transition-colors">
                    {next.title}
                  </span>
                </TLink>
              )}
            </div>
          </div>
        )}
      </section>

      <Footer giant={false} />
    </>
  );
}
