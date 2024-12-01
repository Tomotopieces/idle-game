import { DropItem } from "db://assets/Script/Item/DropItem";

/**
 * 敌人信息
 */
export class EnemyInfo {
    /**
     * ID
     */
    id: number;

    /**
     * 名称
     */
    name: string;

    /**
     * 生命值
     */
    health: number;

    /**
     * 攻击力
     */
    damage: number;

    /**
     * 掉落列表
     */
    dropList: Array<DropItem>;

    constructor(id: number, name: string, health: number, damage: number, dropList: Array<DropItem>) {
        this.id = id;
        this.name = name;
        this.health = health;
        this.damage = damage;
        this.dropList = dropList;
    }
}