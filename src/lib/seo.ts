// Sayfa bazlı SEO meta güncellemeleri (SPA içinde)
export function setSeo(opts: {
  title: string;
  description?: string;
  path?: string;
}) {
  document.title = opts.title;

  const set = (selector: string, attr: string, value: string, create?: () => HTMLElement) => {
    let el = document.head.querySelector(selector) as HTMLElement | null;
    if (!el && create) {
      el = create();
      document.head.appendChild(el);
    }
    if (el) el.setAttribute(attr, value);
  };

  if (opts.description) {
    set('meta[name="description"]', 'content', opts.description, () => {
      const m = document.createElement('meta');
      m.setAttribute('name', 'description');
      return m;
    });
    set('meta[property="og:description"]', 'content', opts.description);
  }

  set('meta[property="og:title"]', 'content', opts.title);

  if (opts.path !== undefined) {
    const url = window.location.origin + opts.path;
    set('link[rel="canonical"]', 'href', url, () => {
      const l = document.createElement('link');
      l.setAttribute('rel', 'canonical');
      return l;
    });
    set('meta[property="og:url"]', 'content', url);
  }
}
