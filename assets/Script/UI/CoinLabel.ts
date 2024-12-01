import { _decorator, Component, Label } from 'cc';
import { GlobalState } from "db://assets/Script/Util/GlobalState";
import { EventName, GlobalStateName } from "db://assets/Script/Util/Constant";

const { ccclass } = _decorator;

/**
 * 金币数量Label
 */
@ccclass('CoinLabel')
export class CoinLabel extends Component {
    /**
     * Label
     */
    private _label: Label;

    start() {
        this._label = this.getComponent(Label);

        GlobalState.getState(GlobalStateName.EVENT_TARGET)
            .on(EventName.UPDATE_COIN, (coin: number) => this.updateCoin(coin));
    }

    /**
     * 更新金币数Label
     *
     * @param coin 金币数
     */
    updateCoin(coin: number) {
        this._label.string = `${coin}`;
    }
}


