/**
 * 套装效果
 */
export abstract class SetEffect {
    /**
     * 名称
     */
    readonly name: string;

    /**
     * 触发效果所需的套装装备数量
     */
    readonly require: number;

    /**
     * 激活
     */
    abstract onActivate(): void;

    /**
     * 取消激活
     */
    abstract onDeactivate(): void;

    protected constructor(name: string, require: number) {
        this.name = name;
        this.require = require;
    }
}