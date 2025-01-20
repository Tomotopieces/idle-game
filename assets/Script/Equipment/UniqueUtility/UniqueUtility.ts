/**
 * 独门妙用
 *
 * 装备/珍玩/葫芦/酒/泡酒物的独特效果
 */
export abstract class UniqueUtility {
    /**
     * 名称
     */
    readonly name: string;

    /**
     * 效果描述
     */
    readonly description: string;

    /**
     * 激活
     */
    abstract onActivate(): void;

    /**
     * 取消激活
     */
    abstract onDeactivate(): void;

    protected constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
    }
}
