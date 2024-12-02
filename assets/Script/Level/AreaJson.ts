import { StageJson } from "db://assets/Script/Level/StageJson";
import { Area } from "db://assets/Script/Level/Area";

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
     * 关卡ID列表
     */
    stageIdList: Array<StageJson>;

    /**
     * 转换为Area
     *
     * @param areaJson AreaJson
     */
    static toArea(areaJson: AreaJson): Area {
        const stages = areaJson.stageIdList.map(stageJson => StageJson.toStage(stageJson));
        return new Area(areaJson.id, areaJson.name, stages);
    }
}