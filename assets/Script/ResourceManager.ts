import { _decorator, Asset, Component, resources } from 'cc';

const { ccclass } = _decorator;

/**
 * 资源类型
 */
export enum ResourceType {
    /**
     * JSON数据
     */
    JSON_DATA,

    /**
     * 图片
     */
    SPRITE_FRAME,
}

/**
 * spriteFrame资源前缀
 */
const SPRITE_FRAME_PREFIX = 'image/';

/**
 * spriteFrame资源后缀
 */
const SPRITE_FRAME_SUFFIX = '/spriteFrame';

/**
 * 动态资源管理器
 */
@ccclass('ResourceManager')
export class ResourceManager extends Component {
    /**
     * 加载动态资源
     *
     * @param type 资源类型
     * @param name 资源名称
     * @param assetHandler 资源处理函数
     */
    static loadAsset(type: ResourceType, name: string, assetHandler: (asset: Asset) => void): void {
        const path = ResourceManager.getResourcePath(type, name);
        resources.load(path, (err: any, data: Asset) => {
            if (err) {
                console.error(err);
            }
            assetHandler(data);
        });
    }

    /**
     * 获取动态资源
     *
     * 需要确保资源已经加载，否则返回null
     *
     * @param type 资源类型
     * @param name 资源名称
     * @return 资源
     */
    static getAsset(type: ResourceType, name: string): Asset {
        return resources.get(ResourceManager.getResourcePath(type, name));
    }

    /**
     * 获取资源路径
     *
     * @param type 资源类型
     * @param name 资源名称
     * @return 资源完整路径
     */
    private static getResourcePath(type: ResourceType, name: string): string {
        switch (type) {
            case ResourceType.SPRITE_FRAME:
                return SPRITE_FRAME_PREFIX + name + SPRITE_FRAME_SUFFIX;
            default:
                return name;
        }
    }
}


