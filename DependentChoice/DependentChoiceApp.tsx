// DependentChoice\DependentChoiceApp.tsx
import * as React from "react";
import { IdPrefixProvider, FluentProvider } from "@fluentui/react-components";
import { PcfContextProvider } from "./services/PcfContextService/PcfContext";
import { PcfContextService, IPcfContextServiceProps } from "./services/PcfContextService/PcfContextService";
import { useDependentChoiceStyles } from "./styles/Styles"
import { ConfigurationValidator } from "./tools/ConfigurationValidator";

import { DependentChoiceControl } from "./components/DependentChoice";
import { DependentChoiceConfigurationErrorDialog } from "./components/DependentChoiceConfigurationErrorDialog";

export interface IDependentChoiceAppProps extends IPcfContextServiceProps {
  onChange: (newValue: number | number[] | null) => void;
  // These props are passed from index.ts
  options: ComponentFramework.PropertyHelper.OptionMetadata[];  
  currentValue: number | number[] | null; 
  isMultiSelect: boolean;
  defaultValue?: number | number[] | null;
  parentChoiceValue: number | number[] | null;
}

export const DependentChoiceApp: React.FC<IDependentChoiceAppProps> = (props) => {
  const styles = useDependentChoiceStyles();
  
  // Validate configuration on mount
  const [configErrors, setConfigErrors] = React.useState<string[]>([]);
  const [showErrorDialog, setShowErrorDialog] = React.useState(false);

  React.useEffect(() => {
    const validationResult = ConfigurationValidator.validate(props.configurationParameters);
    if (!validationResult.isValid) {
      console.error("DependentChoiceApp: Configuration validation failed", validationResult.errors);
      setConfigErrors(validationResult.errors);
      setShowErrorDialog(true);
    } else {
      setConfigErrors([]);
      setShowErrorDialog(false);
    }
  }, [props.configurationParameters]);

  // Create the context service.
  const pcfContextService = new PcfContextService({ 
    context: props.context, 
    instanceid: props.instanceid,
    configurationParameters: props.configurationParameters
  });
  
  // Use the PCF context theme (works in both runtime and design mode)
  const theme = pcfContextService.theme;

  // Don't render the control if it's not visible
  if (!pcfContextService.isVisible()) {
    return null;
  }

  return (
    <PcfContextProvider pcfcontext={pcfContextService}>
      <IdPrefixProvider value={`app-${props.instanceid}-`}>
        <FluentProvider theme={theme} className={styles.root}>
          <DependentChoiceControl {...props} />
          <DependentChoiceConfigurationErrorDialog 
            isOpen={showErrorDialog}
            errors={configErrors}
            onDismiss={() => setShowErrorDialog(false)}
          />
        </FluentProvider>
      </IdPrefixProvider>
    </PcfContextProvider>
  );
};

export default DependentChoiceApp;