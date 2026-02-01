// DependentChoice\components\DependentChoice.tsx
import * as React from "react";
import { usePcfContext } from "../services/PcfContextService/PcfContext";
import {
  Dropdown,
  Option,
  Tooltip,
  type DropdownProps
} from "@fluentui/react-components";
import { useDependentChoiceStyles } from "../styles/Styles"
import { IDependentChoiceAppProps } from "../DependentChoiceApp";

interface IDependentChoiceOption {
  key: string | number;
  text: string;
  hidden?: boolean;
}

export const DependentChoiceControl: React.FC<IDependentChoiceAppProps> = (
  props
) => {
  const pcfContext = usePcfContext();
  const styles = useDependentChoiceStyles();
  // Check if control is visible
  if (!pcfContext.isVisible()) return <></>;

  const isMultiSelect = props.isMultiSelect;
  
  // Check if parent choice has no value
  const hasNoParentValue = 
    props.parentChoiceValue === null || 
    props.parentChoiceValue === undefined || 
    props.parentChoiceValue === -1 ||
    (Array.isArray(props.parentChoiceValue) && props.parentChoiceValue.length === 0);
  
  // Determine disabled state from context (disabled or user lacks edit permission) or no parent value
  const isDisabled = !pcfContext.isControlEditable() || hasNoParentValue;
  
  // Get localized select text
  const selectText = props.context.resources.getString("dependent-choice-select-text");

  // For single select, maintain the selected key as a string (empty string instead of undefined to avoid controlled/uncontrolled warnings).
  const [selectedKey, setSelectedKey] = React.useState<string>(
    !isMultiSelect && props.currentValue != null
      ? props.currentValue.toString()
      : ""
  );
  // For multi select, maintain the selected keys as an array of strings.
  const [selectedKeys, setSelectedKeys] = React.useState<string[]>(
    isMultiSelect && Array.isArray(props.currentValue)
      ? (props.currentValue).map(String)
      : []
  );

  // Update state if props.currentValue changes.
  React.useEffect(() => {
    if (isMultiSelect) {
      if (Array.isArray(props.currentValue)) {
        setSelectedKeys((props.currentValue).map(String));
      } else {
        setSelectedKeys([]);
      }
    } else {
      if (props.currentValue != null) {
        setSelectedKey(props.currentValue.toString());
      } else {
        setSelectedKey("");
      }
    }
  }, [props.currentValue, isMultiSelect]);

  // Clean dependent choice when parent choice is unselected
  React.useEffect(() => {
    if (hasNoParentValue) {
      // Clear the dependent choice value
      if (isMultiSelect) {
        if (selectedKeys.length > 0) {
          console.log("DependentChoice: Clearing multi-select due to no parent value");
          setSelectedKeys([]);
          props.onChange([]);
        }
      } else {
        if (selectedKey && selectedKey !== "" && selectedKey !== "-1") {
          console.log("DependentChoice: Clearing single-select due to no parent value");
          setSelectedKey("");
          props.onChange(null);
        }
      }
    }
  }, [hasNoParentValue, isMultiSelect, selectedKey, selectedKeys, props]);

  // Auto-remove invalid dependent selections when parent choice changes
  React.useEffect(() => {
    // Skip if no mapping service or no parent value
    if (!pcfContext.dependencyMappingService || !props.parentChoiceValue) {
      return;
    }

    // Get currently allowed values based on parent selection
    const parentValues = Array.isArray(props.parentChoiceValue) 
      ? props.parentChoiceValue 
      : [props.parentChoiceValue];

    // Skip if parent has no valid values
    if (parentValues.length === 0 || parentValues[0] === -1 || parentValues[0] === null || parentValues[0] === undefined) {
      return;
    }

    const allowedValues = new Set<number>();
    parentValues.forEach(parentValue => {
      const allowed = pcfContext.dependencyMappingService.getDependentValues(parentValue);
      if (allowed) {
        allowed.forEach(val => allowedValues.add(val));
      }
    });

    console.log("DependentChoice: Auto-cleanup check - Allowed values:", Array.from(allowedValues));

    // Handle multi-select: remove invalid selections
    if (isMultiSelect && Array.isArray(selectedKeys) && selectedKeys.length > 0) {
      const validSelectedKeys = selectedKeys.filter(key => 
        allowedValues.has(Number(key))
      );

      // Update if any values were removed
      if (validSelectedKeys.length !== selectedKeys.length) {
        const removed = selectedKeys.filter(key => !allowedValues.has(Number(key)));
        console.log("DependentChoice: Auto-removing invalid selections:", removed);
        setSelectedKeys(validSelectedKeys);
        props.onChange(validSelectedKeys.map(Number));
      }
    } 
    // Handle single-select: clear if value no longer valid
    else if (!isMultiSelect && selectedKey && selectedKey !== "" && selectedKey !== "-1") {
      if (!allowedValues.has(Number(selectedKey))) {
        console.log("DependentChoice: Auto-clearing invalid single selection:", selectedKey);
        setSelectedKey("");
        props.onChange(null);
      }
    }
  }, [props.parentChoiceValue, pcfContext.dependencyMappingService, isMultiSelect, selectedKey, selectedKeys, props.onChange]);

  // Map the options using the information passed from the index.
  const mappedOptions: IDependentChoiceOption[] = props.options.map((opt) => ({
    key: opt.Value,
    text: opt.Label,
    // @ts-expect-error - IsHidden exists in option metadata but not in types
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    hidden: opt.IsHidden ?? false,
  }));

  // Filter options based on parent choice value using dependency mapping
  const filteredOptions = React.useMemo(() => {
    console.log("DependentChoice: Filtering options", {
      parentChoiceValue: props.parentChoiceValue,
      parentChoiceValueType: typeof props.parentChoiceValue,
      isArray: Array.isArray(props.parentChoiceValue),
      hasMappingService: !!pcfContext.dependencyMappingService,
      totalOptions: mappedOptions.length
    });

    // If no mapping service, show all options
    if (!pcfContext.dependencyMappingService) {
      console.log("DependentChoice: No mapping service - showing all options");
      return mappedOptions;
    }

    // If no parent value selected, show all options
    // Check for null, undefined, empty array, or -1
    if (
      props.parentChoiceValue === null || 
      props.parentChoiceValue === undefined || 
      props.parentChoiceValue === -1 ||
      (Array.isArray(props.parentChoiceValue) && props.parentChoiceValue.length === 0)
    ) {
      console.log("DependentChoice: No parent value selected - showing all options");
      return mappedOptions;
    }

    // Get allowed dependent values based on parent selection
    const parentValues = Array.isArray(props.parentChoiceValue) 
      ? props.parentChoiceValue 
      : [props.parentChoiceValue];

    console.log("DependentChoice: Parent values to check:", parentValues);

    // Collect all allowed dependent values from all selected parents
    const allowedValues = new Set<number>();
    let hasMappings = false;
    
    parentValues.forEach(parentValue => {
      const allowed = pcfContext.dependencyMappingService.getDependentValues(parentValue);
      console.log("DependentChoice: Got dependent values for parent", parentValue, ":", allowed);
      if (allowed !== null) {
        // Mapping exists (even if it's an empty array)
        hasMappings = true;
        allowed.forEach(val => allowedValues.add(val));
      }
    });

    console.log("DependentChoice: Has mappings:", hasMappings, "Allowed values count:", allowedValues.size);

    // If no mappings found at all, show all options (fail-safe)
    // But if mappings exist with empty arrays, respect that (show no/limited options)
    if (!hasMappings) {
      console.log("DependentChoice: No mappings found - showing all options as fail-safe");
      return mappedOptions;
    }

    // Filter options to only those that are allowed
    // If allowedValues is empty (e.g., Antarctica with no countries), this returns empty array
    // Also exclude hidden options
    const filtered = mappedOptions.filter(opt => 
      !opt.hidden && (
        allowedValues.has(Number(opt.key)) || 
        // Always keep currently selected values even if not in mapping
        (!isMultiSelect && selectedKey !== "" && selectedKey === opt.key.toString()) ||
        (isMultiSelect && selectedKeys.includes(opt.key.toString()))
      )
    );
    
    console.log("DependentChoice: Filtered options count:", filtered.length, "Hidden options excluded:", mappedOptions.filter(o => o.hidden).length);
    return filtered;
  }, [props.parentChoiceValue, mappedOptions, pcfContext.dependencyMappingService, 
      isMultiSelect, selectedKey, selectedKeys]);

  // Add the --Select-- option if conditions are met
  const selectOption: IDependentChoiceOption = { key: -1, text: selectText };
  const includeSelectOption = !props.isMultiSelect && !props.defaultValue;

  // Determine which options to display:
  const displayedOptions = includeSelectOption 
    ? [selectOption, ...filteredOptions] 
    : filteredOptions;

  // Compute the display text based on current selection.
  const displayText = isMultiSelect
    ? selectedKeys.length > 0
      ? selectedKeys
          .map((key) => {
            const opt = mappedOptions.find((o) => o.key.toString() === key);
            return opt ? opt.text : key;
          })
          .join(", ")
      : ""
    : selectedKey === '-1' || selectedKey === ""
    ? ""
    : selectedKey
    ? mappedOptions.find((o) => o.key.toString() === selectedKey)?.text ??
      selectedKey
    : "";

  const onOptionSelect: DropdownProps["onOptionSelect"] = (event, data) => {
    if (isMultiSelect) {
      const newSelected = data?.selectedOptions ?? [];
      setSelectedKeys(newSelected);
      const numericValues = newSelected.map((val) => Number(val));
      props.onChange(numericValues);
      console.log("Multi-select chosen options:", newSelected);
    } else {
      const newSelected =
        data?.selectedOptions && data.selectedOptions.length > 0
          ? data.selectedOptions[0]
          : "";
      setSelectedKey(newSelected);
      const numericValue = newSelected !== "" ? Number(newSelected) : null;
      props.onChange(numericValue);
      console.log("Single-select chosen option:", newSelected);
    }
  };

  return (
    <Tooltip content={displayText === "" ? selectText : displayText} relationship="label">
      <Dropdown        
        appearance="filled-darker"
        className={styles.root}
        onOptionSelect={onOptionSelect}
        multiselect={isMultiSelect}
        selectedOptions={
          isMultiSelect ? selectedKeys : selectedKey ? [selectedKey] : []
        }        
        disabled={isDisabled}
        value={displayText}
        placeholder="---" // <-- Use placeholder to show ---
      >
        {displayedOptions.map((opt) => (
          <Option key={opt.key} value={opt.key.toString()}>
            {opt.text}
          </Option>
        ))}
      </Dropdown>
    </Tooltip>
  );
};