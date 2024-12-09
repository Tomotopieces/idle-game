/**
 * 独门妙用
 */
export abstract class UniqueEffect {
    /**
     * 名称
     */
    readonly name: string;

    /**
     * 激活
     */
    abstract onActivate(): void;

    /**
     * 取消激活
     */
    abstract onDeactivate(): void;

    protected constructor(name: string) {
        this.name = name;
    }
}
