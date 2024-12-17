import { Area } from "db://assets/Script/Level/Area";
import { Stage } from "db://assets/Script/Level/Stage";
import { AREA_TABLE, STAGE_TABLE } from "db://assets/Script/DataTable";

/**
 * 默认关卡名称
 */
export enum DefaultLevelName {
    /**
     * 区域（黑风山）
     */
    AREA = 'hei_feng_shan',

    /**
     * 舞台（苍狼林）
     */
    STAGE = 'cang_lang_lin',
}

/**
 * 关卡
 */
export class Level {
    static AREA: Area;
    static STAGE: Stage;

    /**
     * 获取区域的第一个舞台
     *
     * @param area 区域
     */
    static firstStageOf(area: Area): Stage {
        return STAGE_TABLE.get(area.stages[0].name);
    }

    /**
     * 获取上一个区域
     *
     * @param currentArea 当前区域
     */
    static previousArea(currentArea: Area): Area {
        const areaList = Array.from(AREA_TABLE.values()).sort((a, b) => a.id - b.id);
        const currentIndex = areaList.findIndex(area => area.name === currentArea.name);
        return areaList[Math.max(currentIndex - 1, 0)];
    }

    /**
     * 获取下一个区域
     *
     * @param currentArea 当前区域
     */
    static nextArea(currentArea: Area): Area {
        const areaList = Array.from(AREA_TABLE.values()).sort((a, b) => a.id - b.id);
        const currentIndex = areaList.findIndex(area => area.name === currentArea.name);
        return areaList[Math.min(currentIndex + 1, areaList.length - 1)];
    }
}
