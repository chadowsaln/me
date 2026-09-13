import 'package:jaspr/dom.dart';
import 'package:jaspr/jaspr.dart';

/// Root component of the Shadow Dev portfolio.
///
/// Rendered once on the server during pre-rendering and hydrated (because of
/// `@client`) into an interactive client-side tree. Hosts the ambient page
/// background and the single-page layout.
@client
class App extends StatelessComponent {
  const App({super.key});

  @override
  Component build(BuildContext context) {
    return div(classes: 'site', [
      const PageBackground(),
      div(classes: 'container', [
        div(classes: 'scaffold-note', [
          span([], classes: 'scaffold-note-dot'),
          p([.text('Shadow Dev — portfolio sections land on the next pass.')]),
        ]),
      ]),
    ]);
  }
}

/// Fixed ambient background: deep-navy base + radial glow + blueprint grid.
class PageBackground extends StatelessComponent {
  const PageBackground({super.key});

  @override
  Component build(BuildContext context) {
    return Component.fragment([
      div([], classes: 'page-bg', attributes: {'aria-hidden': 'true'}),
      div([], classes: 'page-grid', attributes: {'aria-hidden': 'true'}),
    ]);
  }
}