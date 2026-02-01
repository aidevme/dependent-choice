import { usePcfContext } from '../services/PcfContextService/PcfContext';

/**
 * Generic hook for accessing translated resource strings from PCF context.
 * 
 * @remarks
 * This hook provides a type-safe way to access localized strings defined in .resx files.
 * It wraps the PCF context's resources.getString() method for convenient use in React components.
 * 
 * @returns Object containing translation functions
 * - `getString`: Function to retrieve a translated string by its resource key
 * - `t`: Alias for getString (shorter syntax)
 * 
 * @example
 * ```tsx
 * // Using getString
 * const { getString } = useTranslation();
 * const title = getString('dependent-choice-configuration-error-dialog-title');
 * 
 * // Using t alias
 * const { t } = useTranslation();
 * const message = t('dependent-choice-select-text');
 * ```
 */
export function useTranslation() {
  const pcfContext = usePcfContext();
  
  const getString = (key: string): string => {
    return pcfContext.context.resources.getString(key);
  };
  
  return {
    /** Get translated string by resource key */
    getString,
    /** Alias for getString (shorter syntax) */
    t: getString
  };
}
