import { Area } from "db://assets/Script/Level/Area";
import { Stage } from "db://assets/Script/Level/Stage";
import { GlobalState } from "db://assets/Script/Util/GlobalState";
import { GlobalStateName } from "db://assets/Script/Util/Constant";
import { EventArgument } from "db://assets/Script/Event/EventArgument";

/**
 * 更新关卡事件参数
 */
export class UpdateLevelEvent extends EventArgument {
    /**
     * 区域
     */
    area: Area;

    /**
     * 舞台
     */
    stage: Stage;

    /**
     * 构造函数
     *
     * @param area 区域，null则为当前区域
     * @param stage 舞台，null则为当前舞台
     */
    constructor(area: Area, stage: Stage) {
        super();
        this.area = area ?? GlobalState.getState(GlobalStateName.AREA);
        this.stage = stage ?? GlobalState.getState(GlobalStateName.STAGE);
    }
}
