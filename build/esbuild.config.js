const esbuild = require('esbuild');

// Main application bundle
esbuild.build({
  entryPoints: ['js/app.js', 'js/mobileUI.js'],
  bundle: true,
  outdir: 'dist',
  splitting: true,
  format: 'esm',
  sourcemap: true,
  target: ['es2020'],
  loader: { '.css': 'css' },
  external: [],
}).catch(() => process.exit(1));

// Vendor bundle (jQuery, FancyTree, Toast UI)
esbuild.build({
  entryPoints: [
    'lib/js/jquery-3.6.0.min.js',
    'lib/js/jquery-ui.min.js',
    'lib/js/jquery.fancytree-all-deps.min.js',
    'lib/js/toastui-editor-all.min.js',
  ],
  bundle: true,
  outdir: 'dist',
  splitting: false,
  format: 'iife',
  sourcemap: true,
  target: ['es2020'],
  outbase: 'lib/js',
  outExtension: { '.js': '.vendor.js' },
}).catch(() => process.exit(1));

// CSS bundle with Tailwind v4
esbuild.build({
  entryPoints: ['css/styles.css'],
  bundle: true,
  outdir: 'dist',
  format: 'iife',
  sourcemap: true,
  target: ['es2020'],
  loader: { '.css': 'css' },
  minify: true,
}).catch(() => process.exit(1)); 