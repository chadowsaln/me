/// Entrypoint for the **server** (pre-render) environment.
///
/// Renders the full document shell: `<html>`, `<head>` (title + meta) and the
/// global stylesheet, then mounts the [App] component tree.
///
/// Hydration happens through `main.client.dart`; both entrypoints keep their
/// generated `*.options.dart` siblings untouched.
library;

import 'package:jaspr/server.dart';

import 'app.dart';
import 'core/global_styles.dart';
import 'main.server.options.dart';

void main() {
  Jaspr.initializeApp(
    options: defaultServerOptions,
  );

  runApp(Document(
    title: 'Shadow Dev — Flutter Developer & Software Engineer',
    lang: 'en',
    charset: 'utf-8',
    viewport: 'width=device-width, initial-scale=1',
    meta: {
      'description': 'Shadow Dev — Flutter Developer building mobile and web'
        ' apps with clean, responsive, open-source-minded code.',
      'theme-color': '#070a16',
      'og:type': 'website',
      'og:site_name': 'Shadow Dev',
      'og:title': 'Shadow Dev — Flutter Developer & Software Engineer',
      'og:description': 'Flutter Developer building mobile and web apps with'
        ' clean, responsive, open-source-minded code.',
    },
    styles: globalStyles,
    body: const App(),
  ));
}