/**
 * 套装效果
 *
 * 对应一套装备效果，可能存在多个具体的套装等级效果
 *
 * 套装等级：套装装备的已装备数量
 */
export abstract class SetBonus {
    /**
     * 名称
     */
    readonly name: string;

    /**
     * 套装装备启用性 Map
     *
     * 装备名称 -> 是否正在装备
     */
    readonly equipmentEnablementMap: Map<string, boolean>;

    /**
     * 套装等级效果 Map
     *
     * 套装等级 -> 等级效果
     */
    readonly levelEffectMap: Map<number, SetLevelBonus>;

    /**
     * 当前套装等级
     */
    private _level: number;

    protected constructor(name: string) {
        this.name = name;
        this.equipmentEnablementMap = new Map<string, boolean>();
        this.levelEffectMap = new Map<number, SetLevelBonus>();
        this._level = 0;
    }

    /**
     * 登记装备
     *
     * 仅在游戏加载时调用
     *
     * @param equipmentName 装备名称
     */
    record(equipmentName: string) {
        this.equipmentEnablementMap.set(equipmentName, false);
    }

    /**
     * 装备
     *
     * @param equipmentName 装备名称
     */
    equip(equipmentName: string) {
        if (!this.equipmentEnablementMap.has(equipmentName)) {
            return;
        }

        this.equipmentEnablementMap.set(equipmentName, true);
        this._level++;
        this.levelEffectMap.get(this._level)?.onActivate();
    }

    /**
     * 卸下
     *
     * @param equipmentName 装备名称
     */
    unequip(equipmentName: string) {
        if (!this.equipmentEnablementMap.has(equipmentName)) {
            return;
        }

        this.equipmentEnablementMap.set(equipmentName, false);
        this._level--;
        this.levelEffectMap.get(this._level + 1)?.onDeactivate();
    }
}

/**
 * 套装等级效果
 *
 * 实际的套装效果触发内容
 */
export abstract class SetLevelBonus {
    /**
     * 描述
     */
    readonly description: string;

    /**
     * 需求装备数量
     */
    readonly require: number;

    /**
     * 是否激活
     */
    private _active: boolean;

    protected constructor(description: string, require: number) {
        this.description = description;
        this.require = require;
    }

    /**
     * 激活
     */
    onActivate(): void {
        this._active = true;
    };

    /**
     * 取消激活
     */
    onDeactivate(): void {
        this._active = false;
    };

    get active(): boolean {
        return this._active;
    }
}
