/**
 * For usage with function interfaces to extract the type of the function
 * from the interface
 */
export type Callable<T> = T extends (...args: any[]) => any
  ? (...args: Parameters<T>) => ReturnType<T>
  : never;
