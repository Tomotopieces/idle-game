import { JsonDropItem } from "db://assets/Script/Item/DropItem";
import { EnemyInfo } from "db://assets/Script/Entity/Enemy/EnemyInfo";

/**
 * 敌人信息JSON
 */
export class JsonEnemyInfo {
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
    dropList: Array<JsonDropItem>;

    constructor(id: number, name: string, health: number, damage: number, dropList: Array<JsonDropItem>) {
        this.id = id;
        this.name = name;
        this.health = health;
        this.damage = damage;
        this.dropList = dropList;
    }

    /**
     * 转换为EnemyInfo
     */
    static toEnemyInfo(jsonInfo: JsonEnemyInfo): EnemyInfo {
        const dropList = jsonInfo.dropList.map(jsonDrop => JsonDropItem.toDropItem(jsonDrop));
        return new EnemyInfo(jsonInfo.id, this.name, jsonInfo.health, jsonInfo.damage, dropList);
    }
}