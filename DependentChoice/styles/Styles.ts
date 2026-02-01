// DependentChoice\styles\Styles.ts
import { makeStyles, tokens } from "@fluentui/react-components";

/**
 * Fluent UI styles hook for the DependentChoice component.
 * 
 * @remarks
 * Uses Fluent UI v9 makeStyles API to generate CSS-in-JS styles.
 * Styles are applied using the returned class names in component className props.
 * 
 * @returns An object containing style classes:
 * - `root`: Base container styles for the DependentChoice component (full width)
 * 
 * @example
 * ```tsx
 * const styles = useDependentChoiceStyles();
 * return <div className={styles.root}>...</div>;
 * ```
 */
export const useDependentChoiceStyles = makeStyles({
  root: {
    width: "100%",
  },
});

/**
 * Fluent UI styles hook for the DependentChoiceConfigurationErrorDialog component.
 * 
 * @remarks
 * Uses Fluent UI v9 makeStyles API to generate CSS-in-JS styles for the error dialog.
 * Styles are applied using the returned class names in component className props.
 * All styles use Fluent UI design tokens for consistent theming.
 * 
 * @returns An object containing style classes:
 * - `icon`: Icon styling with danger color (red) and horizontal spacing
 * - `description`: Dialog description text with bottom margin
 * - `errorList`: Unordered list styling for error messages with left padding
 * - `errorItem`: Individual error list item styling with danger color
 * - `formatContainer`: Container for expected format example with background and padding
 * - `codeBlock`: Code block styling for JSON example with monospace font and scrolling
 * 
 * @example
 * ```tsx
 * const styles = useDependentChoiceConfigurationErrorDialogStyles();
 * return (
 *   <div className={styles.description}>
 *     <ul className={styles.errorList}>
 *       <li className={styles.errorItem}>Error message</li>
 *     </ul>
 *   </div>
 * );
 * ```
 */
export const useDependentChoiceConfigurationErrorDialogStyles = makeStyles({
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