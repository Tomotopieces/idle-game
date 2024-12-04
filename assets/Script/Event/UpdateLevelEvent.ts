import { Area } from "db://assets/Script/Level/Area";
import { Stage } from "db://assets/Script/Level/Stage";
import { GlobalState } from "db://assets/Script/Util/GlobalState";
import { GlobalStateName } from "db://assets/Script/Util/Constant";

/**
 * 更新关卡事件参数
 */
export class UpdateLevelEvent {
    /**
     * 区域
     */
    private readonly _area: Area;

    /**
     * 舞台
     */
    private readonly _stage: Stage;

    /**
     * 构造函数
     *
     * @param area 区域，null则为当前区域
     * @param stage 舞台，null则为当前舞台
     */
    constructor(area: Area, stage: Stage) {
        this._area = area ?? GlobalState.getState(GlobalStateName.AREA);
        this._stage = stage ?? GlobalState.getState(GlobalStateName.STAGE);
    }

    get area(): Area {
        return this._area;
    }

    get stage(): Stage {
        return this._stage;
    }
}