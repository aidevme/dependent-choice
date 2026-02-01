// DependentChoice\components\DependentChoiceConfigurationErrorDialog.tsx
import * as React from "react";
import {
  Dialog,  
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogContent,
  DialogActions,
  Button,
} from "@fluentui/react-components";
import { useDependentChoiceConfigurationErrorDialogStyles } from "../styles/Styles";
import { useTranslation } from "../hooks/useTranslation";

export interface IDependentChoiceConfigurationErrorDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean;
  /** Array of validation error messages */
  errors: string[];
  /** Callback when dialog is dismissed */
  onDismiss: () => void;
}

/**
 * Dialog component to display configuration validation errors.
 * 
 * @remarks
 * This dialog is shown when the configurationParameters property contains
 * invalid JSON or doesn't match the expected structure.
 * Uses the useTranslation hook to access localized resource strings.
 */
export const DependentChoiceConfigurationErrorDialog: React.FC<IDependentChoiceConfigurationErrorDialogProps> = (props) => {
  const styles = useDependentChoiceConfigurationErrorDialogStyles();
  const { getString } = useTranslation();
  
  const dialogTitle = getString("dependent-choice-configuration-error-dialog-title");
  const dialogMessage = getString("dependent-choice-configuration-error-dialog-message");
  const expectedFormatLabel = getString("dependent-choice-configuration-error-dialog-expected-format-label");
  const dialogOkButton = getString("dependent-choice-configuration-error-dialog-ok-button");
  
  return (
    <Dialog 
      modalType="alert"
      open={props.isOpen} 
      onOpenChange={(event, data) => {
        if (!data.open) {
          props.onDismiss();
        }
      }}
    >
      <DialogSurface>
        <DialogBody>
          <DialogTitle>
            {dialogTitle}
          </DialogTitle>
          <DialogContent>
            <div className={styles.description}>
              <strong>{dialogMessage}</strong>
            </div>
            <ul className={styles.errorList}>
              {props.errors.map((error, index) => (
                <li key={index} className={styles.errorItem}>
                  {error}
                </li>
              ))}
            </ul>
            <div className={styles.formatContainer}>
              <strong>{expectedFormatLabel}</strong>
              <pre className={styles.codeBlock}>
{`{
  "mappings": [
    {
      "parentValue": 1,
      "dependentValues": [11, 12, 13]
    },
    {
      "parentValue": 2,
      "dependentValues": [21, 22, 23]
    }
  ]
}`}
              </pre>
            </div>
          </DialogContent>
          <DialogActions>
            <Button appearance="primary" onClick={props.onDismiss}>
              {dialogOkButton}
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};
