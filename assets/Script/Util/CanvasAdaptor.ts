import { _decorator, Component, screen, view } from 'cc';

const { ccclass } = _decorator;

/**
 * 画布尺寸适配器
 */
@ccclass('CanvasAdaptor')
export class CanvasAdaptor extends Component {
    start() {
        const window = screen.windowSize;
        const designSize = view.getDesignResolutionSize();
        const height = designSize.width / window.width * window.height;
        view.setDesignResolutionSize(designSize.width, height, view.getResolutionPolicy());
    }
}