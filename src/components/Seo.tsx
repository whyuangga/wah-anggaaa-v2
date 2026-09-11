import { useEffect } from 'react';

/** domain kanonis — samakan dengan index.html, sitemap, robots */
export const SITE_URL = 'https://wah-anggaaa.vercel.app';
export const SITE_NAME = 'wahanggaaa®';

const DEFAULT_DESC =
  'wahanggaaa — portofolio iseng: sebelas situs fiktif, nol klien, dibuat murni untuk bersenang-senang.';

function setMeta(attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

interface SeoProps {
  title?: string;
  description?: string;
  /** path relatif gambar, mis. images/works/003-elan-og.jpg — dijadikan absolut */
  image?: string;
  type?: 'website' | 'article';
  /** path kanonis route ini, mis. /works/elan */
  path?: string;
  /** JSON-LD opsional (CreativeWork, BlogPosting, ...) */
  jsonLd?: Record<string, unknown>;
  noindex?: boolean;
}

export default function Seo({
  title,
  description = DEFAULT_DESC,
  image = 'og.jpg',
  type = 'website',
  path = '/',
  jsonLd,
  noindex = false,
}: SeoProps) {
  useEffect(() => {
    const full = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — portofolio iseng`;
    document.title = full;
    const url = SITE_URL + path;
    const img = image.startsWith('http') ? image : `${SITE_URL}/${image}`;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', full);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', img);
    setMeta('property', 'og:site_name', SITE_NAME);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', full);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', img);
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
    let canon = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canon) {
      canon = document.createElement('link');
      canon.setAttribute('rel', 'canonical');
      document.head.appendChild(canon);
    }
    canon.setAttribute('href', url);
  }, [title, description, image, type, path, noindex]);

  const data =
    jsonLd ??
    (path === '/'
      ? {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: SITE_NAME,
          url: SITE_URL,
          description,
        }
      : undefined);
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
