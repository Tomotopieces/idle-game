import { EnemyInfo } from "db://assets/Script/Entity/Enemy/EnemyInfo";

/**
 * 关卡舞台
 */
export class Stage {
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
     * 敌人信息
     */
    readonly enemyInfo: EnemyInfo;

    constructor(id: number, name: string, displayName: string, enemyInfo: EnemyInfo) {
        this.id = id;
        this.name = name;
        this.displayName = displayName;
        this.enemyInfo = enemyInfo;
    }
}