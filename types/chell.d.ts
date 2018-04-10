/** From T, get the set of properties that not NOT K */
declare type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
