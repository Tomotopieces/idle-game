import { _decorator, Component, instantiate, Prefab, Widget } from 'cc';
import { Stage } from "db://assets/Script/Level/Stage";
import { Area } from "db://assets/Script/Level/Area";
import { StageButton } from "db://assets/Script/UI/StageButton";
import { Level } from "db://assets/Script/Level/Level";
import { UpdateLevelEvent } from "db://assets/Script/Event/Events/UpdateLevelEvent";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { EventName } from "db://assets/Script/Event/EventName";
import { Chapter } from "db://assets/Script/Level/Chapter";

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
        let targetChapter: Chapter;
        let targetArea = Level.previousAreaOf(Level.AREA);
        if (!targetArea) {
            // 若为本章节的第一个区域，则返回上一章节的最后一个区域
            targetChapter = Level.previousChapterOf(Level.CHAPTER);
            if (!targetChapter) {
                // 若为第一个章节，则不操作
                return;
            }
            targetArea = Level.lastAreaOf(targetChapter);
        }
        const stage = Level.firstStageOf(targetArea);
        EventCenter.emit(EventName.UPDATE_LEVEL, new UpdateLevelEvent(targetChapter, targetArea, stage));
    }

    /**
     * 点击下一区域按钮
     *
     * 按钮触发
     */
    clickNextAreaButton() {
        let targetChapter: Chapter;
        let targetArea = Level.nextAreaOf(Level.AREA);
        if (!targetArea) {
            // 若为本章节的最后一个区域，则进入下一章节的第一个区域
            targetChapter = Level.nextChapterOf(Level.CHAPTER);
            if (!targetChapter) {
                // 若为最后一个章节，则不操作
                return;
            }
            targetArea = Level.firstAreaOf(targetChapter);
        }
        const stage = Level.firstStageOf(targetArea);
        EventCenter.emit(EventName.UPDATE_LEVEL, new UpdateLevelEvent(targetChapter, targetArea, stage));
    }
}


