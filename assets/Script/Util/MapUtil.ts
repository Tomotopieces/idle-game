/**
 * Map工具
 */
export class MapUtil {
    /**
     * 将Map转换为JSON字符串
     *
     * @param map map
     */
    static stringify(map: Map<string, {}>): string {
        const result = {};
        map.forEach((value, key) => result[key] = value);
        return JSON.stringify(result);
    }

    /**
     * 将JSON字符串转换为Map
     *
     * @param json JSON
     */
    static parse(json: string): Map<string, {}> {
        const result = new Map<string, {}>();
        const object = JSON.parse(json);
        for (const key in object) {
            result.set(key, object[key]);
        }
        return result;
    }
}
