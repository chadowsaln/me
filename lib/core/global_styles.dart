import 'package:jaspr/dom.dart';

import 'palette.dart';

/// Global stylesheet for the Shadow Dev portfolio.
///
/// Declared once on the [Document] so fonts, tokens and shared layout classes
/// are present on every page. Component styles live next to their components;
/// only truly global chrome lives here.
@css
List<StyleRule> get globalStyles => [
  css.import(
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap'),

  // ---- Design tokens -----------------------------------------------------
  css('html', [
    css('&').styles(
      raw: {
        '--bg': '#070a16',
        '--surface': '#0c1122',
        '--card': '#101730',
        '--border': 'rgba(148, 163, 255, 0.14)',
        '--text': '#e9ecf9',
        '--text-2': '#a7b0d2',
        '--text-muted': '#7983a8',
        '--accent': brandViolet.value,
        '--accent-2': brandBlue.value,
        'color-scheme': 'dark',
        'scroll-behavior': 'smooth',
        'scroll-padding-top': '6rem',
      },
    ),
    css('&.light', [
      css('&').styles(
        raw: {
          '--bg': '#f4f6fd',
          '--surface': '#ffffff',
          '--card': '#ffffff',
          '--border': 'rgba(80, 90, 150, 0.18)',
          '--text': '#171c30',
          '--text-2': '#4a5375',
          '--text-muted': '#7a84a8',
          'color-scheme': 'light',
        },
      ),
    ]),
  ]),

  // ---- Base --------------------------------------------------------------
  css('*', [
    css('&').styles(boxSizing: BoxSizing.borderBox),
  ]),
  css('html, body', [
    css('&').styles(
      width: 100.percent,
      minHeight: 100.vh,
      padding: Spacing.zero,
      margin: Spacing.zero,
      fontFamily: const .list([FontFamily('Inter'), FontFamilies.sansSerif]),
      fontSize: 16.px,
      lineHeight: 1.6.rem,
      color: cText,
      backgroundColor: cBg,
      raw: {
        'text-rendering': 'optimizeLegibility',
        '-webkit-font-smoothing': 'antialiased',
        '-moz-osx-font-smoothing': 'grayscale',
        'font-feature-settings': "'cv02', 'cv03', 'cv04', 'cv11'",
      },
    ),
  ]),
  css('h1, h2, h3, h4, h5, h6', [
    css('&').styles(
      margin: Spacing.zero,
      fontFamily: const .list([FontFamily('Space Grotesk'), FontFamilies.sansSerif]),
      color: cText,
      lineHeight: 1.15.rem,
      letterSpacing: (-0.02).em,
      fontWeight: FontWeight.w700,
    ),
  ]),
  css('a', [
    css('&').styles(
      color: Color.inherit,
      textDecoration: TextDecoration.none,
      cursor: Cursor.pointer,
    ),
  ]),
  css('img', [
    css('&').styles(
      display: Display.block,
      maxWidth: 100.percent,
    ),
  ]),
  css('button', [
    css('&').styles(
      fontFamily: FontFamily.inherit,
      color: Color.inherit,
      cursor: Cursor.pointer,
      backgroundColor: Color('transparent'),
      border: Border.none,
      padding: Spacing.zero,
    ),
  ]),
  css('::selection', [
    css('&').styles(
      backgroundColor: brandViolet,
      color: Color('#ffffff'),
    ),
  ]),
  css('*:focus', [
    css('&').styles(raw: {'outline': 'none'}),
  ]),
  css('*:focus-visible', [
    css('&').styles(
      raw: {
        'outline': '2px solid ${brandVioletSoft.value}',
        'outline-offset': '2px',
      },
    ),
  ]),
  css('::-webkit-scrollbar', [
    css('&').styles(width: 10.px),
  ]),
  css('::-webkit-scrollbar-thumb', [
    css('&').styles(
      radius: BorderRadius.circular(10.px),
      backgroundColor: Color.rgb(88, 98, 146),
      raw: {'border': '2px solid var(--bg)'},
    ),
  ]),
  css('::-webkit-scrollbar-track', [
    css('&').styles(backgroundColor: Color('transparent')),
  ]),

  // ---- Layout helpers ----------------------------------------------------
  css('.container', [
    css('&').styles(
      width: 100.percent,
      maxWidth: containerWidth.rem,
      margin: Spacing.symmetric(horizontal: Unit.auto),
      padding: Spacing.symmetric(horizontal: 1.5.rem),
    ),
  ]),
  css('.section', [
    css('&').styles(
      position: Position.relative(),
      padding: Spacing.symmetric(vertical: 5.5.rem),
    ),
  ]),
  css('.visually-hidden', [
    css('&').styles(
      position: Position.absolute(),
      width: 1.px,
      height: 1.px,
      padding: Spacing.zero,
      margin: Spacing.zero,
      overflow: Overflow.hidden,
      whiteSpace: WhiteSpace.noWrap,
      raw: {'clip': 'rect(0 0 0 0)', 'border': '0'},
    ),
  ]),

  // ---- Page background ---------------------------------------------------
  css('.page-bg', [
    css('&').styles(
      position: Position.fixed(top: 0.px, right: 0.px, bottom: 0.px, left: 0.px),
      zIndex: ZIndex(-1),
      backgroundColor: cBg,
      raw: {
        'background-image': gradientGlowCss,
        'background-repeat': 'no-repeat',
        'background-size': '100% 100%',
      },
    ),
  ]),
  css('.page-grid', [
    css('&').styles(
      position: Position.fixed(top: 0.px, right: 0.px, bottom: 0.px, left: 0.px),
      zIndex: ZIndex(-1),
      opacity: 0.9,
      pointerEvents: PointerEvents.none,
      raw: {
        'background-image': gridLineCss,
        'background-size': '34px 34px',
        'mask-image': 'linear-gradient(to bottom, black 0%, black 55%, transparent 100%)',
        '-webkit-mask-image': 'linear-gradient(to bottom, black 0%, black 55%, transparent 100%)',
      },
    ),
  ]),

  // ---- Type utilities ----------------------------------------------------
  css('.gradient-text', [
    css('&').styles(
      color: Color('transparent'),
      backgroundClip: BackgroundClip.text,
      raw: {'-webkit-background-clip': 'text', 'background-image': gradientBrandCss},
    ),
  ]),
  css('.eyebrow', [
    css('&').styles(
      display: Display.inlineFlex,
      alignItems: AlignItems.center,
      gap: Gap.all(0.5.rem),
      color: brandVioletSoft,
      fontSize: 0.8.rem,
      fontWeight: FontWeight.w600,
      letterSpacing: 0.12.em,
      textTransform: TextTransform.upperCase,
    ),
    css('&::before').styles(
      content: '""',
      width: 1.5.rem,
      height: 1.px,
      backgroundColor: brandViolet,
      opacity: 0.6,
    ),
  ]),

  // ---- Motion ------------------------------------------------------------
  css('.reveal', [
    css('&').styles(
      opacity: 0,
      transform: Transform.translate(y: 24.px),
      transition: Transition.combine([
        Transition('opacity', duration: const Duration(milliseconds: 600), curve: Curve.easeOut),
        Transition('transform', duration: const Duration(milliseconds: 700), curve: Curve.easeOut),
      ]),
      raw: {'will-change': 'opacity, transform'},
    ),
    css('&.is-visible').styles(
      opacity: 1,
      transform: Transform.translate(y: 0.px),
    ),
  ]),

  // ---- Keyframes ---------------------------------------------------------
  css.keyframes('fadeUp', {
    'from': Styles(opacity: 0, transform: Transform.translate(y: 28.px)),
    'to': Styles(opacity: 1, transform: Transform.translate(y: 0.px)),
  }),
  css.keyframes('floatY', {
    '0%': Styles(transform: Transform.translate(y: 0.px)),
    '50%': Styles(transform: Transform.translate(y: (-14).px)),
    '100%': Styles(transform: Transform.translate(y: 0.px)),
  }),

  // ---- Responsive --------------------------------------------------------
  css.media(MediaQuery.screen(minWidth: 720.px), [
    css('.container').styles(padding: Spacing.symmetric(horizontal: 2.5.rem)),
    css('.section').styles(padding: Spacing.symmetric(vertical: 7.rem)),
  ]),

  // ---- Reduced motion ----------------------------------------------------
  css.media(MediaQuery.raw('(prefers-reduced-motion: reduce)'), [
    css('*').styles(
      raw: {
        'scroll-behavior': 'auto',
        'transition-duration': '0ms',
        'animation-duration': '0ms',
      },
    ),
    css('.reveal').styles(
      opacity: 1,
      transform: Transform.translate(y: 0.px),
    ),
  ]),

  // TEMPORARY scaffold note — delete with the first real section (Task 5).
  css('.scaffold-note', [
    css('&').styles(
      minHeight: 80.vh,
      display: Display.flex,
      flexDirection: FlexDirection.column,
      alignItems: AlignItems.center,
      justifyContent: JustifyContent.center,
      gap: Gap.all(0.75.rem),
      color: cTextSecondary,
    ),
    css('.scaffold-note-dot').styles(
      width: 12.px,
      height: 12.px,
      radius: BorderRadius.circular(12.px),
      backgroundColor: brandVioletSoft,
      shadow: BoxShadow(
        offsetX: 0.px,
        offsetY: 0.px,
        blur: 18.px,
        color: brandVioletSoft.withOpacity(0.8),
      ),
    ),
  ]),
];