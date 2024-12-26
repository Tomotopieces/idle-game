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
     * 舞台名称列表
     */
    readonly stages: string[];

    /**
     * 转换为Area
     *
     * @param id ID
     * @param areaJson AreaJson
     * @return Area
     */
    static toArea(id: number, areaJson: AreaJson): Area {
        const stages = areaJson.stages.map(stageName => STAGE_TABLE.get(stageName));
        return new Area(id, areaJson.displayName, areaJson.name, stages);
    }
}