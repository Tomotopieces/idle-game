import { Stage } from "db://assets/Script/Level/Stage";
import { GlobalState } from "db://assets/Script/Util/GlobalState";
import { GlobalStateName } from "db://assets/Script/Util/Constant";

/**
 * 关卡舞台JSON
 */
export class StageJson {
    /**
     * ID
     */
    id: number;

    /**
     * 名称
     */
    name: string;

    /**
     * 显示名称
     */
    displayName: string;

    /**
     * 敌人名称
     */
    enemyName: string;

    /**
     * 转为Stage
     *
     * @param stageJson StageJson
     */
    static toStage(stageJson: StageJson): Stage {
        const enemyInfo = GlobalState.getState(GlobalStateName.ENEMY_TABLE).get(stageJson.enemyName);
        return new Stage(stageJson.id, stageJson.name, stageJson.displayName, enemyInfo);
    }
}