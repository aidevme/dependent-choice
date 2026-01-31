/**
 * Interface representing an option set option with metadata.
 */
export interface IOptionMetadata {
  /** The numeric value of the option */
  Value: number;
  /** The display label for the option */
  Label: string;
  /** The color associated with the option */
  Color?: string;
  /** Whether the option is hidden */
  IsHidden?: boolean;
  /** The description of the option */
  Description?: string;
  /** The external value (for global option sets) */
  ExternalValue?: string;
}

/**
 * Interface representing attribute metadata from Dataverse.
 */
export interface IAttributeMetadata {
  /** Logical name of the attribute */
  LogicalName: string;
  /** Display name of the attribute */
  DisplayName: string;
  /** Attribute type (e.g., Picklist, MultiSelectPicklist) */
  AttributeType: string;
  /** Option set metadata (for choice fields) */
  OptionSet?: IOptionSetMetadata;
  /** Whether the attribute is required */
  RequiredLevel?: string;
  /** Whether the attribute is valid for create */
  IsValidForCreate?: boolean;
  /** Whether the attribute is valid for update */
  IsValidForUpdate?: boolean;
}

/**
 * Interface representing option set metadata.
 */
export interface IOptionSetMetadata {
  /** Name of the option set */
  Name: string;
  /** Display name of the option set */
  DisplayName: string;
  /** Whether this is a global option set */
  IsGlobal: boolean;
  /** Array of options */
  Options: IOptionMetadata[];
  /** Description of the option set */
  Description?: string;
}

/**
 * Interface representing entity metadata.
 */
export interface IEntityMetadata {
  /** Logical name of the entity */
  LogicalName: string;
  /** Display name of the entity */
  DisplayName: string;
  /** Plural display name */
  DisplayCollectionName: string;
  /** Primary ID attribute name */
  PrimaryIdAttribute: string;
  /** Primary name attribute name */
  PrimaryNameAttribute: string;
  /** Entity set name for Web API */
  EntitySetName: string;
}

/**
 * Service for retrieving metadata from Dataverse using WebAPI.
 * 
 * @remarks
 * This service provides methods to retrieve entity metadata, attribute metadata,
 * and option set definitions. Results are cached to improve performance.
 */
export class MetadataService {
  private webAPI: ComponentFramework.WebApi;
  private cache = new Map<string, unknown>();
  private cacheExpiry = new Map<string, number>();
  private readonly CACHE_DURATION_MS = 300000; // 5 minutes

  constructor(webAPI: ComponentFramework.WebApi) {
    this.webAPI = webAPI;
  }

  /**
   * Retrieves entity metadata by logical name.
   * 
   * @param entityLogicalName - The logical name of the entity
   * @returns Promise with entity metadata
   * 
   * @example
   * ```typescript
   * const metadata = await service.getEntityMetadata('account');
   * console.log(metadata.DisplayName); // "Account"
   * ```
   */
  public async getEntityMetadata(entityLogicalName: string): Promise<IEntityMetadata> {
    const cacheKey = `entity_${entityLogicalName}`;
    const cached = this.getFromCache<IEntityMetadata>(cacheKey);
    if (cached) {
      console.log("MetadataService: Returning cached entity metadata for", entityLogicalName);
      return cached;
    }

    console.log("MetadataService: Fetching entity metadata for", entityLogicalName);
    
    try {
      const result = await this.webAPI.retrieveMultipleRecords(
        "EntityDefinition",
        `?$filter=LogicalName eq '${entityLogicalName}'&$select=LogicalName,DisplayName,DisplayCollectionName,PrimaryIdAttribute,PrimaryNameAttribute,EntitySetName`
      );

      if (result.entities.length === 0) {
        throw new Error(`Entity metadata not found for: ${entityLogicalName}`);
      }

      const entity = result.entities[0] as unknown as IEntityMetadata;
      this.setCache(cacheKey, entity);
      
      console.log("MetadataService: Successfully retrieved entity metadata for", entityLogicalName);
      return entity;
    } catch (error) {
      console.error("MetadataService: Failed to retrieve entity metadata", error);
      throw error;
    }
  }

  /**
   * Retrieves attribute metadata for a specific field.
   * 
   * @param entityLogicalName - The logical name of the entity
   * @param attributeLogicalName - The logical name of the attribute
   * @returns Promise with attribute metadata
   * 
   * @example
   * ```typescript
   * const metadata = await service.getAttributeMetadata('account', 'industrycode');
   * console.log(metadata.AttributeType); // "Picklist"
   * ```
   */
  public async getAttributeMetadata(
    entityLogicalName: string,
    attributeLogicalName: string
  ): Promise<IAttributeMetadata> {
    const cacheKey = `attribute_${entityLogicalName}_${attributeLogicalName}`;
    const cached = this.getFromCache<IAttributeMetadata>(cacheKey);
    if (cached) {
      console.log("MetadataService: Returning cached attribute metadata for", attributeLogicalName);
      return cached;
    }

    console.log("MetadataService: Fetching attribute metadata for", entityLogicalName, attributeLogicalName);
    
    try {
      // First get entity metadata to find the attribute
      const entityResult = await this.webAPI.retrieveMultipleRecords(
        "EntityDefinition",
        `?$filter=LogicalName eq '${entityLogicalName}'&$expand=Attributes($filter=LogicalName eq '${attributeLogicalName}')`
      );

      if (entityResult.entities.length === 0) {
        throw new Error(`Entity not found: ${entityLogicalName}`);
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
      const attributes = (entityResult.entities[0] as any).Attributes;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (!attributes || attributes.length === 0) {
        throw new Error(`Attribute not found: ${attributeLogicalName} in entity ${entityLogicalName}`);
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const attribute = attributes[0] as IAttributeMetadata;
      this.setCache(cacheKey, attribute);
      
      console.log("MetadataService: Successfully retrieved attribute metadata for", attributeLogicalName);
      return attribute;
    } catch (error) {
      console.error("MetadataService: Failed to retrieve attribute metadata", error);
      throw error;
    }
  }

  /**
   * Retrieves option set metadata for a choice field.
   * 
   * @param entityLogicalName - The logical name of the entity
   * @param attributeLogicalName - The logical name of the attribute
   * @returns Promise with option set metadata including all options
   * 
   * @example
   * ```typescript
   * const optionSet = await service.getOptionSetMetadata('account', 'industrycode');
   * optionSet.Options.forEach(opt => console.log(opt.Label, opt.Value));
   * ```
   */
  public async getOptionSetMetadata(
    entityLogicalName: string,
    attributeLogicalName: string
  ): Promise<IOptionSetMetadata> {
    const cacheKey = `optionset_${entityLogicalName}_${attributeLogicalName}`;
    const cached = this.getFromCache<IOptionSetMetadata>(cacheKey);
    if (cached) {
      console.log("MetadataService: Returning cached option set metadata for", attributeLogicalName);
      return cached;
    }

    console.log("MetadataService: Fetching option set metadata for", entityLogicalName, attributeLogicalName);
    
    try {
      const entityResult = await this.webAPI.retrieveMultipleRecords(
        "EntityDefinition",
        `?$filter=LogicalName eq '${entityLogicalName}'&$expand=Attributes($filter=LogicalName eq '${attributeLogicalName}';$expand=OptionSet($expand=Options))`
      );

      if (entityResult.entities.length === 0) {
        throw new Error(`Entity not found: ${entityLogicalName}`);
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
      const attributes = (entityResult.entities[0] as any).Attributes;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (!attributes || attributes.length === 0) {
        throw new Error(`Attribute not found: ${attributeLogicalName}`);
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const optionSet = (attributes[0]).OptionSet as IOptionSetMetadata;
      if (!optionSet) {
        throw new Error(`No option set found for attribute: ${attributeLogicalName}`);
      }

      this.setCache(cacheKey, optionSet);
      
      console.log("MetadataService: Successfully retrieved option set metadata with", optionSet.Options?.length ?? 0, "options");
      return optionSet;
    } catch (error) {
      console.error("MetadataService: Failed to retrieve option set metadata", error);
      throw error;
    }
  }

  /**
   * Retrieves global option set metadata by name.
   * 
   * @param optionSetName - The name of the global option set
   * @returns Promise with option set metadata
   * 
   * @example
   * ```typescript
   * const optionSet = await service.getGlobalOptionSet('statuscode');
   * console.log(optionSet.DisplayName);
   * ```
   */
  public async getGlobalOptionSet(optionSetName: string): Promise<IOptionSetMetadata> {
    const cacheKey = `global_optionset_${optionSetName}`;
    const cached = this.getFromCache<IOptionSetMetadata>(cacheKey);
    if (cached) {
      console.log("MetadataService: Returning cached global option set for", optionSetName);
      return cached;
    }

    console.log("MetadataService: Fetching global option set metadata for", optionSetName);
    
    try {
      const result = await this.webAPI.retrieveMultipleRecords(
        "GlobalOptionSetDefinition",
        `?$filter=Name eq '${optionSetName}'&$expand=Options`
      );

      if (result.entities.length === 0) {
        throw new Error(`Global option set not found: ${optionSetName}`);
      }

      const optionSet = result.entities[0] as unknown as IOptionSetMetadata;
      this.setCache(cacheKey, optionSet);
      
      console.log("MetadataService: Successfully retrieved global option set for", optionSetName);
      return optionSet;
    } catch (error) {
      console.error("MetadataService: Failed to retrieve global option set", error);
      throw error;
    }
  }

  /**
   * Clears all cached metadata.
   */
  public clearCache(): void {
    console.log("MetadataService: Clearing cache");
    this.cache.clear();
    this.cacheExpiry.clear();
  }

  /**
   * Clears cached metadata for a specific key.
   * 
   * @param key - The cache key to clear
   */
  public clearCacheKey(key: string): void {
    console.log("MetadataService: Clearing cache for key", key);
    this.cache.delete(key);
    this.cacheExpiry.delete(key);
  }

  /**
   * Gets a value from cache if it exists and hasn't expired.
   * 
   * @param key - The cache key
   * @returns The cached value or null if not found or expired
   */
  private getFromCache<T>(key: string): T | null {
    const expiry = this.cacheExpiry.get(key);
    if (!expiry || Date.now() > expiry) {
      // Cache expired or doesn't exist
      this.cache.delete(key);
      this.cacheExpiry.delete(key);
      return null;
    }

    return (this.cache.get(key) as T) ?? null;
  }

  /**
   * Sets a value in cache with expiry.
   * 
   * @param key - The cache key
   * @param value - The value to cache
   */
  private setCache(key: string, value: unknown): void {
    this.cache.set(key, value);
    this.cacheExpiry.set(key, Date.now() + this.CACHE_DURATION_MS);
  }
}
