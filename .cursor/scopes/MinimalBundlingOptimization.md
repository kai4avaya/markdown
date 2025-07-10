# Minimal Bundling Optimization Spec

## Purpose & User Problem
The vanilla JS site currently loads slowly due to multiple external library requests (jQuery, FancyTree, Toast UI Editor, Tailwind CSS) and lacks tree-shaking capabilities. This causes poor mobile performance and slow initial load times.

## Success Criteria
- **40-60% reduction in initial load time**
- **Reduce HTTP requests from 8+ to 2-3**
- **Enable tree-shaking for external libraries**
- **Maintain 100% vanilla JS architecture**
- **Zero breaking changes to existing functionality**
- **Optimized for mobile performance**

## Scope & Constraints

### In Scope
1. **CSS Optimization**
   - Bundle Tailwind CSS with purging
   - Combine all CSS files into single optimized bundle
   - Remove unused CSS classes

2. **JavaScript Bundling**
   - Bundle jQuery + FancyTree dependencies
   - Bundle Toast UI Editor separately (heavy component)
   - Keep existing ES module structure intact
   - Add tree-shaking for external libraries

3. **Build Process**
   - Implement esbuild for fast bundling
   - Create development and production builds
   - Maintain current file structure
   - Add source maps for debugging

4. **Performance Optimizations**
   - Code splitting for heavy components
   - Lazy loading for AI chat features
   - Optimize service worker caching

### Out of Scope
- Converting to a framework (React, Vue, etc.)
- Major architectural changes
- Replacing existing libraries
- Adding new features
- Changing the UI/UX

## Technical Considerations

### Current Architecture Analysis
- **ES Modules**: Already well-structured with proper imports/exports
- **External Dependencies**: jQuery (3.6.0), FancyTree, Toast UI Editor, Tailwind
- **Custom Modules**: 15+ well-organized JS modules
- **Service Worker**: Already implemented for caching

### Bundling Strategy
1. **esbuild Configuration**
   - Entry points: `js/app.js` (main), `js/mobileUI.js` (mobile)
   - Output: `dist/` directory
   - Format: ES modules for modern browsers
   - Target: ES2020 for broad compatibility

2. **CSS Processing**
   - Tailwind CSS with JIT compilation
   - PostCSS for optimization
   - CSS purging to remove unused classes
   - Single output file: `dist/styles.css`

3. **JavaScript Bundling**
   - **Bundle 1**: jQuery + FancyTree + dependencies
   - **Bundle 2**: Toast UI Editor (separate due to size)
   - **Bundle 3**: Application modules (existing structure)
   - Tree-shaking enabled for all bundles

### File Structure After Optimization
```
ownCourse2/
├── dist/                    # Built files
│   ├── app.js              # Main application bundle
│   ├── vendor.js           # jQuery + FancyTree bundle
│   ├── editor.js           # Toast UI Editor bundle
│   ├── styles.css          # Optimized CSS bundle
│   └── mobile.js           # Mobile-specific bundle
├── js/                     # Source files (unchanged)
├── css/                    # Source CSS (unchanged)
├── lib/                    # External libraries (for development)
├── build/                  # Build configuration
│   ├── esbuild.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
└── package.json            # Build dependencies
```

## Implementation Plan

### Phase 1: Setup & Configuration (1-2 hours)
1. Initialize npm project
2. Install esbuild, Tailwind CSS, PostCSS
3. Create build configuration files
4. Set up development scripts

### Phase 2: CSS Optimization (1 hour)
1. Configure Tailwind CSS with JIT
2. Set up PostCSS for optimization
3. Create optimized CSS bundle
4. Test CSS purging

### Phase 3: JavaScript Bundling (2-3 hours)
1. Configure esbuild for vendor libraries
2. Bundle jQuery + FancyTree
3. Bundle Toast UI Editor separately
4. Bundle application modules
5. Test tree-shaking

### Phase 4: Integration & Testing (1-2 hours)
1. Update HTML to use bundled files
2. Test all functionality
3. Performance testing
4. Mobile optimization verification

### Phase 5: Advanced Optimizations (1-2 hours)
1. Implement code splitting
2. Add lazy loading for AI features
3. Optimize service worker
4. Final performance testing

## Risk Mitigation

### Potential Issues
1. **jQuery/FancyTree Compatibility**: Bundle as-is, no modifications
2. **Toast UI Editor Issues**: Keep as separate bundle to isolate problems
3. **CSS Conflicts**: Use PostCSS to prevent conflicts
4. **Service Worker**: Update cache strategies for new file structure

### Rollback Plan
- Keep original files in `lib/` directory
- Maintain original HTML structure as backup
- Use feature flags to switch between bundled/unbundled versions

## Performance Targets

### Before Optimization
- **HTTP Requests**: 8+ separate files
- **Total Size**: ~2-3MB (estimated)
- **Load Time**: 3-5 seconds on mobile

### After Optimization
- **HTTP Requests**: 3-4 bundled files
- **Total Size**: ~1-1.5MB (40-50% reduction)
- **Load Time**: 1-2 seconds on mobile

## Success Metrics
- [ ] Lighthouse Performance Score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] All existing functionality works
- [ ] Mobile performance improved by 40%+
- [ ] Bundle size reduced by 40%+

## Dependencies
- **esbuild**: Fast JavaScript bundler
- **tailwindcss**: CSS framework with JIT
- **postcss**: CSS processing
- **autoprefixer**: CSS vendor prefixes
- **cssnano**: CSS minification

## Questions for Clarification
1. Are there any specific mobile devices/browsers to prioritize?
2. Should we implement progressive enhancement for older browsers?
3. Any specific performance budgets to maintain?
4. Should we add build-time analytics to track bundle sizes?

---

**Next Steps**: Review this spec and provide feedback. Once approved, implementation will begin with Phase 1 setup. 