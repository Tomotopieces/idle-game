import { Area } from "db://assets/Script/Level/Area";
import { Stage } from "db://assets/Script/Level/Stage";
import { GlobalState } from "db://assets/Script/Util/GlobalState";
import { GlobalStateName } from "db://assets/Script/Util/Constant";

/**
 * 关卡工具
 */
export class LevelUtil {
    /**
     * 获取区域的第一个舞台
     *
     * @param area 区域
     */
    static firstStageOf(area: Area): Stage {
        return GlobalState.getState(GlobalStateName.STAGE_TABLE).get(area.stages[0].name);
    }

    /**
     * 获取上一个区域
     *
     * @param currentArea 当前区域
     */
    static previousArea(currentArea: Area): Area {
        const table = GlobalState.getState(GlobalStateName.AREA_TABLE) as Map<string, Area>;
        const areaList = Array.from(table.values()).sort((a, b) => a.id - b.id);
        const currentIndex = areaList.findIndex(area => area.name === currentArea.name);
        return areaList[Math.max(currentIndex - 1, 0)];
    }

    /**
     * 获取下一个区域
     *
     * @param currentArea 当前区域
     */
    static nextArea(currentArea: Area): Area {
        const table = GlobalState.getState(GlobalStateName.AREA_TABLE) as Map<string, Area>;
        const areaList = Array.from(table.values()).sort((a, b) => a.id - b.id);
        const currentIndex = areaList.findIndex(area => area.name === currentArea.name);
        return areaList[Math.min(currentIndex + 1, areaList.length - 1)];
    }
}