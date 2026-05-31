import grayMatter from 'gray-matter';
import yaml from 'js-yaml';

/**
 * Thin wrapper around gray-matter that forces it to use our top-level
 * `js-yaml` v4.x instead of the v3.14 it bundles itself.
 *
 * Why: js-yaml 3.x defaults to YAML 1.1's CORE_SCHEMA, which still
 * parses sexagesimal numbers — `value: 6:19` silently becomes the
 * integer 379 (= 6*60+19). That broke `/sweat/` after a CMS edit
 * unquoted a `Moving time` stat. js-yaml 4.x follows YAML 1.2 and
 * doesn't do that.
 *
 * Use this everywhere we parse frontmatter — never import gray-matter
 * directly. Cross-loader consistency matters; the next stat someone
 * types as `0:43:42` will silently become a number under the bundled
 * parser the moment Decap saves it without quotes.
 */
export function matter(raw: string): {
  data: Record<string, unknown>;
  content: string;
} {
  return grayMatter(raw, {
    engines: {
      yaml: {
        parse: (s: string) => yaml.load(s) as object,
        stringify: (obj: object) => yaml.dump(obj),
      },
    },
  });
}
