import { EnemyInfo } from "db://assets/Script/Entity/Enemy/EnemyInfo";

/**
 * 关卡舞台
 */
export class Stage {
    /**
     * ID
     */
    private readonly _id: number;

    /**
     * 名称
     */
    private readonly _name: string;

    /**
     * 敌人信息
     */
    private readonly _enemyInfo: EnemyInfo;

    constructor(id: number, name: string, enemyInfo: EnemyInfo) {
        this._id = id;
        this._name = name;
        this._enemyInfo = enemyInfo;
    }

    get id(): number {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get enemyInfo(): EnemyInfo {
        return this._enemyInfo;
    }
}