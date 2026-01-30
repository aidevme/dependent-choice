# DependentChoice PCF Control

Power Apps Component Framework (PCF) control for dependent choice/option set fields in Dynamics 365/Dataverse using React 16.14 and Fluent UI v9.

## Project Architecture

**PCF React Control Pattern:**
- [DependentChoice/index.ts](DependentChoice/index.ts): Main PCF control class implementing `ComponentFramework.ReactControl<IInputs, IOutputs>`
- [DependentChoice/DependentChoiceApp.tsx](DependentChoice/DependentChoiceApp.tsx): React app entry with FluentProvider and PcfContextProvider wrappers
- [DependentChoice/components/](DependentChoice/components/): React components (currently DependentChoice.tsx)
- [DependentChoice/services/PcfContextService.ts](DependentChoice/services/PcfContextService.ts): Service class wrapping PCF context with helper methods

**Key Pattern:** PCF lifecycle methods (`init`, `updateView`, `getOutputs`, `destroy`) bridge to React via `React.createElement()`. The PcfContextService wraps the PCF context and is provided via React Context to all child components.

**Generated Files:** [DependentChoice/generated/ManifestTypes.d.ts](DependentChoice/generated/ManifestTypes.d.ts) is auto-generated from [ControlManifest.Input.xml](DependentChoice/ControlManifest.Input.xml) - never edit directly.

## Build & Development Workflow

**Critical:** Always run `npm install` first to ensure `eslint` and all dependencies are installed (pcf-scripts requires eslint but doesn't include it).

**Build Commands:**
- `npm run build` - Full build (validates manifest, runs ESLint, compiles TypeScript, bundles with Webpack)
- `npm run refreshTypes` - Regenerate ManifestTypes.d.ts after editing ControlManifest.Input.xml
- `npm start watch` - Development mode with auto-rebuild
- `npm run lint:fix` - Auto-fix ESLint issues

**Output:** Built control goes to `out/controls/` (configured in pcfconfig.json)

## Manifest-Driven Development

[ControlManifest.Input.xml](DependentChoice/ControlManifest.Input.xml) defines:
- Control properties: `dependentChoice`, `parentChoice`, `configurationParameters`
- Type groups: `choiceTypes` supports `OptionSet` and `MultiSelectOptionSet`
- External libraries: React 16.14.0, Fluent UI 9.68.0
- Localization: `.resx` files in [strings/](DependentChoice/strings/)

**After modifying manifest:** Always run `npm run refreshTypes` to update generated types before building.

## PCF Context Service Pattern

[PcfContextService.ts](DependentChoice/services/PcfContextService.ts) provides:
- Theme detection: `getTheme()` returns Fluent theme from `context.fluentDesignLanguage.tokenTheme`
- Form factor detection: `formFactor` is "small" for phone or width < 350px
- Environment helpers: `inDesignMode()` detects PowerApps maker portal (including GCC/DoD clouds), `isCanvasApp()`, `isControlDisabled()`
- Entity context: `getEntityTypeName()`, `getEntityId()` (uses `@ts-expect-error` for contextInfo casting)

**Usage in components:** Call `usePcfContext()` hook to access service instance.

## Code Style & Conventions

**Naming:**
- **PascalCase:** Components, interfaces, type aliases (`DependentChoice`, `IInputs`, `PcfContextService`)
- **camelCase:** Variables, functions, methods, properties (`handleChange`, `instanceid`, `notifyOutputChanged`)
- **Underscore prefix:** Private class members (not used in current codebase but documented convention)
- **ALL_CAPS:** Constants (not present yet but reserved pattern)

**TSDoc:** Document all public APIs, components, hooks, and utilities. See: https://tsdoc.org/

**ESLint Config:** Flat config using typescript-eslint, Microsoft Power Apps plugin, React plugin. Ignores `**/generated` directory. TypeScript strict type checking enabled.