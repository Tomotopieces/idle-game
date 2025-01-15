/**
 * 葫芦状态
 */
export enum GourdState {
    /**
     * 全满的
     */
    FULL = 'full',

    /**
     * 不空不满的
     */
    PARTIAL = 'partial',

    /**
     * 空的
     */
    EMPTY = 'empty',
}