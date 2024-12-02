import { EnemyInfo } from "db://assets/Script/Entity/Enemy/EnemyInfo";
import { DropItemJson } from "db://assets/Script/Item/DropItemJson";

/**
 * 敌人信息JSON
 */
export class EnemyInfoJson {
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
    dropList: Array<DropItemJson>;

    /**
     * 转换为EnemyInfo
     *
     * @param infoJson EnemyInfoJson
     */
    static toEnemyInfo(infoJson: EnemyInfoJson): EnemyInfo {
        const dropList = infoJson.dropList.map(jsonDrop => DropItemJson.toDropItem(jsonDrop));
        return new EnemyInfo(infoJson.id, infoJson.name, infoJson.health, infoJson.damage, dropList);
    }
}