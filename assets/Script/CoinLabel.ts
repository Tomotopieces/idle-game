import { _decorator, Component, Label } from 'cc';
import { GlobalState, GlobalStateName } from "db://assets/Script/Util/GlobalState";

const { ccclass, property } = _decorator;

@ccclass('CoinLabel')
export class CoinLabel extends Component {
    start() {
        GlobalState.getState(GlobalStateName.EVENT_TARGET).on('GetCoin', (coin: number) => this.onGetCoin(coin));
    }

    update(deltaTime: number) {

    }

    onGetCoin(coin: number) {
        this.node.getComponent(Label).string = `Coin: ${coin}`;
    }
}


