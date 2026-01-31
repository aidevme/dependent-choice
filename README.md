# DependentChoice PCF Control

A Power Apps Component Framework (PCF) control that provides dynamic filtering for dependent choice/option set fields in Dynamics 365 and Power Apps. Built with React 16.14 and Fluent UI v9.

## 🌟 Features

- **Dynamic Filtering**: Automatically filters dependent choice options based on parent choice selection
- **Flexible Configuration**: JSON-based mapping configuration for easy customization
- **Multi-Select Support**: Works with both single-select and multi-select option sets
- **Fluent UI Integration**: Modern UI with theme support and accessibility
- **Metadata Service**: WebAPI-based metadata retrieval with 5-minute caching
- **Auto-Cleanup**: Automatically removes invalid selections when parent changes
- **Configuration Validation**: Validates JSON configuration on load with user-friendly error dialog
- **Multi-Language Support**: Fully localized in 14 languages
- **TypeScript**: Fully typed for better development experience
- **Performance Optimized**: Uses React hooks and memoization for efficient rendering

## 🌍 Supported Languages

The control is fully localized and supports the following languages:

- ![us](https://flagcdn.com/w20/us.png) **English (1033)** - English
- ![cz](https://flagcdn.com/w20/cz.png) **Czech (1029)** - Čeština
- ![dk](https://flagcdn.com/w20/dk.png) **Danish (1030)** - Dansk
- ![de](https://flagcdn.com/w20/de.png) **German (1031)** - Deutsch
- ![gr](https://flagcdn.com/w20/gr.png) **Greek (1032)** - Ελληνικά
- ![fr](https://flagcdn.com/w20/fr.png) **French (1036)** - Français
- ![hu](https://flagcdn.com/w20/hu.png) **Hungarian (1038)** - Magyar
- ![it](https://flagcdn.com/w20/it.png) **Italian (1040)** - Italiano
- ![jp](https://flagcdn.com/w20/jp.png) **Japanese (1041)** - 日本語
- ![kr](https://flagcdn.com/w20/kr.png) **Korean (1042)** - 한국어
- ![pl](https://flagcdn.com/w20/pl.png) **Polish (1045)** - Polski
- ![ru](https://flagcdn.com/w20/ru.png) **Russian (1049)** - Русский
- ![sk](https://flagcdn.com/w20/sk.png) **Slovak (1051)** - Slovenčina
- ![se](https://flagcdn.com/w20/se.png) **Swedish (1053)** - Svenska
- ![ua](https://flagcdn.com/w20/ua.png) **Ukrainian (1058)** - Українська
- ![vn](https://flagcdn.com/w20/vn.png) **Vietnamese (1066)** - Tiếng Việt
- ![pt](https://flagcdn.com/w20/pt.png) **Portuguese - Portugal (2070)** - Português
- ![es](https://flagcdn.com/w20/es.png) **Spanish - Spain (3082)** - Español

The control automatically displays in the user's language based on their Dynamics 365/Power Apps language settings.

## 📋 Use Cases

Perfect for scenarios like:
- **Geographic Relationships**: Continent → Country → State → City
- **Product Hierarchies**: Category → Subcategory → Product
- **Organizational Structures**: Department → Team → Role
- **Classification Systems**: Industry → Sector → Subsector

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Power Apps CLI (`pac`)
- Visual Studio Code (recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aidevme/dependent-choice.git
   cd dependent-choice
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the control**
   ```bash
   npm run build
   ```

4. **Run in watch mode** (for development)
   ```bash
   npm start watch
   ```

## 🔧 Configuration

### Manifest Properties

The control defines three properties in `ControlManifest.Input.xml`:

1. **dependentChoice** (Required, Bound)
   - The dependent choice field that will be filtered
   - Supports: `OptionSet` and `MultiSelectOptionSet`

2. **parentChoice** (Required, Bound)
   - The parent choice field that drives the filtering
   - Supports: `OptionSet` and `MultiSelectOptionSet`

3. **configurationParameters** (Input)
   - JSON configuration for mapping parent-to-dependent values
   - Type: Multiple (multi-line text)

### Configuration JSON Format

The `configurationParameters` property expects a JSON string with the following structure:

```json
{
  "mappings": [
    {
      "parentValue": 1,
      "dependentValues": [100, 101, 102, 103]
    },
    {
      "parentValue": 2,
      "dependentValues": [200, 201, 202]
    },
    {
      "parentValue": 3,
      "dependentValues": []
    }
  ]
}
```

**Important**: The JSON must be **minified** (single line) when entering into Power Apps.

### Example: Continent-Country Mapping

The repository includes a complete example in `DependentChoice/statics/configurationParameters.json` that maps 7 continents to 195 countries:

```json
{
  "mappings": [
    {
      "parentValue": 1,
      "dependentValues": [100000002, 100000004, 100000018, ...]
    },
    {
      "parentValue": 2,
      "dependentValues": []
    }
  ]
}
```

To use this configuration, minify the JSON:

```bash
# Use any JSON minifier or paste into Power Apps as a single line
{"mappings":[{"parentValue":1,"dependentValues":[100000002,100000004,...]},{"parentValue":2,"dependentValues":[]}]}
```

## 📦 Deployment

### Option 1: Deploy to Dataverse

1. **Build the solution**
   ```bash
   npm run build
   ```

2. **Create solution package**
   ```bash
   cd Solution/DependentChoiceSolution
   msbuild /t:restore
   msbuild /p:Configuration=Release
   ```

3. **Import to Dataverse**
   - Navigate to your Power Apps environment
   - Go to Solutions → Import
   - Select the generated `.zip` file from `Solution/DependentChoiceSolution/bin/Release`

### Option 2: Use PAC CLI

```bash
# Authenticate
pac auth create --url https://your-org.crm.dynamics.com

# Push control
pac pcf push --publisher-prefix aidevme
```

## 🎨 Usage in Power Apps

### 1. Add Fields to Form

1. Open your Dataverse table form in the form designer
2. Add the **parent choice field** (e.g., Continent)
3. Add the **dependent choice field** (e.g., Country)

### 2. Configure the Control

1. Select the **dependent choice field**
2. Click **+ Component** in the properties panel
3. Select **DependentChoice** from the list
4. Configure the properties:
   - **dependentChoice**: Bind to your dependent field (e.g., Country)
   - **parentChoice**: Bind to your parent field (e.g., Continent)
   - **configurationParameters**: Paste your minified JSON configuration

### 3. Test the Filtering

1. Save and publish the form
2. Open a record
3. Select a value in the parent choice field
4. Observe the dependent choice field automatically filter

## 🏗️ Project Structure

```
dependent-choice/
├── DependentChoice/
│   ├── components/
│   │   └── DependentChoice.tsx          # Main React component
│   ├── services/
│   │   ├── ChoiceService/
│   │   │   └── ChoiceService.ts         # Mock data service
│   │   ├── DependencyMappingService/
│   │   │   └── DependencyMappingService.ts  # Filtering logic
│   │   └── PcfContextService/
│   │       ├── PcfContext.tsx           # React context provider
│   │       └── PcfContextService.ts     # PCF context wrapper
│   ├── statics/
│   │   ├── configurationParameters.json # Example configuration
│   │   └── mockChoices.json            # Mock data for testing
│   ├── strings/                        # Localization files
│   ├── styles/
│   │   └── Styles.ts                   # Fluent UI styles
│   ├── ControlManifest.Input.xml       # PCF manifest
│   ├── DependentChoiceApp.tsx          # React app wrapper
│   └── index.ts                        # PCF control entry point
├── Solution/                           # Dataverse solution
├── .github/
│   └── copilot-instructions.md         # Development guidelines
├── eslint.config.mjs                   # ESLint configuration
├── package.json                        # npm dependencies
├── pcfconfig.json                      # PCF build configuration
└── tsconfig.json                       # TypeScript configuration
```

## 🔍 How It Works

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│ PCF Control (index.ts)                                      │
│  ├── Reads parent choice value                              │
│  ├── Reads configuration parameters                         │
│  └── Passes props to React app                              │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ DependentChoiceApp.tsx                                      │
│  ├── Creates PcfContextService                              │
│  │   └── Initializes DependencyMappingService               │
│  ├── Provides theme and context to components               │
│  └── Renders DependentChoice component                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ DependentChoice.tsx                                         │
│  ├── Monitors parent choice value changes                   │
│  ├── Uses DependencyMappingService to get allowed values    │
│  ├── Filters options based on mapping                       │
│  └── Renders Fluent UI Dropdown with filtered options       │
└─────────────────────────────────────────────────────────────┘
```

### Filtering Logic

1. **Parent Value Change**: User selects a value in the parent choice field
2. **Get Mapping**: `DependencyMappingService.getDependentValues(parentValue)` retrieves allowed values
3. **Filter Options**: Only options with values in the allowed list are shown
4. **Special Cases**:
   - No mapping found → Show all options (fail-safe)
   - Empty array mapping → Show no options (explicit restriction)
   - Currently selected value → Always kept visible even if not in mapping

## 🛠️ Development

### Prerequisites

```bash
# Install ESLint (required by pcf-scripts)
npm install
```

### Build Commands

- **`npm run build`** - Full build (validates manifest, runs ESLint, compiles TypeScript, bundles)
- **`npm run refreshTypes`** - Regenerate ManifestTypes.d.ts after editing manifest
- **`npm start watch`** - Development mode with auto-rebuild
- **`npm run lint:fix`** - Auto-fix ESLint issues

### Code Style

- **PascalCase**: Components, interfaces, classes (`DependentChoice`, `IInputs`)
- **camelCase**: Variables, functions, properties (`handleChange`, `parentValue`)
- **TSDoc**: All public APIs must be documented

### Debugging

The control includes extensive console logging for troubleshooting:

```javascript
// Check console for these logs:
"DependencyMappingService: initialize called with:" // Configuration received
"DependencyMappingService: Configuration loaded successfully" // Parsing succeeded
"DependentChoice: Filtering options" // Filter triggered
"DependentChoice: Parent values to check:" // Parent value detected
"DependentChoice: Got dependent values for parent X:" // Allowed values retrieved
"DependentChoice: Filtered options count:" // Final result
```

## 🧪 Testing

### Local Testing with Mock Data

The control uses mock data from `statics/mockChoices.json` when running in design mode:

- **Parent Choices**: 7 continents (Africa, Antarctica, Asia, Europe, North America, Oceania, South America)
- **Dependent Choices**: 195 countries with proper continental assignments

### Design Mode Detection

Design mode is automatically detected for:
- `make.powerapps.com` (Commercial)
- `make.gov.powerapps.us` (GCC)
- `make.high.powerapps.us` (GCC High)
- `make.apps.appsplatform.us` (DoD)
- `localhost` (Local development)

## 📝 Customization

### Creating Your Own Mappings

1. **Identify Your Option Values**
   ```javascript
   // Use browser console in Power Apps form
   // Check the option set values for your fields
   ```

2. **Create Configuration**
   ```json
   {
     "mappings": [
       {
         "parentValue": <your_parent_value>,
         "dependentValues": [<dependent_value_1>, <dependent_value_2>, ...]
       }
     ]
   }
   ```

3. **Minify JSON**
   - Remove all whitespace and newlines
   - Paste as single line into configurationParameters property

4. **Test**
   - Save form
   - Test parent-dependent filtering behavior

### Extending the Control

To add custom features:

1. **Modify the Component** - Edit `DependentChoice/components/DependentChoice.tsx`
2. **Add New Services** - Create in `DependentChoice/services/`
3. **Update Manifest** - Add properties in `ControlManifest.Input.xml`
4. **Regenerate Types** - Run `npm run refreshTypes`
5. **Rebuild** - Run `npm run build`

## 🐛 Troubleshooting

### Control Not Filtering

**Check Console Logs**:
1. Open browser developer console (F12)
2. Look for initialization logs
3. Verify configuration is loaded
4. Check parent value detection

**Common Issues**:
- Configuration not provided or malformed JSON
- Parent value doesn't match mapping keys
- Option values don't match mapping values

### Build Errors

**ESLint Not Found**:
```bash
npm install
```

**Type Errors**:
```bash
npm run refreshTypes
```

**Cache Issues**:
```bash
# Clear build artifacts
Remove-Item -Recurse -Force obj, out
npm run build
```

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Power Apps Component Framework (PCF)](https://learn.microsoft.com/power-apps/developer/component-framework/overview)
- UI components from [Fluent UI v9](https://react.fluentui.dev/)
- Country data sourced from public domain

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/aidevme/dependent-choice/issues)
- **Discussions**: [GitHub Discussions](https://github.com/aidevme/dependent-choice/discussions)

## 🔗 Related Resources

- [PCF Documentation](https://learn.microsoft.com/power-apps/developer/component-framework/)
- [Fluent UI React](https://react.fluentui.dev/)
- [Power Apps Community](https://powerusers.microsoft.com/t5/Power-Apps-Community/ct-p/PowerApps1)

---

**Made with ❤️ for the Power Platform Community**