import { Area } from "db://assets/Script/Level/Area";

import { STAGE_TABLE } from "db://assets/Script/DataTable";

/**
 * 关卡区域JSON
 */
export class AreaJson {
    /**
     * 名称
     */
    readonly name: string;

    /**
     * 显示名称
     */
    readonly displayName: string;

    /**
     * 关卡ID列表
     */
    readonly stages: Array<string>;

    /**
     * 转换为Area
     *
     * @param id ID
     * @param areaJson AreaJson
     * @return Area
     */
    static toArea(id: number, areaJson: AreaJson): Area {
        const stages = areaJson.stages.map(stageJson => STAGE_TABLE.get(stageJson));
        return new Area(id, areaJson.displayName, areaJson.name, stages);
    }
}