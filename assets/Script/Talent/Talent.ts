import { Predicate } from "db://assets/Script/Util/Functions";

/**
 * 天赋
 *
 * 根基、棍法、奇术、身法、毫毛
 *
 * 满足前置条件后解锁，解锁后通过灵光点数提升激活等级
 */
export abstract class Talent {
    /**
     * 名称
     */
    readonly name: string;

    /**
     * 显示名称
     */
    readonly displayName: string;

    /**
     * 需要的灵光点数
     */
    readonly requirement: number;

    /**
     * 是否满足前置条件后自动激活
     */
    readonly autoActivate: boolean;

    /**
     * 最大等级
     *
     * 自动激活的天赋，最大等级为1级
     */
    readonly maxLevel: number;

    /**
     * 前置天赋或解锁条件
     */
    readonly prerequisites: Array<string> | Predicate<any>;

    /**
     * 提高激活等级
     */
    abstract levelUp(): void;

    /**
     * 降低激活等级
     */
    abstract levelDown(): void;

    /**
     * 是否锁定
     */
    private _locked: boolean;

    /**
     * 激活等级
     */
    private _level: number;

    constructor(name: string, displayName: string, requirement: number, autoActivate: boolean, maxLevel: number, prerequisites: Array<string> | Predicate<any>) {
        this.name = name;
        this.displayName = displayName;
        this.requirement = requirement;
        this.autoActivate = autoActivate;
        this.maxLevel = autoActivate ? 1 : maxLevel;
        this.prerequisites = prerequisites;
        this._locked = true;
        this._level = 0;
    }

    /**
     * 取消激活
     */
    deactivate(): void {
        this._level = 0;
        this.levelDown();
    }
}