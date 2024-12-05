/**
 * 数据
 */
export class Entity {
    /**
     * 生命值
     */
    private _health: number;

    /**
     * 攻击力
     */
    private _damage: number;

    /**
     * 获取生命值
     *
     * @returns 当前的生命值
     */
    public get health(): number {
        return this._health;
    }

    /**
     * 设置生命值
     *
     * @param value 新的生命值，最小为0
     */
    public set health(value: number) {
        this._health = Math.max(0, value);
    }

    /**
     * 获取攻击力
     *
     * @returns 当前的攻击力
     */
    public get damage(): number {
        return this._damage;
    }

    /**
     * 设置攻击力
     *
     * @param value 新的攻击力
     */
    public set damage(value: number) {
        this._damage = value;
    }
}
