import { Area } from "db://assets/Script/Level/Area";
import { GlobalState } from "db://assets/Script/Util/GlobalState";
import { GlobalStateName } from "db://assets/Script/Util/Constant";
import { Stage } from "db://assets/Script/Level/Stage";

/**
 * 关卡区域JSON
 */
export class AreaJson {
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
     * 关卡ID列表
     */
    stages: Array<string>;

    /**
     * 转换为Area
     *
     * @param areaJson AreaJson
     */
    static toArea(areaJson: AreaJson): Area {
        const stateTable = GlobalState.getState(GlobalStateName.STAGE_TABLE) as Map<string, Stage>;
        const stages = areaJson.stages.map(stageJson => stateTable.get(stageJson));
        return new Area(areaJson.id, areaJson.displayName, areaJson.name, stages);
    }
}