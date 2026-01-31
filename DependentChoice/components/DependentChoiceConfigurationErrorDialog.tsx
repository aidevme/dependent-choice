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
  makeStyles,
  tokens,
} from "@fluentui/react-components";

const useDependentChoiceConfigurationErrorDialogStyles = makeStyles({
  icon: {
    color: tokens.colorStatusDangerForeground1,
    marginRight: tokens.spacingHorizontalS,
    verticalAlign: "middle",
  },
  description: {
    marginBottom: tokens.spacingVerticalM,
  },
  errorList: {
    margin: "0",
    paddingLeft: tokens.spacingHorizontalXL,
  },
  errorItem: {
    marginBottom: tokens.spacingVerticalS,
    color: tokens.colorPaletteRedForeground1,
  },
  formatContainer: {
    marginTop: tokens.spacingVerticalL,
    padding: tokens.spacingVerticalM,
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: tokens.borderRadiusMedium,
  },
  codeBlock: {
    margin: `${tokens.spacingVerticalS} 0 0 0`,
    padding: tokens.spacingVerticalS,
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
    fontSize: tokens.fontSizeBase200,
    overflow: "auto",
  },
});

export interface IDependentChoiceConfigurationErrorDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean;
  /** Array of validation error messages */
  errors: string[];
  /** Callback when dialog is dismissed */
  onDismiss: () => void;
  /** PCF context for accessing resource strings */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: ComponentFramework.Context<any>;
}

/**
 * Dialog component to display configuration validation errors.
 * 
 * @remarks
 * This dialog is shown when the configurationParameters property contains
 * invalid JSON or doesn't match the expected structure.
 */
export const DependentChoiceConfigurationErrorDialog: React.FC<IDependentChoiceConfigurationErrorDialogProps> = (props) => {
  const styles = useDependentChoiceConfigurationErrorDialogStyles();
  
  const dialogTitle = props.context.resources.getString("dependent-choice-configuration-error-dialog-title");
  const dialogMessage = props.context.resources.getString("dependent-choice-configuration-error-dialog-message");
  const expectedFormatLabel = props.context.resources.getString("dependent-choice-configuration-error-dialog-expected-format-label");
  const dialogOkButton = props.context.resources.getString("dependent-choice-configuration-error-dialog-ok-button");
  
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
