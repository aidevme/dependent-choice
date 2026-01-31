/**
 * Interface representing a single parent-to-dependent mapping.
 */
export interface IDependencyMapping {
  /** The parent choice value */
  parentValue: number;
  /** Array of dependent choice values that are valid for this parent value */
  dependentValues: number[];
}

/**
 * Interface for the complete dependency configuration.
 */
export interface IDependencyConfiguration {
  /** Array of parent-to-dependent mappings */
  mappings: IDependencyMapping[];
}

/**
 * Type representing the expected structure of configuration parameters.
 * Maps parent choice values (as strings) to arrays of dependent choice values.
 */
export type IConfigurationParameters = Record<string, number[]>;

/**
 * Interface for validation results.
 */
export interface IValidationResult {
  /** Whether the configuration is valid */
  isValid: boolean;
  /** Array of error messages if validation failed */
  errors: string[];
  /** Parsed configuration if valid */
  configuration?: IDependencyConfiguration;
}

/**
 * Utility class for validating configuration parameters JSON.
 * 
 * @remarks
 * This validator ensures that the configurationParameters property contains
 * valid JSON with the correct structure for parent-to-dependent mappings.
 * 
 * Expected format:
 * ```json
 * {
 *   "mappings": [
 *     {
 *       "parentValue": 1,
 *       "dependentValues": [11, 12, 13]
 *     },
 *     {
 *       "parentValue": 2,
 *       "dependentValues": [21, 22, 23]
 *     }
 *   ]
 * }
 * ```
 */
export class ConfigurationValidator {
  /**
   * Validates configuration parameters JSON string.
   * 
   * @param configJson - JSON string to validate
   * @returns Validation result with isValid flag, errors array, and parsed configuration
   * 
   * @example
   * ```typescript
   * const config = '{"mappings":[{"parentValue":1,"dependentValues":[11,12,13]}]}';
   * const result = ConfigurationValidator.validate(config);
   * if (result.isValid) {
   *   console.log("Valid configuration:", result.configuration);
   * } else {
   *   console.error("Errors:", result.errors);
   * }
   * ```
   */
  public static validate(configJson: string | null | undefined): IValidationResult {
    const errors: string[] = [];

    // Check if null or undefined
    if (configJson === null || configJson === undefined) {
      return {
        isValid: true, // Empty configuration is valid (no mappings)
        errors: [],
        configuration: { mappings: [] },
      };
    }

    // Check if empty string
    if (configJson.trim() === "") {
      return {
        isValid: true,
        errors: [],
        configuration: { mappings: [] },
      };
    }

    // Try to parse JSON
    let parsed: unknown;
    try {
      parsed = JSON.parse(configJson);
    } catch (error) {
      errors.push(`Invalid JSON format: ${error instanceof Error ? error.message : String(error)}`);
      return {
        isValid: false,
        errors,
      };
    }

    // Check if parsed result is an object
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      errors.push("Configuration must be a JSON object, not an array or primitive value");
      return {
        isValid: false,
        errors,
      };
    }

    const config = parsed as Record<string, unknown>;

    // Check if "mappings" property exists
    if (!("mappings" in config)) {
      errors.push('Configuration must have a "mappings" property');
      return {
        isValid: false,
        errors,
      };
    }

    // Validate mappings is an array
    if (!Array.isArray(config.mappings)) {
      errors.push('"mappings" must be an array');
      return {
        isValid: false,
        errors,
      };
    }

    // Validate each mapping
    const validatedMappings: IDependencyMapping[] = [];
    const parentValues = new Set<number>();

    for (let i = 0; i < config.mappings.length; i++) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const mapping = config.mappings[i];

      // Check if mapping is an object
      if (typeof mapping !== "object" || mapping === null || Array.isArray(mapping)) {
        errors.push(`Mapping at index ${i} must be an object`);
        continue;
      }

      const mappingObj = mapping as Record<string, unknown>;

      // Validate parentValue
      if (!("parentValue" in mappingObj)) {
        errors.push(`Mapping at index ${i} is missing "parentValue" property`);
        continue;
      }

      if (typeof mappingObj.parentValue !== "number" || isNaN(mappingObj.parentValue)) {
        errors.push(`Mapping at index ${i} has invalid "parentValue": must be a number`);
        continue;
      }

      const parentValue = mappingObj.parentValue;

      // Check for duplicate parent values
      if (parentValues.has(parentValue)) {
        errors.push(`Duplicate parentValue ${parentValue} found at index ${i}`);
        continue;
      }
      parentValues.add(parentValue);

      // Validate dependentValues
      if (!("dependentValues" in mappingObj)) {
        errors.push(`Mapping at index ${i} is missing "dependentValues" property`);
        continue;
      }

      if (!Array.isArray(mappingObj.dependentValues)) {
        errors.push(`Mapping at index ${i} has invalid "dependentValues": must be an array`);
        continue;
      }

      // Validate each dependent value
      const dependentValues: number[] = [];
      let hasInvalidElement = false;

      for (let j = 0; j < mappingObj.dependentValues.length; j++) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const element = mappingObj.dependentValues[j];
        if (typeof element !== "number" || isNaN(element)) {
          errors.push(`Mapping at index ${i}, dependentValues[${j}]: "${String(element)}" is not a number`);
          hasInvalidElement = true;
        } else {
          dependentValues.push(element);
        }
      }

      if (hasInvalidElement) {
        continue;
      }

      // Check for duplicates in dependentValues
      const uniqueValues = new Set(dependentValues);
      if (uniqueValues.size !== dependentValues.length) {
        const duplicates = dependentValues.filter((val, idx) => dependentValues.indexOf(val) !== idx);
        errors.push(`Mapping at index ${i} has duplicate dependentValues: [${duplicates.join(", ")}]`);
      }

      validatedMappings.push({
        parentValue,
        dependentValues,
      });
    }

    // Return result
    if (errors.length > 0) {
      return {
        isValid: false,
        errors,
      };
    }

    return {
      isValid: true,
      errors: [],
      configuration: { mappings: validatedMappings },
    };
  }

  /**
   * Validates and logs results to console.
   * 
   * @param configJson - JSON string to validate
   * @param logPrefix - Optional prefix for log messages
   * @returns True if valid, false otherwise
   * 
   * @example
   * ```typescript
   * if (ConfigurationValidator.validateAndLog(config, "MyControl")) {
   *   console.log("Proceeding with valid configuration");
   * }
   * ```
   */
  public static validateAndLog(configJson: string | null | undefined, logPrefix = "ConfigurationValidator"): boolean {
    const result = this.validate(configJson);

    if (result.isValid) {
      console.log(`${logPrefix}: Configuration is valid`);
      if (result.configuration && result.configuration.mappings.length > 0) {
        console.log(`${logPrefix}: Mappings count:`, result.configuration.mappings.length);
      }
      return true;
    } else {
      console.error(`${logPrefix}: Configuration validation failed`);
      result.errors.forEach(error => {
        console.error(`${logPrefix}: - ${error}`);
      });
      return false;
    }
  }
}
