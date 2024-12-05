import { EventTarget } from 'cc';
import { GlobalState } from "db://assets/Script/Util/GlobalState";
import { EventName, GlobalStateName } from "db://assets/Script/Util/Constant";
import { EnemyInfo } from "db://assets/Script/Entity/Enemy/EnemyInfo";

/**
 * 玩家战斗数值组件
 */
export class EnemyCombatComponent {
    /**
     * 生命值
     */
    private _health: number;

    /**
     * 最大生命值
     */
    private _maxHealth: number;

    /**
     * 额外生命值
     */
    private _extraHealth: number;

    /**
     * 基础伤害
     */
    private _baseDamage: number;

    /**
     * 附加伤害
     *
     * 武器装备、丹药、被动效果等
     */
    private _additionalDamage: number;

    /**
     * 伤害倍率
     *
     * 初始为1.0
     */
    private _damageBoost: number;

    /**
     * 基础防御
     */
    private _baseDefence: number;

    /**
     * 附加防御
     *
     * 装备、丹药、被动效果等
     */
    private _additionalDefence: number;

    /**
     * 防御倍率
     *
     * 初始为1.0
     */
    private _defenceBoost: number;

    constructor(info: EnemyInfo) {
        this._health = this._maxHealth = info.health;
        this._extraHealth = 0;
        this._baseDamage = info.damage;
        this._additionalDamage = 0;
        this._damageBoost = 1;
        this._baseDefence = 0;
        this._additionalDefence = 0;
        this._defenceBoost = 1;
    }

    /**
     * 最终伤害
     */
    finalDamage(): number {
        return (this._baseDamage + this._additionalDamage) * this._damageBoost;
    }

    /**
     * 最终防御
     */
    finalDefence(): number {
        return (this._baseDefence + this._additionalDefence) * this._defenceBoost;
    }

    getHurt(damage: number) {
        this.health -= Math.max(0, damage - this.finalDefence());
    }

    get health(): number {
        return this._health;
    }

    set health(value: number) {
        this._health = Math.min(Math.max(0, value), this._maxHealth); // 生命不超过最大值
    }

    get maxHealth(): number {
        return this._maxHealth;
    }

    set maxHealth(value: number) {
        this._maxHealth = Math.max(0, value);
    }

    get extraHealth(): number {
        return this._extraHealth;
    }

    set extraHealth(value: number) {
        this._extraHealth = Math.max(0, value);
    }

    get baseDamage(): number {
        return this._baseDamage;
    }

    set baseDamage(value: number) {
        this._baseDamage = Math.max(0, value);
    }

    get additionalDamage(): number {
        return this._additionalDamage;
    }

    set additionalDamage(value: number) {
        this._additionalDamage = Math.max(0, value);
    }

    get damageBoost(): number {
        return this._damageBoost;
    }

    set damageBoost(value: number) {
        this._damageBoost = Math.max(0, value); // 可小于1，不可小于0
    }

    get baseDefence(): number {
        return this._baseDefence;
    }

    set baseDefence(value: number) {
        this._baseDefence = Math.max(0, value);
    }

    get additionalDefence(): number {
        return this._additionalDefence;
    }

    set additionalDefence(value: number) {
        this._additionalDefence = Math.max(0, value);
    }

    get defenceBoost(): number {
        return this._defenceBoost;
    }

    set defenceBoost(value: number) {
        this._defenceBoost = Math.max(0, value); // 可小于1，不可小于0
    }
}