import { _decorator, Component, Node, EventTarget } from 'cc';
import { GlobalState, GlobalStateName } from "db://assets/Script/Util/GlobalState";
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    onLoad() {
        GlobalState.setState(GlobalStateName.EVENT_TARGET, new EventTarget());
    }
}


