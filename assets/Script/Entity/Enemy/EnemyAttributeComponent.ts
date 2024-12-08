import { EnemyInfo } from "db://assets/Script/Entity/Enemy/EnemyInfo";

/**
 * 玩家战斗数值组件
 */
export class EnemyAttributeComponent {
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
    private _baseDefense: number;

    /**
     * 附加防御
     *
     * 装备、丹药、被动效果等
     */
    private _additionalDefense: number;

    /**
     * 防御倍率
     *
     * 初始为1.0
     */
    private _defenseBoost: number;

    constructor(info: EnemyInfo) {
        this._health = this._maxHealth = info.health;
        this._extraHealth = 0;
        this._baseDamage = info.damage;
        this._additionalDamage = 0;
        this._damageBoost = 1;
        this._baseDefense = 0;
        this._additionalDefense = 0;
        this._defenseBoost = 1;
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
    finalDefense(): number {
        return (this._baseDefense + this._additionalDefense) * this._defenseBoost;
    }

    getHurt(damage: number) {
        this.health -= Math.max(0, damage - this.finalDefense());
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

    get baseDefense(): number {
        return this._baseDefense;
    }

    set baseDefense(value: number) {
        this._baseDefense = Math.max(0, value);
    }

    get additionalDefense(): number {
        return this._additionalDefense;
    }

    set additionalDefense(value: number) {
        this._additionalDefense = Math.max(0, value);
    }

    get defenseBoost(): number {
        return this._defenseBoost;
    }

    set defenseBoost(value: number) {
        this._defenseBoost = Math.max(0, value); // 可小于1，不可小于0
    }
}
