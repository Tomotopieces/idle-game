import { _decorator, Component, instantiate, Prefab, Widget } from 'cc';
import { Stage } from "db://assets/Script/Level/Stage";
import { Area } from "db://assets/Script/Level/Area";
import { StageButton } from "db://assets/Script/UI/StageButton";
import { EventName, GlobalStateName } from "db://assets/Script/Util/Constant";
import { GlobalState } from "db://assets/Script/Util/GlobalState";
import { LevelUtil } from "db://assets/Script/Util/LevelUtil";
import { UpdateLevelEvent } from "db://assets/Script/Event/UpdateLevelEvent";
import { EventCenter } from "db://assets/Script/Util/EventCenter";

const { ccclass, property } = _decorator;

/**
 * 舞台选择线
 */
@ccclass('StageLine')
export class StageLine extends Component {
    /**
     * 舞台选择按钮Prefab
     */
    @property({ type: Prefab, tooltip: '舞台选择按钮Prefab' })
    stageButtonPrefab: Prefab = null;

    /**
     * 更新当前关卡
     *
     * @param newArea 区域
     * @param newStage 舞台
     */
    updateCurrentLevel(newArea: Area, newStage: Stage) {
        // 清空子节点
        this.node.removeAllChildren();

        // 计算节点间隔
        const spaceBetween = newArea.stages.length > 1 ? 1 / (newArea.stages.length - 1) : 50;
        newArea.stages.forEach((stage, index) => {
            const node = instantiate(this.stageButtonPrefab);
            const button = node.getComponent(StageButton);
            button.stageName = stage.name;
            this.node.addChild(node);

            // 设置位置
            const widget = node.getComponent(Widget);
            widget.isAbsoluteHorizontalCenter = false;
            widget.horizontalCenter = newArea.stages.length > 1 ? index * spaceBetween - 0.5 : 0;

            // 设置是否为当前舞台
            if (stage.name === newStage.name) {
                button.setCurrent();
            }
        });
    }

    /**
     * 点击上一区域按钮
     *
     * 按钮触发
     */
    clickPreviousAreaButton() {
        const previousArea = LevelUtil.previousArea(GlobalState.getState(GlobalStateName.AREA));
        const stage = LevelUtil.firstStageOf(previousArea);
        EventCenter.emit(EventName.UPDATE_LEVEL, new UpdateLevelEvent(previousArea, stage));
    }

    /**
     * 点击下一区域按钮
     *
     * 按钮触发
     */
    clickNextAreaButton() {
        const nextArea = LevelUtil.nextArea(GlobalState.getState(GlobalStateName.AREA));
        const stage = LevelUtil.firstStageOf(nextArea);
        EventCenter.emit(EventName.UPDATE_LEVEL, new UpdateLevelEvent(nextArea, stage));
    }
}


