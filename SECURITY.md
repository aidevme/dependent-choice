# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.0.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of the DependentChoice PCF control seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Please Do Not

- **Do not** open a public GitHub issue for security vulnerabilities
- **Do not** disclose the vulnerability publicly until it has been addressed
- **Do not** exploit the vulnerability for malicious purposes

### How to Report

**Email**: Please send security reports to: [security@aidevme.com](mailto:security@aidevme.com)

**Include in your report**:
1. Description of the vulnerability
2. Steps to reproduce the issue
3. Potential impact of the vulnerability
4. Suggested fix (if any)
5. Your name/handle for acknowledgment (optional)

### What to Expect

- **Initial Response**: Within 48 hours acknowledging receipt
- **Assessment**: We will investigate and assess the severity
- **Updates**: Regular updates on the progress (every 7 days minimum)
- **Fix Timeline**: 
  - Critical: Within 7 days
  - High: Within 14 days
  - Medium: Within 30 days
  - Low: Within 60 days
- **Disclosure**: Once fixed, we will publicly disclose with credit to reporter (if desired)

## Security Considerations

### Input Validation

The control validates and sanitizes all inputs:

- **Configuration Parameters**: JSON is parsed with error handling to prevent malformed data
- **Parent/Dependent Values**: Numeric values are validated before processing
- **User Input**: All user selections are validated against allowed option values

### Data Handling

- **No External API Calls**: The control does not make any external HTTP requests
- **Client-Side Only**: All filtering logic runs client-side in the browser
- **No Data Storage**: The control does not store or persist any user data
- **Context Isolation**: Uses React Context pattern to isolate component data

### Configuration Security

**configurationParameters Property**:
- Expected format: JSON string
- Parsed with try-catch to prevent crashes
- Invalid JSON defaults to showing all options (fail-safe)
- No code execution - pure data parsing only

**Example of safe configuration**:
```json
{
  "mappings": [
    {
      "parentValue": 1,
      "dependentValues": [100, 101, 102]
    }
  ]
}
```

### Recommended Practices

When deploying the DependentChoice control:

1. **Review Configuration**: Validate JSON configuration before deployment
2. **Test Thoroughly**: Test with various parent-dependent combinations
3. **Least Privilege**: Grant only necessary permissions to users/roles
4. **Monitor Logs**: Check browser console for any errors or warnings
5. **Keep Updated**: Apply security patches when released

### Dataverse Security

The control respects Dataverse security:

- **Field-Level Security**: Honors field-level security settings
- **User Permissions**: Only shows data the user has access to
- **Audit Logging**: All changes are logged through Dataverse
- **Role-Based Access**: Respects role assignments and privileges

### Known Limitations

1. **Client-Side Filtering**: Filtering happens client-side; all option metadata is visible in browser
2. **Configuration Visibility**: Configuration JSON is visible in form customizations
3. **Console Logging**: Debug logs may expose option values in browser console

### XSS Protection

The control protects against Cross-Site Scripting (XSS):

- Uses React's built-in XSS protection (escapes all rendered content)
- No `dangerouslySetInnerHTML` usage
- No direct DOM manipulation
- Fluent UI components with built-in sanitization

### Dependency Security

We monitor dependencies for vulnerabilities using:

- npm audit
- Dependabot alerts
- Regular dependency updates

**Critical Dependencies**:
- React 16.14.0 (via Power Platform)
- Fluent UI v9.46.2+ (via Power Platform)
- TypeScript 4.x+

Run security audit:
```bash
npm audit
npm audit fix
```

### Content Security Policy (CSP)

The control is compatible with Content Security Policy headers:

- No inline scripts
- No eval() usage
- No inline styles (uses CSS-in-JS)
- All resources loaded from approved domains

### Secure Development

Our development practices:

- **Code Review**: All changes require review before merge
- **TypeScript**: Strong typing to prevent runtime errors
- **ESLint**: Automated code quality and security checks
- **Testing**: Comprehensive testing before release
- **Version Control**: All changes tracked in Git

### Privacy

The control does not:

- Collect telemetry or analytics
- Send data to external services
- Store cookies or local storage data
- Track user behavior
- Access user credentials

The control only:

- Reads field values from Dataverse
- Filters options based on configuration
- Updates field values when user makes selection

## Security Updates

Security updates will be released as follows:

1. **Critical**: Immediate patch release
2. **High**: Patch within 7 days
3. **Medium**: Next minor version
4. **Low**: Next major version

Updates will be announced via:

- GitHub Security Advisories
- GitHub Releases
- Repository README

## Compliance

This control is designed to be compatible with:

- **SOC 2**: No external data processing
- **GDPR**: No personal data collection
- **HIPAA**: No PHI processing or storage
- **FedRAMP**: Compatible with government cloud environments

**Note**: Compliance responsibility ultimately lies with the implementing organization.

## Attribution

We believe in responsible disclosure and will credit security researchers who report vulnerabilities (with their permission).

## Questions?

If you have questions about this security policy, please open a [GitHub Discussion](https://github.com/aidevme/dependent-choice/discussions) or email [security@aidevme.com](mailto:security@aidevme.com).

---

**Last Updated**: January 30, 2026  
**Policy Version**: 1.0