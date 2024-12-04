import { _decorator, Component, Label } from 'cc';
import { Stage } from "db://assets/Script/Level/Stage";
import { Area } from "db://assets/Script/Level/Area";

const { ccclass, property } = _decorator;

/**
 * 关卡名称
 */
@ccclass('LevelNameBar')
export class LevelNameBar extends Component {
    /**
     * 关卡名称Label
     */
    @property({ type: Label, tooltip: '关卡名称Label' })
    label: Label = null;

    /**
     * 更新关卡名称
     *
     * @param area 区域
     * @param stage 舞台
     */
    updateLevelName(area: Area, stage: Stage) {
        this.label.string = `${area.displayName} - ${stage.displayName}`;
    }
}


