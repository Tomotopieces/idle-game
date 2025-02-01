import { _decorator, Component, Label } from "cc";
import { MaskProcess } from "db://assets/Script/Prefab/MaskProcess";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { EventName } from "db://assets/Script/Event/EventName";
import { UIUpdateStanceProcessEvent } from "db://assets/Script/Event/Events/UIUpdateStanceProcessEvent";

const { ccclass } = _decorator;

/**
 * 棍势进度条
 */
@ccclass('StanceProcess')
export class StanceProcess extends Component {
    /**
     * 遮罩进度条
     */
    private _processMask: MaskProcess;

    /**
     * 棍势等级Label
     */
    private _levelLabel: Label;

    onLoad() {
        this._processMask = this.node.getChildByName('Process').getComponent(MaskProcess);
        this._levelLabel = this.node.getChildByName('Level').getComponent(Label);

        EventCenter.on(EventName.UI_UPDATE_STANCE_PROCESS, this.node.name, (event: UIUpdateStanceProcessEvent) => this.handleUpdateStanceProcess(event))
    }

    onDestroy() {
        EventCenter.idOff(this.node.name);
    }

    /**
     * 处理更新棍势进度事件
     *
     * @param event 事件参数
     */
    private handleUpdateStanceProcess(event: UIUpdateStanceProcessEvent) {
        this._processMask.process = event.process;
        this._levelLabel.string = `${event.level}`;
    }
}