import { Equipment } from "db://assets/Script/Item/Equipment/Equipment";

// 默认基础生命值
const DEFAULT_HEALTH = 300;

// 默认伤害
const DEFAULT_DAMAGE = 20;

// 默认暴击伤害倍率
const DEFAULT_CRITICAL_BOOST = 1.5;

/**
 * 玩家战斗数值组件
 */
export class PlayerAttributeComponent {
    /**
     * 生命值
     */
    private _health: number = DEFAULT_HEALTH;

    /**
     * 基础最大生命值
     */
    private _baseHealth: number = DEFAULT_HEALTH;

    /**
     * 附加生命值
     *
     * 武器装备、丹药、被动效果等
     */
    private _additionalHealth: number = 0;

    /**
     * 生命倍率
     *
     * 初始为1.0
     */
    private _healthBoost: number = 1;

    /**
     * 额外生命值
     *
     * 类似护盾，单独计算
     */
    private _extraHealth: number = 0;

    /**
     * 基础伤害
     */
    private _baseDamage: number = DEFAULT_DAMAGE;

    /**
     * 附加伤害
     *
     * 武器装备、丹药、被动效果等
     */
    private _additionalDamage: number = 0;

    /**
     * 伤害倍率
     *
     * 初始为1.0
     */
    private _damageBoost: number = 1;

    /**
     * 暴击率
     */
    private _criticalRate: number = 0;

    /**
     * 暴击伤害倍率
     *
     * 初始为1.5，不低于1.0
     */
    private _criticalBoost: number = DEFAULT_CRITICAL_BOOST;

    /**
     * 基础防御
     */
    private _baseDefense: number = 0;

    /**
     * 附加防御
     *
     * 装备、丹药、被动效果等
     */
    private _additionalDefense: number = 0;

    /**
     * 防御倍率
     *
     * 初始为1.0
     */
    private _defenseBoost: number = 1;

    /**
     * 根据等级提升属性
     *
     * @param level 新等级
     */
    levelUp(level: number) {
        this._baseHealth = DEFAULT_HEALTH + 5 * level;
        this._baseDamage = DEFAULT_DAMAGE + level;
        this._health = this.finalHealth();
    }

    /**
     * 最终生命上限
     *
     * (基础生命值 + 附加生命值) * 生命倍率 + 额外生命值
     */
    finalHealth(): number {
        return (this._baseHealth + this._additionalHealth) * this._healthBoost + this._extraHealth;
    }

    /**
     * 纸面最终伤害
     *
     * 不计算暴击
     *
     * （基础伤害 + 附加伤害) * 伤害倍率
     */
    paperFinalDamage(): number {
        return (this.baseDamage + this.additionalDamage) * this.damageBoost;
    }

    /**
     * 最终伤害
     *
     * （基础伤害 + 附加伤害) * 伤害倍率 * 暴击倍率
     */
    finalDamage(): number {
        const criticalBoost = Math.random() < this._criticalRate ? this._criticalBoost : 1; // 暴击
        return (this._baseDamage + this._additionalDamage) * this._damageBoost * criticalBoost;
    }

    /**
     * 最终防御
     *
     * （基础防御 + 附加防御) * 防御倍率
     */
    finalDefense(): number {
        return (this._baseDefense + this._additionalDefense) * this._defenseBoost;
    }

    /**
     * 受伤
     *
     * @param damage 伤害
     */
    getHurt(damage: number) {
        this.health -= Math.max(0, damage - this.finalDefense());
    }

    /**
     * 从装备中获取属性
     *
     * @param equipment 装备
     */
    getAttributeFromEquipment(equipment: Equipment) {
        if (!equipment) {
            return;
        }

        // 基础属性
        this.additionalHealth += equipment.attributes.additionalHealth;
        this.healthBoost += equipment.attributes.healthBoost;
        this.extraHealth += equipment.attributes.extraHealth;
        this.additionalDamage += equipment.attributes.additionalDamage;
        this.damageBoost += equipment.attributes.damageBoost;
        this.criticalRate += equipment.attributes.criticalRate;
        this.criticalBoost += equipment.attributes.criticalBoost;
        this.additionalDefense += equipment.attributes.additionalDefense;
        this.defenseBoost += equipment.attributes.defenseBoost;
    }

    /**
     * 去除装备属性
     *
     * @param equipment 装备
     */
    dropAttributeFromEquipment(equipment: Equipment) {
        if (!equipment) {
            return;
        }

        // 基础属性
        this.additionalHealth -= equipment.attributes.additionalHealth;
        this.healthBoost -= equipment.attributes.healthBoost;
        this.extraHealth -= equipment.attributes.extraHealth;
        this.additionalDamage -= equipment.attributes.additionalDamage;
        this.damageBoost -= equipment.attributes.damageBoost;
        this.criticalRate -= equipment.attributes.criticalRate;
        this.criticalBoost -= equipment.attributes.criticalBoost;
        this.additionalDefense -= equipment.attributes.additionalDefense;
        this.defenseBoost -= equipment.attributes.defenseBoost;
    }

    get health(): number {
        return this._health;
    }

    set health(value: number) {
        this._health = Math.min(Math.max(0, value), this.finalHealth()); // 生命不超过最终最大值，不小于0
    }

    get baseHealth(): number {
        return this._baseHealth;
    }

    set baseHealth(value: number) {
        const syncHealth = this._health === this._baseHealth; // 在生命值满的情况下，提升上限后生命值与上限同步
        this._baseHealth = Math.max(0, value);

        this._health = syncHealth ? this._baseHealth : Math.min(this._baseHealth, this._health);
    }

    get additionalHealth(): number {
        return this._additionalHealth;
    }

    set additionalHealth(value: number) {
        this._additionalHealth = value; // 可为负数
    }

    get healthBoost(): number {
        return this._healthBoost;
    }

    set healthBoost(value: number) {
        this._healthBoost = Math.max(0, value); // 可小于1，不可小于0
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

    get criticalRate(): number {
        return this._criticalRate;
    }

    set criticalRate(value: number) {
        this._criticalRate = Math.max(0, value); // 可大于1，不影响逻辑
    }

    get criticalBoost(): number {
        return this._criticalBoost;
    }

    set criticalBoost(value: number) {
        this._criticalBoost = Math.max(1, value); // 暴击伤害不会低于无暴击伤害
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
