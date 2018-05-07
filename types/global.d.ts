/**
 * From T, get the set of properties that are not K.
 *
 * @link https://github.com/Microsoft/TypeScript/wiki/What%27s-new-in-TypeScript#predefined-conditional-types
 */
declare type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
