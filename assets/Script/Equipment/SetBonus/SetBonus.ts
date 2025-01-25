import { PassiveEffect } from "db://assets/Script/PassiveEffect/PassiveEffect";

/**
 * 套装效果
 *
 * 对应一套装备效果，可能存在多个具体的套装等级效果
 *
 * 套装等级：套装装备的已装备数量
 */
export class SetBonus {
    /**
     * 名称
     */
    readonly name: string;

    /**
     * 套装等级要求
     */
    readonly requirement: number;

    /**
     * 效果
     */
    readonly effect: PassiveEffect;

    /**
     * 当前套装等级
     */
    private _level: number;

    /**
     * 是否激活
     */
    private _active: boolean;

    constructor(name: string, requirement: number, effect: PassiveEffect) {
        this.name = name;
        this.requirement = requirement;
        this.effect = effect;
        this._level = 0;
    }

    /**
     * 等级上升
     */
    levelUp() {
        this._level++;
        if (this._level >= this.requirement) {
            this.effect.activate();
            this._active = true;
        }
    }

    /**
     * 等级下降
     */
    levelDown() {
        this._level--;
        if (this._level < this.requirement) {
            this.effect.deactivate();
            this._active = false;
        }
    }

    get active(): boolean {
        return this._active;
    }

    get level(): number {
        return this._level;
    }
}
