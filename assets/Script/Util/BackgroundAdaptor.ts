import { _decorator, Component, screen, UITransform } from 'cc';

const { ccclass } = _decorator;

/**
 * 背景适配器
 */
@ccclass('BackgroundAdaptor')
export class BackgroundAdaptor extends Component {
    start() {
        const windowSize = screen.windowSize;
        const transform = this.node.getComponent(UITransform);
        transform.height *= transform.width / transform.height / windowSize.width * windowSize.height;
    }
}