/** From T, get the set of properties that are not K */
declare type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
