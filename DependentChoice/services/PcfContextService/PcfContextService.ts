import { Theme } from "@fluentui/react-components";
import { IInputs } from "../../generated/ManifestTypes";
import { DependencyMappingService } from "../DependencyMappingService/DependencyMappingService";
import { MetadataService, IOptionSetMetadata } from "../MetadataService/MetadataService";

export interface IPcfContextServiceProps {
  context: ComponentFramework.Context<IInputs>;
  instanceid: string;
  configurationParameters?: string | null;
}

const SmallFormFactorMaxWidth = 350;

const enum FormFactors {
  Unknown = 0,
  Desktop = 1,
  Tablet = 2,
  Phone = 3,
}

interface ContextInfo {
  entityTypeName: string;
  entityId: string;
}

export class PcfContextService {
  instanceid: string;
  context: ComponentFramework.Context<IInputs>;
  theme: Theme;
  formFactor: string;
  dependencyMappingService: DependencyMappingService;
  metadataService: MetadataService;

  constructor(props: IPcfContextServiceProps) {
    this.instanceid = props.instanceid;
    this.context = props.context;
    this.theme = this.getTheme();      
    this.formFactor =
      props.context.client.getFormFactor() == (FormFactors.Phone as number) ||
      props.context.mode.allocatedWidth < SmallFormFactorMaxWidth
        ? "small"
        : "large";
    
    // Initialize dependency mapping service with configuration
    this.dependencyMappingService = new DependencyMappingService();
    this.dependencyMappingService.initialize(props.configurationParameters ?? null);
    
    // Initialize metadata service with WebAPI
    this.metadataService = new MetadataService(props.context.webAPI);
  }

  public inDesignMode(): boolean {
    // Previously only handled commercial cloud.
    // Updated to also handle GCC, GCC High, and DoD maker portal URLs.
    const designModeUrls = [
      "make.powerapps.com",
      "make.gov.powerapps.us", // GCC
      "make.high.powerapps.us", // GCC High
      "make.apps.appsplatform.us", // DoD
      "localhost", // Localhost for testing
    ];
    const currentUrl = window.location.href;
    return designModeUrls.some((url) => currentUrl.includes(url));
  }

  public isCanvasApp(): boolean {
    return this.context.mode.allocatedHeight !== -1;
  }

  public isControlDisabled(): boolean {
    // Return the control's disabled state from the context
    return this.context.mode.isControlDisabled;
  }

  public isVisible(): boolean {
    return this.context.mode.isVisible;
  }

  /**
   * Check if the dependent choice field has field-level security enabled
   * @returns true if field has security applied
   */
  public isFieldSecured(): boolean {
    return this.context.parameters.dependentChoice?.security?.secured ?? false;
  }

  /**
   * Check if the current user can read the dependent choice field value
   * @returns true if user has read permission
   */
  public canReadField(): boolean {
    return this.context.parameters.dependentChoice?.security?.readable ?? true;
  }

  /**
   * Check if the current user can edit the dependent choice field
   * @returns true if user has edit permission
   */
  public canEditField(): boolean {
    return this.context.parameters.dependentChoice?.security?.editable ?? true;
  }

  /**
   * Check if the control is editable (not disabled and user has edit permission)
   * @returns true if control can be edited by current user
   */
  public isControlEditable(): boolean {
    return !this.isControlDisabled() && this.canEditField();
  }

  public getTheme(): Theme {
    const defaultTheme: Theme = this.context.fluentDesignLanguage?.tokenTheme as Theme;
    return this.isControlDisabled() && !this.isCanvasApp()
        ? {
            ...defaultTheme,
            colorCompoundBrandStroke: defaultTheme?.colorNeutralStroke1,
            colorCompoundBrandStrokeHover:
            defaultTheme?.colorNeutralStroke1Hover,
            colorCompoundBrandStrokePressed:
            defaultTheme?.colorNeutralStroke1Pressed,
            //colorCompoundBrandStrokeSelected: props.theme?.colorNeutralStroke1Selected,
          }
        : defaultTheme;
  }

  public getEntityTypeName(): string {
    // @ts-expect-error Assert contextInfo to a known type.
    const contextInfo = this.context.mode.contextInfo as ContextInfo;
    return contextInfo.entityTypeName;
  }

  public getEntityId(): string {
    // @ts-expect-error Assert contextInfo to a known type.
    const contextInfo = this.context.mode.contextInfo as ContextInfo;
    return contextInfo.entityId;
  }

  /**
   * Retrieves fresh option set metadata for the dependent choice field via WebAPI.
   * This includes IsHidden and other metadata that may not be in the context.
   * 
   * @returns Promise with option set metadata including all options with IsHidden property
   * 
   * @example
   * ```typescript
   * const metadata = await pcfContext.getDependentChoiceMetadata();
   * const visibleOptions = metadata.Options.filter(opt => !opt.IsHidden);
   * ```
   */
  public async getDependentChoiceMetadata(): Promise<IOptionSetMetadata | null> {
    try {
      const entityName = this.getEntityTypeName();
      // @ts-expect-error - LogicalName exists but not in types
      // eslint-disable-next-line 
      const attributeName: string = this.context.parameters.dependentChoice.attributes?.LogicalName;
      
      if (!entityName || !attributeName) {
        console.warn("PcfContextService: Cannot retrieve metadata - entity or attribute name not available");
        return null;
      }

      console.log(`PcfContextService: Retrieving metadata for ${entityName}.${attributeName}`);
      return await this.metadataService.getOptionSetMetadata(entityName, attributeName);
    } catch (error) {
      console.error("PcfContextService: Failed to retrieve dependent choice metadata", error);
      return null;
    }
  }

  /**
   * Retrieves fresh option set metadata for the parent choice field via WebAPI.
   * 
   * @returns Promise with option set metadata
   */
  public async getParentChoiceMetadata(): Promise<IOptionSetMetadata | null> {
    try {
      const entityName = this.getEntityTypeName();
      // @ts-expect-error - LogicalName exists but not in types
      // eslint-disable-next-line 
      const attributeName: string = this.context.parameters.parentChoice.attributes?.LogicalName;
      
      if (!entityName || !attributeName) {
        console.warn("PcfContextService: Cannot retrieve metadata - entity or attribute name not available");
        return null;
      }

      console.log(`PcfContextService: Retrieving metadata for ${entityName}.${attributeName}`);
      return await this.metadataService.getOptionSetMetadata(entityName, attributeName);
    } catch (error) {
      console.error("PcfContextService: Failed to retrieve parent choice metadata", error);
      return null;
    }
  }
}