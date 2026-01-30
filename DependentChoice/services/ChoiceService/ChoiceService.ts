import * as mockData from "../../statics/mockChoices.json";

/**
 * Service for managing choice/option set operations including mock data generation.
 */
export class ChoiceService {
  /**
   * Gets mock parent choice options from mockChoices.json for design mode/local testing.
   * 
   * @returns Array of mock parent OptionMetadata objects (regions)
   * 
   * @example
   * ```typescript
   * const mockOptions = ChoiceService.generateMockOptions();
   * // Returns parent choices from JSON: North America, Europe, Asia Pacific, etc.
   * ```
   */
  public static generateMockOptions(): ComponentFramework.PropertyHelper.OptionMetadata[] {
    return mockData.parentChoices as ComponentFramework.PropertyHelper.OptionMetadata[];
  }

  /**
   * Gets all mock dependent choice options as a flat array.
   * 
   * @returns Array of all mock dependent OptionMetadata objects (all countries)
   * 
   * @example
   * ```typescript
   * const allDependentOptions = ChoiceService.generateAllMockDependentOptions();
   * // Returns all countries in alphabetical order
   * ```
   */
  public static generateAllMockDependentOptions(): ComponentFramework.PropertyHelper.OptionMetadata[] {
    return mockData.dependentChoices as ComponentFramework.PropertyHelper.OptionMetadata[];
  }
}
