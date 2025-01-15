/**
 * 酒
 */
export abstract class Liquor {
    /**
     * 名称
     */
    name: string;

    /**
     * 显示名称
     */
    displayName: string;

    /**
     * 生命恢复量
     *
     * 百分比值，0~1
     */
    healthRecoverRatio: number;

    // 泡酒物 ingredients: Ingredient[]; TODO 是否需要优化省略泡酒物设计？把某几个希望保留的泡酒物改为单独的酒？
}