import { Stage } from "db://assets/Script/Level/Stage";

import { ENEMY_TABLE } from "db://assets/Script/DataTable";

/**
 * 关卡舞台JSON
 */
export class StageJson {
    /**
     * 名称
     */
    readonly name: string;

    /**
     * 显示名称
     */
    readonly displayName: string;

    /**
     * 敌人名称
     */
    readonly enemyName: string;

    /**
     * 转为Stage
     *
     * @param id ID
     * @param stageJson StageJson
     * @return Stage
     */
    static toStage(id: number, stageJson: StageJson): Stage {
        const enemyInfo = ENEMY_TABLE.get(stageJson.enemyName);
        return new Stage(id, stageJson.name, stageJson.displayName, enemyInfo);
    }
}