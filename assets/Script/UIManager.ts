import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends Component {
    /**
     * 仓库面板
     */
    @property({ type: Node, tooltip: '仓库面板'})
    storeHousePanel: Node = null;

    /**
     * 开关仓库面板
     */
    public toggleStoreHousePanel() {
        if (!this.storeHousePanel) {
            console.error(`[UIManager.toggleStoreHousePanel] storeHousePanel is null`);
            return;
        }
        this.storeHousePanel.active = !this.storeHousePanel.active;
    }
}


