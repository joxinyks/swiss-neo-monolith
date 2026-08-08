/**
 * Swiss Neo-Monolith — lint rules that make canon violations fail the build.
 *
 * Usage (flat config):
 *   const snm = require('@snm/tokens/eslint-snm.cjs');
 *   module.exports = [ ...snm ];
 *
 * These catch the violations that are cheap to detect in source. The rest live
 * in references/99-checklist.md and need eyes.
 */

const NO_ARBITRARY_HEX =
  'SNM: elle hex yazma. Token kullan (bg-inverse, text-accent, var(--snm-…)).';
const NO_ROUNDED =
  'SNM-CANON-01: yuvarlatılmış köşe yasak. Tek istisna .snm-pulse.';
const NO_TRANSITION_ALL =
  'SNM: "transition: all" yasak. Property listesini açıkça yaz.';
const NO_VH =
  'SNM-LAY-02: 100vh yerine 100dvh kullan (mobil adres çubuğu).';
const NO_BLUR_SHADOW =
  'SNM-CANON-04: bulanık gölge/blur yasak. shadow-1/2/3 (sert ofset) kullan.';

module.exports = [
  {
    files: ['**/*.{js,jsx,ts,tsx,css,scss}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          // bg-[#121316], text-[11px], p-[10px] — Tailwind arbitrary values
          selector: "Literal[value=/\\[#[0-9a-fA-F]{3,8}\\]/]",
          message: NO_ARBITRARY_HEX,
        },
        {
          selector: "Literal[value=/(^|\\s)(rounded|rounded-[a-z0-9-]+)(\\s|$)/]",
          message: NO_ROUNDED,
        },
        {
          selector: "Literal[value=/transition:\\s*all|transition-all/]",
          message: NO_TRANSITION_ALL,
        },
        {
          selector: "Literal[value=/\\d+vh\\b/]",
          message: NO_VH,
        },
        {
          selector: "Literal[value=/backdrop-blur|blur-(sm|md|lg|xl)|drop-shadow/]",
          message: NO_BLUR_SHADOW,
        },
      ],
    },
  },
];

/**
 * Stylelint counterpart — put this in .stylelintrc.cjs:
 *
 * module.exports = {
 *   rules: {
 *     'color-no-hex': true,
 *     'declaration-property-value-disallowed-list': {
 *       'border-radius': ['/^(?!0)/'],
 *       'transition': ['/\\ball\\b/'],
 *       'box-shadow': ['/\\d+px\\s+\\d+px\\s+[1-9]/'],  // any blur radius > 0
 *     },
 *     'unit-disallowed-list': ['vh'],
 *   },
 * };
 */
