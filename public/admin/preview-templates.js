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

  /* ------------------------------------------------------------------
     Gallery preview.
     Photo strip layout — mirrors the PhotoStrip component on the
     deployed page (one row of thumbnails with optional captions).
     ------------------------------------------------------------------ */
  var GalleryPreview = createClass({
    render: function () {
      var data = this.props.entry.get('data');
      var label = data.get('label') || '';
      var hint = data.get('hint') || '';
      var photos = data.get('photos');
      var photosArr = photos && photos.toJS ? photos.toJS() : [];

      var photoEls = photosArr.map(function (p, i) {
        return h(
          'figure',
          {
            key: i,
            style: {
              margin: 0,
              flex: '0 0 200px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            },
          },
          p.src
            ? h('img', {
                src: p.src,
                alt: p.alt || '',
                style: {
                  width: '200px',
                  height: '140px',
                  objectFit: 'cover',
                  borderRadius: '3px',
                  border: '1px solid #E8E1CE',
                  display: 'block',
                },
              })
            : h(
                'div',
                {
                  style: {
                    width: '200px',
                    height: '140px',
                    background: '#F4EFE2',
                    border: '1px dashed #E8E1CE',
                    borderRadius: '3px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    color: '#8A8678',
                  },
                },
                'no image'
              ),
          p.caption
            ? h(
                'figcaption',
                {
                  style: {
                    fontSize: '12px',
                    color: '#5C5A52',
                    lineHeight: '1.4',
                    fontFamily: 'Fraunces, serif',
                  },
                },
                p.caption
              )
            : null
        );
      });

      return h(
        'div',
        { className: 'preview-shell' },
        h('div', { className: 'eyebrow sage' }, 'Gallery'),
        h(
          'h1',
          { className: 'essay-title', style: { fontSize: '32px', lineHeight: '1.1' } },
          label || empty('Add a label')
        ),
        hint
          ? h(
              'p',
              {
                className: 'essay-hook',
                style: {
                  fontStyle: 'italic',
                  fontSize: '13px',
                  color: '#5C5A52',
                  borderLeft: '2px solid #E8E1CE',
                  paddingLeft: '12px',
                  margin: '12px 0 24px',
                },
              },
              hint
            )
          : null,
        h(
          'div',
          {
            style: {
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '10.5px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#8A8678',
              marginBottom: '14px',
            },
          },
          photosArr.length + ' photo' + (photosArr.length === 1 ? '' : 's')
        ),
        photosArr.length > 0
          ? h(
              'div',
              {
                style: {
                  display: 'flex',
                  gap: '16px',
                  flexWrap: 'wrap',
                },
              },
              photoEls
            )
          : h(
              'div',
              {
                style: {
                  padding: '24px',
                  border: '1px dashed #E8E1CE',
                  borderRadius: '4px',
                  fontSize: '13px',
                  color: '#8A8678',
                  textAlign: 'center',
                },
              },
              'No photos yet — the page will render an elegant placeholder.'
            )
      );
    },
  });

  CMS.registerPreviewTemplate('galleries', GalleryPreview);

  /* ------------------------------------------------------------------
     Timeline entry preview.
     Mirrors the timeline-entry component on the homepage: date column,
     kind label, title, hook prose, tag pills. The preview is a single
     entry (Decap edits one file at a time).
     ------------------------------------------------------------------ */
  var KIND_COLOR = {
    project: 'slate',
    writing: 'clay',
    role: 'slate',
    coursework: 'clay',
    milestone: 'sage',
  };

  var TimelinePreview = createClass({
    render: function () {
      var data = this.props.entry.get('data');
      var date = data.get('date') || '';
      var kind = data.get('kind') || 'milestone';
      var kindLabel = data.get('kindLabel') || '';
      var title = data.get('title') || '';
      var tags = data.get('tags');
      var tagsArr = tags && tags.toJS ? tags.toJS() : [];
      var href = data.get('href') || '';

      var accent = KIND_COLOR[kind] || 'sage';

      return h(
        'div',
        { className: 'preview-shell' },
        h(
          'div',
          {
            style: {
              display: 'grid',
              gridTemplateColumns: '120px 1fr',
              gap: '24px',
              alignItems: 'baseline',
            },
          },
          h(
            'div',
            null,
            h(
              'div',
              {
                style: {
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '11px',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: '#5C5A52',
                  marginBottom: '4px',
                },
              },
              date || empty('date')
            ),
            kindLabel
              ? h(
                  'div',
                  {
                    style: {
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '10px',
                      letterSpacing: '0.06em',
                      color: '#8A8678',
                    },
                  },
                  kindLabel
                )
              : null
          ),
          h(
            'div',
            null,
            h(
              'h2',
              {
                className: 'essay-title',
                style: { fontSize: '24px', lineHeight: '1.15', marginBottom: '8px' },
              },
              title || empty('Add a title'),
              href
                ? h(
                    'span',
                    {
                      style: {
                        fontSize: '11px',
                        fontFamily: 'JetBrains Mono, monospace',
                        color: '#8A8678',
                        marginLeft: '8px',
                        fontWeight: 'normal',
                      },
                    },
                    '→ ' + href
                  )
                : null
            ),
            h(
              'div',
              {
                style: {
                  fontFamily: 'Fraunces, serif',
                  fontSize: '15px',
                  lineHeight: '1.55',
                  color: '#44423C',
                  marginBottom: '12px',
                },
              },
              this.props.widgetFor('body')
            ),
            tagsArr.length > 0
              ? h(
                  'div',
                  { style: { display: 'flex', gap: '6px', flexWrap: 'wrap' } },
                  tagsArr.map(function (tag, i) {
                    return h(
                      'span',
                      {
                        key: i,
                        className: 'pill ' + accent,
                        style: {
                          fontSize: '11px',
                          padding: '2px 8px',
                          borderRadius: '999px',
                          border: '1px solid currentColor',
                          opacity: 0.85,
                        },
                      },
                      tag
                    );
                  })
                )
              : null
          )
        )
      );
    },
  });

  CMS.registerPreviewTemplate('timeline', TimelinePreview);

  /* ------------------------------------------------------------------
     Project deep-dive preview.
     Same approach as AboutPreview: title + dek + meta at full fidelity,
     body MDX shown as source in a mono block since the components
     can't be re-resolved in the preview iframe. Deployed page is the
     authoritative render.
     ------------------------------------------------------------------ */
  var ProjectPreview = createClass({
    render: function () {
      var data = this.props.entry.get('data');
      var title = data.get('title') || '';
      var dek = data.get('dek') || '';
      var kicker = data.get('kicker') || '';
      var meta = data.get('meta') || '';
      var cat = data.get('cat') || 'rust';
      var tags = data.get('tags');
      var tagsArr = tags && tags.toJS ? tags.toJS() : [];
      var body = data.get('body') || '';

      return h(
        'div',
        { className: 'preview-shell' },
        h(
          'div',
          { className: 'eyebrow ' + cat },
          kicker || empty('kicker (e.g. Project · Shipped · April 2026)'),
        ),
        h(
          'h1',
          { className: 'essay-title', style: { fontSize: '40px', lineHeight: '1.05' } },
          title || empty('Add a title (ends with a period)'),
        ),
        dek
          ? h(
              'p',
              {
                className: 'essay-hook',
                style: { fontStyle: 'italic', fontSize: '20px' },
              },
              dek,
            )
          : h('p', { className: 'essay-hook' }, empty('Add a dek')),
        h(
          'div',
          {
            style: {
              marginTop: '14px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              alignItems: 'center',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '11.5px',
              color: '#5C5A52',
            },
          },
          meta ? h('span', {}, meta) : null,
          tagsArr.length > 0
            ? h(
                'div',
                { style: { display: 'flex', gap: '6px', flexWrap: 'wrap' } },
                tagsArr.map(function (tag, i) {
                  return h(
                    'span',
                    {
                      key: i,
                      className: 'pill ' + cat,
                      style: {
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        border: '1px solid currentColor',
                        opacity: 0.85,
                      },
                    },
                    tag,
                  );
                }),
              )
            : null,
        ),
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
          'Body is MDX (markdown + components). The preview shows metadata only — the deployed /projects/{slug}/ is the authoritative render. Use Save & Preview to deploy to a preview URL.',
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
              body,
            )
          : null,
      );
    },
  });

  CMS.registerPreviewTemplate('projects', ProjectPreview);

  /* ------------------------------------------------------------------
     Page-chrome preview helpers.
     The /sweat/, /kitchen/, /writing/, /timeline/ singletons are
     frontmatter-only — there's no body to render. The preview mirrors
     the hero block from each page (eyebrow + h1 + dek) and lists any
     additional fields below as named meta rows so the editor knows
     what they're typing into.
     ------------------------------------------------------------------ */

  function pageHero(eyebrowAccent, eyebrow, heading, dek) {
    return [
      h(
        'div',
        {
          key: 'eyebrow',
          className: 'eyebrow ' + (eyebrowAccent || ''),
        },
        eyebrow || empty('eyebrow')
      ),
      h(
        'h1',
        {
          key: 'h',
          className: 'essay-title',
          style: { fontSize: '52px', lineHeight: '1.04' },
        },
        heading || empty('Add a heading (ends with a period)')
      ),
      dek
        ? h(
            'p',
            {
              key: 'd',
              className: 'essay-hook',
              style: { fontSize: '19px', fontStyle: 'normal' },
            },
            dek
          )
        : h('p', { key: 'd', className: 'essay-hook' }, empty('Add a dek')),
    ];
  }

  function metaRow(label, value) {
    return h(
      'div',
      {
        key: label,
        style: {
          display: 'grid',
          gridTemplateColumns: '160px 1fr',
          gap: '14px',
          padding: '6px 0',
          borderTop: '1px solid #E8E1CE',
          fontSize: '13px',
          lineHeight: '1.5',
        },
      },
      h(
        'div',
        {
          style: {
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '10.5px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#8A8678',
            paddingTop: '2px',
          },
        },
        label
      ),
      h('div', { style: { color: '#1C1B17' } }, value || empty('—'))
    );
  }

  function metaBlock(rows) {
    return h(
      'div',
      {
        style: {
          marginTop: '32px',
          paddingTop: '4px',
          borderBottom: '1px solid #E8E1CE',
        },
      },
      rows
    );
  }

  /* ------------------------------------------------------------------
     Sweat (page chrome) preview.
     ------------------------------------------------------------------ */
  var SweatPreview = createClass({
    render: function () {
      var data = this.props.entry.get('data');
      var eyebrow = data.get('eyebrow') || '';
      var heading = data.get('heading') || '';
      var dek = data.get('dek') || '';
      var volumeLabel = data.get('volumeLabel') || '';
      var metaTitle = data.get('metaTitle') || '';
      var metaDescription = data.get('metaDescription') || '';

      return h(
        'div',
        { className: 'preview-shell' },
        volumeLabel
          ? h(
              'div',
              {
                style: {
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '10.5px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: '#4B5A35',
                  marginBottom: '6px',
                },
              },
              volumeLabel
            )
          : null,
        pageHero('sage', eyebrow, heading, dek),
        metaBlock([
          metaRow('Meta · title', metaTitle),
          metaRow('Meta · description', metaDescription),
        ])
      );
    },
  });

  CMS.registerPreviewTemplate('sweat', SweatPreview);

  /* ------------------------------------------------------------------
     Kitchen (page chrome) preview.
     Renders the hero + a stacked summary of the two named sections
     (Bagels + Bread/Pizza) so the editor can see how the labels click
     together on the deployed page.
     ------------------------------------------------------------------ */
  var KitchenPreview = createClass({
    render: function () {
      var data = this.props.entry.get('data');
      var get = function (k) { return data.get(k) || ''; };

      function sectionBlock(eyebrow, heading, body) {
        return h(
          'div',
          {
            style: {
              marginTop: '24px',
              paddingTop: '20px',
              borderTop: '1px solid #E8E1CE',
            },
          },
          h(
            'div',
            {
              style: {
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '10.5px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#6E5A1F',
                marginBottom: '8px',
              },
            },
            eyebrow || empty('eyebrow')
          ),
          h(
            'h2',
            {
              className: 'essay-title',
              style: { fontSize: '26px', lineHeight: '1.18', marginBottom: '8px' },
            },
            heading || empty('heading')
          ),
          body
            ? h(
                'p',
                {
                  className: 'essay-hook',
                  style: { fontStyle: 'italic', fontSize: '15px' },
                },
                body
              )
            : null
        );
      }

      return h(
        'div',
        { className: 'preview-shell' },
        pageHero('honey', get('eyebrow'), get('heading'), get('dek')),
        sectionBlock(get('bagelsEyebrow'), get('bagelsHeading'), get('bagelsEmpty')),
        sectionBlock(get('practiceEyebrow'), get('practiceHeading'), get('practiceDek')),
        metaBlock([
          metaRow('Meta · title', get('metaTitle')),
          metaRow('Meta · description', get('metaDescription')),
          metaRow('Bagels · empty stamp', get('bagelsEmptyStamp')),
          metaRow('Bagels · photos hint', get('bagelsPhotosHint')),
          metaRow('Bread · label', get('breadLabel')),
          metaRow('Bread · photos hint', get('breadPhotosHint')),
          metaRow('Pizza · label', get('pizzaLabel')),
          metaRow('Pizza · photos hint', get('pizzaPhotosHint')),
        ])
      );
    },
  });

  CMS.registerPreviewTemplate('kitchen', KitchenPreview);

  /* ------------------------------------------------------------------
     Writing index (page chrome) preview.
     ------------------------------------------------------------------ */
  var WritingPreview = createClass({
    render: function () {
      var data = this.props.entry.get('data');
      var get = function (k) { return data.get(k) || ''; };

      return h(
        'div',
        { className: 'preview-shell' },
        pageHero('clay', get('eyebrow'), get('heading'), get('dek')),
        h(
          'div',
          {
            style: {
              marginTop: '28px',
              paddingTop: '20px',
              borderTop: '1px solid #E8E1CE',
            },
          },
          h(
            'p',
            {
              style: {
                fontFamily: 'Fraunces, serif',
                fontStyle: 'italic',
                fontSize: '18px',
                lineHeight: '1.5',
                color: '#5C5A52',
              },
            },
            get('emptyBody') || empty('emptyBody')
          ),
          h(
            'p',
            {
              style: {
                marginTop: '14px',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '11px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#8A8678',
              },
            },
            get('emptyCaption') || empty('emptyCaption')
          )
        ),
        metaBlock([
          metaRow('Meta · title', get('metaTitle')),
          metaRow('Meta · description', get('metaDescription')),
        ])
      );
    },
  });

  CMS.registerPreviewTemplate('writing', WritingPreview);

  /* ------------------------------------------------------------------
     Timeline index (page chrome) preview.
     ------------------------------------------------------------------ */
  var TimelinePagePreview = createClass({
    render: function () {
      var data = this.props.entry.get('data');
      var get = function (k) { return data.get(k) || ''; };

      return h(
        'div',
        { className: 'preview-shell' },
        pageHero('clay', get('eyebrow'), get('heading'), get('dek')),
        metaBlock([
          metaRow('Meta · title', get('metaTitle')),
          metaRow('Meta · description', get('metaDescription')),
        ])
      );
    },
  });

  CMS.registerPreviewTemplate('timeline_page', TimelinePagePreview);

  /* ------------------------------------------------------------------
     Trophy preview.
     Mirrors the TrophyBlock in app/sweat/page.tsx — kicker, title, dek,
     coords stamp, paragraphs, 4-up stat panel. Renders the actual body
     paragraphs (the markdown widget gives us widgetFor('body') as HTML).
     ------------------------------------------------------------------ */
  var TrophyPreview = createClass({
    render: function () {
      var data = this.props.entry.get('data');
      var kicker = data.get('kicker') || '';
      var title = data.get('title') || '';
      var dek = data.get('dek') || '';
      var coords = data.get('coords') || '';
      var stats = data.get('stats');
      var statsArr = stats && stats.toJS ? stats.toJS() : [];

      return h(
        'div',
        { className: 'preview-shell' },
        h(
          'div',
          { style: { position: 'relative' } },
          coords
            ? h(
                'div',
                {
                  style: {
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '11px',
                    letterSpacing: '0.06em',
                    color: '#5C5A52',
                  },
                },
                coords
              )
            : null,
          h(
            'div',
            { className: 'eyebrow sage', style: { marginBottom: '14px' } },
            kicker || empty('kicker (e.g. TROPHY · JULY 12–13, 2025)')
          ),
          h(
            'h1',
            {
              className: 'essay-title',
              style: { fontSize: '40px', lineHeight: '1.04', marginBottom: '10px' },
            },
            title || empty('Add a title (ends with a period)')
          ),
          dek
            ? h(
                'p',
                {
                  className: 'essay-hook',
                  style: { fontStyle: 'italic', fontSize: '20px' },
                },
                dek
              )
            : h('p', { className: 'essay-hook' }, empty('Add a dek'))
        ),

        h(
          'div',
          {
            style: {
              marginTop: '24px',
              fontFamily: 'Fraunces, serif',
              fontSize: '17px',
              lineHeight: '1.65',
              color: '#1C1B17',
            },
          },
          this.props.widgetFor('body')
        ),

        statsArr.length > 0
          ? h(
              'dl',
              {
                style: {
                  marginTop: '28px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(' + Math.min(statsArr.length, 4) + ', 1fr)',
                  gap: '0',
                  borderTop: '1px solid #E8E1CE',
                  borderBottom: '1px solid #E8E1CE',
                },
              },
              statsArr.map(function (s, i) {
                return h(
                  'div',
                  {
                    key: i,
                    style: {
                      padding: '14px 16px',
                      borderRight:
                        i < statsArr.length - 1 ? '1px solid #E8E1CE' : 'none',
                    },
                  },
                  h(
                    'dt',
                    {
                      style: {
                        fontFamily: 'JetBrains Mono, monospace',
                        fontSize: '10.5px',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: '#8A8678',
                        marginBottom: '6px',
                      },
                    },
                    s.label || '—'
                  ),
                  h(
                    'dd',
                    {
                      style: {
                        margin: 0,
                        fontFamily: 'Fraunces, serif',
                        fontSize: '24px',
                        lineHeight: '1.1',
                        color: '#1C1B17',
                        marginBottom: '4px',
                      },
                    },
                    s.value || '—'
                  ),
                  s.sub
                    ? h(
                        'div',
                        {
                          style: {
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '10.5px',
                            color: '#5C5A52',
                          },
                        },
                        s.sub
                      )
                    : null
                );
              })
            )
          : null
      );
    },
  });

  CMS.registerPreviewTemplate('trophies', TrophyPreview);
})();
