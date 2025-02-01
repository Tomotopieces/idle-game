import { _decorator, Color, Component, Label } from "cc";
import { MaskProcess } from "db://assets/Script/Prefab/MaskProcess";
import { EventCenter } from "db://assets/Script/Event/EventCenter";
import { EventName } from "db://assets/Script/Event/EventName";
import { UIUpdateGourdProcessEvent } from "db://assets/Script/Event/Events/UIUpdateGourdProcessEvent";

const { ccclass } = _decorator;

/**
 * 葫芦进度条
 */
@ccclass('GourdProcess')
export class GourdProcess extends Component {
    /**
     * 遮罩进度条
     */
    private _processMask: MaskProcess;

    /**
     * 余量标签
     */
    private _remainLabel: Label;

    onLoad() {
        this._processMask = this.node.getChildByName('Process').getComponent(MaskProcess);
        this._remainLabel = this.node.getChildByName('Remain').getComponent(Label);

        EventCenter.on(EventName.UI_UPDATE_GOURD_PROCESS, this.node.name, (event: UIUpdateGourdProcessEvent) => this.handleUpdateGourdProcess(event))
    }

    onDestroy() {
        EventCenter.idOff(this.node.name);
    }

    /**
     * 处理更新葫芦进度事件
     *
     * @param event 事件参数
     */
    private handleUpdateGourdProcess(event: UIUpdateGourdProcessEvent) {
        this._processMask.process = event.process;
        this._remainLabel.string = `${event.remain}`;
        this._remainLabel.color = event.remain > 0 ? Color.WHITE : Color.RED;
    }
}