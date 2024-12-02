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
     * 敌人信息ID
     */
    enemyInfoId: number;

    /**
     * 转为Stage
     *
     * @param stageJson StageJson
     */
    static toStage(stageJson: StageJson): Stage {
        const enemyInfo = GlobalState.getState(GlobalStateName.ENEMY_TABLE).get(stageJson.enemyInfoId);
        return new Stage(stageJson.id, stageJson.name, enemyInfo);
    }
}