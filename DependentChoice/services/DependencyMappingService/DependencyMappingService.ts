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
 * Service for managing dependency mappings between parent and dependent choice fields.
 * 
 * @remarks
 * This service parses and provides access to the configuration that defines which
 * dependent choice values are available for each parent choice value.
 */
export class DependencyMappingService {
  private configuration: IDependencyConfiguration | null = null;

  /**
   * Initializes the service with a configuration JSON string.
   * 
   * @param configJson - JSON string containing the dependency configuration
   * 
   * @example
   * ```typescript
   * const service = new DependencyMappingService();
   * service.initialize('{"mappings":[{"parentValue":1,"dependentValues":[101,102]}]}');
   * ```
   */
  public initialize(configJson: string | null): void {
    console.log("DependencyMappingService: initialize called with:", configJson);
    
    if (!configJson) {
      console.warn("DependencyMappingService: No configuration provided");
      this.configuration = null;
      return;
    }

    try {
      this.configuration = JSON.parse(configJson) as IDependencyConfiguration;
      console.log("DependencyMappingService: Configuration loaded successfully", {
        mappingCount: this.configuration.mappings?.length,
        configuration: this.configuration
      });
    } catch (error) {
      console.error("DependencyMappingService: Failed to parse configuration", error);
      this.configuration = null;
    }
  }

  /**
   * Gets the allowed dependent values for a given parent value.
   * 
   * @param parentValue - The parent choice value to get dependent values for
   * @returns Array of allowed dependent choice values, or null if no restrictions
   * 
   * @example
   * ```typescript
   * const allowedValues = service.getDependentValues(1);
   * // Returns: [101, 102, 103]
   * ```
   */
  public getDependentValues(parentValue: number | null): number[] | null {
    if (!this.configuration || parentValue === null || parentValue === -1) {
      return null;
    }

    const mapping = this.configuration.mappings.find(
      (m) => m.parentValue === parentValue
    );

    return mapping ? mapping.dependentValues : null;
  }

  /**
   * Checks if a dependent value is allowed for a given parent value.
   * 
   * @param parentValue - The parent choice value
   * @param dependentValue - The dependent choice value to check
   * @returns True if the dependent value is allowed, false otherwise
   * 
   * @example
   * ```typescript
   * const isAllowed = service.isAllowed(1, 101);
   * // Returns: true if 101 is in the allowed list for parent value 1
   * ```
   */
  public isAllowed(parentValue: number | null, dependentValue: number): boolean {
    const allowedValues = this.getDependentValues(parentValue);
    
    // If no configuration or no mapping found, allow all values
    if (allowedValues === null) {
      return true;
    }

    return allowedValues.includes(dependentValue);
  }

  /**
   * Gets the complete configuration.
   * 
   * @returns The complete dependency configuration or null if not initialized
   */
  public getConfiguration(): IDependencyConfiguration | null {
    return this.configuration;
  }
}
