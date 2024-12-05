import { DropItem } from "db://assets/Script/Item/DropItem";

/**
 * 敌人信息
 */
export class EnemyInfo {
    /**
     * ID
     */
    readonly id: number;

    /**
     * 名称
     */
    readonly name: string;

    /**
     * 显示名称
     */
    readonly displayName: string;

    /**
     * 生命值
     */
    readonly health: number;

    /**
     * 攻击力
     */
    readonly damage: number;

    /**
     * 掉落列表
     */
    readonly dropList: Array<DropItem>;

    /**
     * 图标
     */
    readonly icon: string;

    constructor(id: number, name: string, displayName: string, health: number, damage: number, dropList: Array<DropItem>, icon: string) {
        this.id = id;
        this.name = name;
        this.displayName = displayName;
        this.health = health;
        this.damage = damage;
        this.dropList = dropList;
        this.icon = icon;
    }
}
