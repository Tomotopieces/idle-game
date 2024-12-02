import { _decorator, Asset, Component, resources } from 'cc';
const { ccclass } = _decorator;

/**
 * 图片类型资源前缀
 */
export const IMAGE_PREFIX = 'image/';

export const IMAGE_SUFFIX = '/spriteFrame';

/**
 * 动态资源管理器
 */
@ccclass('ResourceManager')
export class ResourceManager extends Component {
    /**
     * 动态资源
     */
    private static _dynamicAssets: Map<string, Asset> = new Map<string, Asset>();

    /**
     * 获取动态资源
     *
     * @param path 路径
     * @param assetHandler 资源处理函数
     */
    static getAsset(path: string, assetHandler: (asset: Asset) => void): void {
        const asset = this._dynamicAssets.get(path);
        if (asset) {
            assetHandler(asset);
        } else {
            resources.load(path, (err: any, data: Asset) => {
                if (err) {
                    console.error(err);
                }
                this._dynamicAssets.set(path, data);
                assetHandler(data);
            });
        }
    }
}


