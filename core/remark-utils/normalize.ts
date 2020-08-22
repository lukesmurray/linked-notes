import collapseWhiteSpace from "collapse-white-space";

/**
 * Normalize an identifier.
 * Collapses multiple white space characters into a single space, and removes casing.
 * @param value the value to normalize to an identifier
 */
export function normalize(value: string) {
  return collapseWhiteSpace(value).toLowerCase();
}
