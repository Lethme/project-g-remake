import GEntity from "@/game/core/entities/entity";
import type {ReturnTypeOf} from "@/utils/types";

class GEntityManager {
    protected readonly entityStorage: Map<string, GEntity>;

    constructor(entities: Array<[ key: string, entity: GEntity ]>) {
        this.entityStorage = new Map(entities);
    }

    public preload() {
        for (const [_, entity] of this.entityStorage.entries()) {
            entity.preload();
        }
    }

    public create() {
        for (const [_, entity] of this.entityStorage.entries()) {
            entity.create();
        }
    }

    public update(time: number, delta: number) {
        for (const [_, entity] of this.entityStorage.entries()) {
            entity.update(time, delta);
        }
    }

    public destroy() {

    }

    public getEntity<T extends GEntity>(key: string): T | undefined {
        return this.entityStorage.get(key) as T || undefined;
    }

    public getEntityPhaserInstance<T extends GEntity>(key: string): ReturnTypeOf<T, 'getPhaserInstance'> | undefined {
        const entity = this.getEntity<T>(key);
        return entity?.getPhaserInstance();
    }
}

export default GEntityManager;