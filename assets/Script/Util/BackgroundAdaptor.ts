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
        if (windowSize.height / windowSize.width > transform.height / transform.width) {
            transform.height = transform.width / windowSize.width * windowSize.height;
        } else {
            transform.width = transform.height / windowSize.height * windowSize.width;
        }
    }
}