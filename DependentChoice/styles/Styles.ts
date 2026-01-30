// DependentChoice\styles\Styles.ts
import { makeStyles } from "@fluentui/react-components";

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