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
    // Check for null, undefined, or empty input
    const inputResult = this.validateInput(configJson);
    if (inputResult) {
      return inputResult;
    }

    // Parse JSON
    const parseResult = this.parseJson(configJson!);
    if (parseResult.errors.length > 0) {
      return { isValid: false, errors: parseResult.errors };
    }

    // Validate root structure
    const structureResult = this.validateRootStructure(parseResult.parsed);
    if (structureResult.errors.length > 0) {
      return { isValid: false, errors: structureResult.errors };
    }

    // Validate mappings array
    const mappingsResult = this.validateMappings(structureResult.config.mappings as unknown[]);

    return mappingsResult.errors.length > 0
      ? { isValid: false, errors: mappingsResult.errors }
      : { isValid: true, errors: [], configuration: { mappings: mappingsResult.validatedMappings } };
  }

  /**
   * Validates input for null, undefined, or empty values.
   * 
   * @param configJson - Input to validate
   * @returns Validation result if input is null/empty, null otherwise
   */
  private static validateInput(configJson: string | null | undefined): IValidationResult | null {
    if (configJson === null || configJson === undefined) {
      return {
        isValid: true,
        errors: [],
        configuration: { mappings: [] },
      };
    }

    if (configJson.trim() === "") {
      return {
        isValid: true,
        errors: [],
        configuration: { mappings: [] },
      };
    }

    return null;
  }

  /**
   * Parses JSON string.
   * 
   * @param configJson - JSON string to parse
   * @returns Parsed object and errors array
   */
  private static parseJson(configJson: string): { parsed: unknown; errors: string[] } {
    try {
      const parsed: unknown = JSON.parse(configJson);
      return { parsed, errors: [] };
    } catch (error) {
      return {
        parsed: null,
        errors: [`Invalid JSON format: ${error instanceof Error ? error.message : String(error)}`],
      };
    }
  }

  /**
   * Validates root structure of parsed configuration.
   * 
   * @param parsed - Parsed JSON object
   * @returns Configuration object and errors array
   */
  private static validateRootStructure(parsed: unknown): { config: Record<string, unknown>; errors: string[] } {
    const errors: string[] = [];

    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      errors.push("Configuration must be a JSON object, not an array or primitive value");
      return { config: {}, errors };
    }

    const config = parsed as Record<string, unknown>;

    if (!("mappings" in config)) {
      errors.push('Configuration must have a "mappings" property');
      return { config: {}, errors };
    }

    if (!Array.isArray(config.mappings)) {
      errors.push('"mappings" must be an array');
      return { config: {}, errors };
    }

    return { config, errors };
  }

  /**
   * Validates all mappings in the configuration.
   * 
   * @param mappings - Array of mapping objects to validate
   * @returns Validated mappings and errors array
   */
  private static validateMappings(mappings: unknown[]): {
    validatedMappings: IDependencyMapping[];
    errors: string[];
  } {
    const errors: string[] = [];
    const validatedMappings: IDependencyMapping[] = [];
    const parentValues = new Set<number>();

    for (let i = 0; i < mappings.length; i++) {
      const mappingResult = this.validateSingleMapping(mappings[i], i, parentValues);
      errors.push(...mappingResult.errors);

      if (mappingResult.mapping) {
        validatedMappings.push(mappingResult.mapping);
      }
    }

    return { validatedMappings, errors };
  }

  /**
   * Validates a single mapping object.
   * 
   * @param mapping - Mapping object to validate
   * @param index - Index of mapping in array
   * @param parentValues - Set of already seen parent values for duplicate detection
   * @returns Validated mapping and errors array
   */
  private static validateSingleMapping(
    mapping: unknown,
    index: number,
    parentValues: Set<number>
  ): { mapping?: IDependencyMapping; errors: string[] } {
    const errors: string[] = [];

    if (typeof mapping !== "object" || mapping === null || Array.isArray(mapping)) {
      errors.push(`Mapping at index ${index} must be an object`);
      return { errors };
    }

    const mappingObj = mapping as Record<string, unknown>;

    // Validate parent value
    const parentValueResult = this.validateParentValue(mappingObj, index, parentValues);
    errors.push(...parentValueResult.errors);

    if (parentValueResult.parentValue === undefined) {
      return { errors };
    }

    // Validate dependent values
    const dependentValuesResult = this.validateDependentValues(mappingObj, index);
    errors.push(...dependentValuesResult.errors);

    if (dependentValuesResult.dependentValues === undefined) {
      return { errors };
    }

    return {
      mapping: {
        parentValue: parentValueResult.parentValue,
        dependentValues: dependentValuesResult.dependentValues,
      },
      errors,
    };
  }

  /**
   * Validates parent value property of a mapping.
   * 
   * @param mappingObj - Mapping object
   * @param index - Index of mapping in array
   * @param parentValues - Set of already seen parent values
   * @returns Parent value and errors array
   */
  private static validateParentValue(
    mappingObj: Record<string, unknown>,
    index: number,
    parentValues: Set<number>
  ): { parentValue?: number; errors: string[] } {
    const errors: string[] = [];

    if (!("parentValue" in mappingObj)) {
      errors.push(`Mapping at index ${index} is missing "parentValue" property`);
      return { errors };
    }

    if (typeof mappingObj.parentValue !== "number" || Number.isNaN(mappingObj.parentValue)) {
      errors.push(`Mapping at index ${index} has invalid "parentValue": must be a number`);
      return { errors };
    }

    const parentValue = mappingObj.parentValue;

    if (parentValues.has(parentValue)) {
      errors.push(`Duplicate parentValue ${parentValue} found at index ${index}`);
      return { errors };
    }

    parentValues.add(parentValue);
    return { parentValue, errors };
  }

  /**
   * Validates dependent values array of a mapping.
   * 
   * @param mappingObj - Mapping object
   * @param index - Index of mapping in array
   * @returns Dependent values array and errors array
   */
  private static validateDependentValues(
    mappingObj: Record<string, unknown>,
    index: number
  ): { dependentValues?: number[]; errors: string[] } {
    const errors: string[] = [];

    if (!("dependentValues" in mappingObj)) {
      errors.push(`Mapping at index ${index} is missing "dependentValues" property`);
      return { errors };
    }

    if (!Array.isArray(mappingObj.dependentValues)) {
      errors.push(`Mapping at index ${index} has invalid "dependentValues": must be an array`);
      return { errors };
    }

    const dependentValues: number[] = [];
    const elementErrors = this.validateDependentValuesElements(mappingObj.dependentValues, index, dependentValues);
    errors.push(...elementErrors);

    if (elementErrors.length > 0) {
      return { errors };
    }

    // Check for duplicates
    const duplicateErrors = this.checkDuplicateDependentValues(dependentValues, index);
    errors.push(...duplicateErrors);

    return { dependentValues, errors };
  }

  /**
   * Validates individual elements in dependent values array.
   * 
   * @param dependentValues - Array to validate
   * @param index - Index of parent mapping
   * @param validValues - Array to populate with valid values
   * @returns Errors array
   */
  private static validateDependentValuesElements(
    dependentValues: unknown[],
    index: number,
    validValues: number[]
  ): string[] {
    const errors: string[] = [];

    for (let j = 0; j < dependentValues.length; j++) {
      const element = dependentValues[j];
      if (typeof element !== "number" || Number.isNaN(element)) {
        errors.push(`Mapping at index ${index}, dependentValues[${j}]: "${String(element)}" is not a number`);
      } else {
        validValues.push(element);
      }
    }

    return errors;
  }

  /**
   * Checks for duplicate values in dependent values array.
   * 
   * @param dependentValues - Array to check
   * @param index - Index of parent mapping
   * @returns Errors array
   */
  private static checkDuplicateDependentValues(dependentValues: number[], index: number): string[] {
    const uniqueValues = new Set(dependentValues);
    if (uniqueValues.size !== dependentValues.length) {
      const duplicates = this.findDuplicates(dependentValues);
      return [`Mapping at index ${index} has duplicate dependentValues: [${duplicates.join(", ")}]`];
    }
    return [];
  }

  /**
   * Finds duplicate values in an array.
   * 
   * @param values - Array to check
   * @returns Array of duplicate values
   */
  private static findDuplicates(values: number[]): number[] {
    return values.filter((val, idx) => values.indexOf(val) !== idx);
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
