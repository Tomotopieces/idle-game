import { EnemyInfo } from "db://assets/Script/Entity/Enemy/EnemyInfo";
import { DropItemJson } from "db://assets/Script/Item/DropItemJson";

/**
 * 敌人信息JSON
 */
export class EnemyInfoJson {
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
    readonly dropList: Array<DropItemJson>;

    /**
     * 图标
     */
    readonly icon: string;

    /**
     * 转换为EnemyInfo
     *
     * @param id ID
     * @param infoJson EnemyInfoJson
     * @return EnemyInfo
     */
    static toEnemyInfo(id: number, infoJson: EnemyInfoJson): EnemyInfo {
        const dropList = infoJson.dropList.map(jsonDrop => DropItemJson.toDropItem(jsonDrop));
        return new EnemyInfo(id, infoJson.name, infoJson.displayName, infoJson.health, infoJson.damage, dropList, infoJson.icon);
    }
}