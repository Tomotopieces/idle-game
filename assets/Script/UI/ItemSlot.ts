import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

@ccclass('ItemSlot')
export class ItemSlot extends Component {
    click() {
        console.log(`click`);
    }
}


