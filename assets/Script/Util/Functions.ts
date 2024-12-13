/**
 * 谓词函数类型
 */
export type Predicate<T> = (value?: T) => boolean;

/**
 * 消费函数类型
 */
export type Consumer<T> = (value: T) => void;

/**
 * 供给函数类型
 */
export type Supplier<T> = () => T;

/**
 * 执行函数类型
 */
export type Runnable = () => void;

/**
 * 空函数
 */
export const EMPTY_FUNCTION: Runnable = () => {};
