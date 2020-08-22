import type * as UNIST from "unist";

/**
 * Returns the previous unist point with the column and offset incremented by a certain length.
 *
 * Given the start of a string you can get the end of the string by calling
 * incrementUnistPoint(start, string.length)
 * This is useful when making positions.
 *
 * @param point a unist point
 * @param by the offset to increment the point by
 */
export const incrementUnistPoint = (
  point: UNIST.Point,
  by: number
): UNIST.Point => {
  point = { ...point };
  point.column += by;
  point.offset = point.offset === undefined ? undefined : point.offset + by;
  return point;
};
