import * as React from "react";
import * as ReactDOM from "react-dom";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { DependentChoiceApp, IDependentChoiceAppProps } from "./DependentChoiceApp";
import { v4 as uuidv4 } from "uuid";

export class DependentChoice implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private notifyOutputChanged: () => void;
    private selectedValue: number | number[] | null;
    private rootContainer: HTMLDivElement;
    private contextInstanceId: string;
    private props: IDependentChoiceAppProps;
    private isMultiSelect = false;

    /**
     * Empty constructor.
     */
    constructor() {
        // Empty
    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context - The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged - A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state - A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container - The container element for the control.
     */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {
        this.notifyOutputChanged = notifyOutputChanged;
        this.rootContainer = container;
        this.contextInstanceId = uuidv4();
        context.mode.trackContainerResize(true);
    }

    /**
     * onChange callback that handles value changes from the control.
     * @param newValue - The new selected value (single number or array of numbers for multi-select)
     */
    private onChange = (newValue: number | number[] | null): void => {
        if (newValue === -1 || (Array.isArray(newValue) && newValue.includes(-1))) {
            this.selectedValue = null;
        } else {
            this.selectedValue = newValue;
        }
        this.notifyOutputChanged();
    };

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context - The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        // Check if running in design mode (locally or in maker portal)
        const designModeUrls = [
            "make.powerapps.com",
            "make.gov.powerapps.us",
            "make.high.powerapps.us",
            "make.apps.appsplatform.us",
            "localhost",
        ];
        const isDesignMode = designModeUrls.some((url) => window.location.href.includes(url));
        
        // @ts-expect-error this is defined
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const fieldType = context.parameters.dependentChoice.attributes?.Type;
        console.log("DependentChoice field type:", fieldType);
        
        // Check for both possible multiselect type values
        this.isMultiSelect = fieldType === "multiselectpicklist" || fieldType === "MultiSelectPicklist";
        console.log("Is MultiSelect:", this.isMultiSelect);

        // Get and log parentChoice value
        // For multi-select, raw is an array of numbers (or array of objects with Value property)
        // For single select, raw is a single number
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        let parentChoiceValue = context.parameters.parentChoice.raw;
        
        console.log("Parent Choice Raw Value (before processing):", parentChoiceValue, "Type:", typeof parentChoiceValue, "IsArray:", Array.isArray(parentChoiceValue));
        
        // Handle multi-select array of objects with Value property
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (Array.isArray(parentChoiceValue) && parentChoiceValue.length > 0 && parentChoiceValue[0]?.Value !== undefined) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
            parentChoiceValue = parentChoiceValue.map((item: any) => item.Value);
            console.log("Parent Choice Value (extracted from array of objects):", parentChoiceValue);
        }
        
        console.log("Parent Choice Value (final):", parentChoiceValue, "IsArray:", Array.isArray(parentChoiceValue));
        // @ts-expect-error this is defined
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const parentChoiceOptions = context.parameters.parentChoice.attributes?.Options;
        console.log("Parent Choice Options:", parentChoiceOptions);

        // Get configuration parameters
        const configurationParameters = context.parameters.configurationParameters.raw;
        console.log("Configuration Parameters:", configurationParameters);

        // Get options from context
        // @ts-expect-error this is defined
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const options = context.parameters.dependentChoice.attributes?.Options ?? [];

        this.props = {
            onChange: this.onChange,
            context: context,
            instanceid: this.contextInstanceId,
            configurationParameters: configurationParameters,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            options: options,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            currentValue: this.isMultiSelect ? context.parameters.dependentChoice.raw : context.parameters.dependentChoice.raw?._val,
            isMultiSelect: this.isMultiSelect,
            // @ts-expect-error this is defined
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            defaultValue: isDesignMode ? undefined : context.parameters.dependentChoice.attributes?.DefaultValue,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            parentChoiceValue: parentChoiceValue,
        };

        return React.createElement(DependentChoiceApp, this.props);
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs {
        // For multiselect, return array; for single select, return single value
        const outputValue = this.isMultiSelect 
            ? (Array.isArray(this.selectedValue) ? this.selectedValue : [])
            : (Array.isArray(this.selectedValue) ? null : this.selectedValue);
        
        // Don't return parentChoice - it's bound input only, not output
        return { 
            dependentChoice: outputValue
        } as IOutputs;
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        ReactDOM.unmountComponentAtNode(this.rootContainer);
    }
}
