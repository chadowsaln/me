/// Brand palette for the Shadow Dev portfolio.
///
/// Static brand colors shared by every theme. Themeable surfaces, borders and
/// text are exposed as CSS variables (see [cBg], [cText], ...) so the client
/// motif toggle can flip between dark and light without rebuilding styles.
library;

import 'package:jaspr/dom.dart';

/// Brand violet (purple edge of the signature gradient).
const Color brandViolet = Color('#8b5cf6');

/// Light brand violet, used on the bright end of gradients.
const Color brandVioletSoft = Color('#a78bfa');

/// Electric blue (the cool edge of the signature gradient).
const Color brandBlue = Color('#22d3ee');

/// Light electric blue for airy highlights.
const Color brandBlueSoft = Color('#67e8f9');

/// Deep cyan used for focused accents (cursors, live dots).
const Color brandCyan = Color('#06b6d4');

/// Status palette for project badges.
const Color statusSubmitted = Color('#34d399');
const Color statusInProgress = Color('#fbbf24');
const Color statusOpenSource = Color('#a78bfa');

/// Background token. Flips with the theme.
const Color cBg = Color.variable('--bg');

/// Raised surface token (cards, navbar).
const Color cSurface = Color.variable('--surface');

/// Card interior token.
const Color cCard = Color.variable('--card');

/// Hairline border token for glass cards.
const Color cBorder = Color.variable('--border');

/// Primary text token.
const Color cText = Color.variable('--text');

/// Secondary text token.
const Color cTextSecondary = Color.variable('--text-2');

/// Muted / disabled text token.
const Color cMuted = Color.variable('--text-muted');

/// Gradient used for text and accent fills:
/// violet `#a78bfa` through electric blue `#22d3ee`.
const String gradientBrandCss = 'linear-gradient(135deg, #a78bfa 0%, #22d3ee 100%)';

/// Translucent version of the brand gradient for borders and glows.
const String gradientBrandSoftCss =
    'linear-gradient(135deg, rgba(167,139,250,0.55) 0%, rgba(34,211,238,0.55) 100%)';

/// Ambient glow backdrop layered over the page background.
const String gradientGlowCss =
    'radial-gradient(620px circle at 18% -5%, rgba(139,92,246,0.16), transparent 62%)'
    ', radial-gradient(720px circle at 92% 105%, rgba(34,211,238,0.10), transparent 62%)';

/// Subtle blueprint grid line background.
const String gridLineCss =
    'linear-gradient(rgba(139,92,246,0.06) 1px, transparent 1px),'
    ' linear-gradient(90deg, rgba(139,92,246,0.06) 1px, transparent 1px)';

/// Shared content width (in rem) for the page container.
const double containerWidth = 72;