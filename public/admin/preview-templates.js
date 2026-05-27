/* eslint-disable */
/**
 * Decap CMS preview templates.
 *
 * Decap exposes `CMS`, `h` (React.createElement), and `createClass`
 * globally on window after its bundle loads. Each template receives an
 * `entry` (ImmutableJS Map) and a `widgetFor(name)` function that
 * returns the rendered React node for the named field (so the body
 * markdown widget renders to real HTML, not a raw string).
 *
 * The rendered shape mirrors what will land on the deployed page:
 * eyebrow → title → hook/excerpt → meta → prose body with drop-cap.
 * Keep this in lockstep with the eventual app/writing/[slug]/page.tsx.
 */
(function () {
  if (typeof CMS === 'undefined') {
    console.error('[admin] Decap CMS bundle not loaded — preview templates skipped.');
    return;
  }

  CMS.registerPreviewStyle('/admin/preview.css');

  function empty(s) {
    return h('span', { className: 'preview-empty' }, s);
  }

  /* ------------------------------------------------------------------
     Essay preview.
     ------------------------------------------------------------------ */
  var EssayPreview = createClass({
    render: function () {
      var data = this.props.entry.get('data');
      var cat = data.get('cat') || 'sage';
      var catLabel = data.get('catLabel') || '';
      var title = data.get('title') || '';
      var hook = data.get('hook') || '';
      var excerpt = data.get('excerpt') || '';
      var date = data.get('date') || '';

      var eyebrowText = [catLabel || empty('category'), date || empty('date')]
        .filter(Boolean);
      var eyebrowNodes = [];
      eyebrowText.forEach(function (n, i) {
        if (i > 0) eyebrowNodes.push(' · ');
        eyebrowNodes.push(n);
      });

      return h(
        'div',
        { className: 'preview-shell' },
        h('div', { className: 'eyebrow ' + cat }, eyebrowNodes),
        h('h1', { className: 'essay-title' }, title || empty('Add a title')),
        hook
          ? h('p', { className: 'essay-hook' }, hook)
          : h('p', { className: 'essay-hook' }, empty('One-line hook')),
        excerpt
          ? h('blockquote', { className: 'essay-excerpt' }, excerpt)
          : null,
        h(
          'div',
          { className: 'essay-meta' },
          'Essay · index entry'
        ),
        h(
          'div',
          { className: 'prose-editorial' },
          h('div', { className: 'drop-cap' }, this.props.widgetFor('body'))
        )
      );
    },
  });

  CMS.registerPreviewTemplate('essays', EssayPreview);

  /* ------------------------------------------------------------------
     Batch preview.
     ------------------------------------------------------------------ */
  var BatchPreview = createClass({
    render: function () {
      var data = this.props.entry.get('data');
      var number = data.get('number');
      var kind = (data.get('kind') || 'bake').toString().toUpperCase();
      var title = data.get('title') || '';
      var date = data.get('date') || '';
      var hydration = data.get('hydration');
      var ferment = data.get('ferment');
      var oven = data.get('oven');
      var notes = data.get('notes');

      var facts = [];
      if (hydration) facts.push({ k: 'hydration', v: hydration });
      if (ferment) facts.push({ k: 'ferment', v: ferment });
      if (oven) facts.push({ k: 'oven', v: oven });

      var notesArr = notes && notes.toJS ? notes.toJS() : [];

      var eyebrowBits = [];
      if (number !== undefined && number !== null && number !== '') {
        eyebrowBits.push('BATCH #' + number);
      } else {
        eyebrowBits.push(empty('batch #'));
      }
      eyebrowBits.push(kind);
      if (date) eyebrowBits.push(date);

      var eyebrowNodes = [];
      eyebrowBits.forEach(function (n, i) {
        if (i > 0) eyebrowNodes.push(' · ');
        eyebrowNodes.push(n);
      });

      return h(
        'div',
        { className: 'preview-shell' },
        h('div', { className: 'eyebrow honey' }, eyebrowNodes),
        h('h1', { className: 'essay-title' }, title || empty('Add a title')),

        facts.length > 0
          ? h(
              'div',
              { className: 'batch-facts' },
              facts.map(function (f, i) {
                return h(
                  'div',
                  { key: i, className: 'row' },
                  h('span', { className: 'k' }, f.k),
                  h('span', {}, f.v)
                );
              })
            )
          : null,

        notesArr.length > 0
          ? h(
              'div',
              { className: 'batch-notes' },
              h('h3', {}, 'Notes'),
              h(
                'ul',
                {},
                notesArr.map(function (note, i) {
                  return h('li', { key: i }, note);
                })
              )
            )
          : null,

        h(
          'div',
          { className: 'prose-editorial' },
          this.props.widgetFor('body')
        )
      );
    },
  });

  CMS.registerPreviewTemplate('batches', BatchPreview);

  /* ------------------------------------------------------------------
     About page preview.
     Body is MDX — the code widget returns raw text in the preview,
     so we render the title + tagline at full fidelity and show the
     body source in a monospace block so the editor can see the
     structure they're working with. The deployed page is the
     authoritative render.
     ------------------------------------------------------------------ */
  var AboutPreview = createClass({
    render: function () {
      var data = this.props.entry.get('data');
      var title = data.get('title') || '';
      var tagline = data.get('tagline') || '';
      var body = data.get('body') || '';

      return h(
        'div',
        { className: 'preview-shell' },
        h('div', { className: 'eyebrow' }, 'About'),
        h(
          'h1',
          { className: 'essay-title', style: { fontSize: '52px', lineHeight: '1.0' } },
          title || empty('Add a title (ends with a period)')
        ),
        tagline
          ? h(
              'p',
              {
                className: 'essay-hook',
                style: { fontStyle: 'italic', fontSize: '20px' },
              },
              tagline
            )
          : h('p', { className: 'essay-hook' }, empty('Add a tagline')),
        h(
          'div',
          {
            style: {
              marginTop: '32px',
              padding: '16px 20px',
              border: '1px solid #E8E1CE',
              background: '#F4EFE2',
              borderRadius: '4px',
              fontSize: '12px',
              color: '#5C5A52',
              lineHeight: '1.5',
            },
          },
          'Body is MDX (markdown + components). The preview shows metadata only — the deployed /about/ is the authoritative render. Use the Save & Preview button to deploy to a preview URL.'
        ),
        body
          ? h(
              'pre',
              {
                style: {
                  marginTop: '16px',
                  padding: '14px 16px',
                  background: '#FBF8F1',
                  border: '1px solid #E8E1CE',
                  borderRadius: '4px',
                  fontSize: '11.5px',
                  lineHeight: '1.55',
                  fontFamily: 'JetBrains Mono, monospace',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  color: '#1C1B17',
                  maxHeight: '480px',
                  overflow: 'auto',
                },
              },
              body
            )
          : null
      );
    },
  });

  CMS.registerPreviewTemplate('about', AboutPreview);
})();
