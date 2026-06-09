import { Model } from './model.aggregate';

export interface ModelRepository {
  findById(id: string): Promise<Model | null>;
  list(): Promise<Model[]>;
  findByName(name: string): Promise<Model | null>;
  save(model: Model): Promise<Model>;
  remove(model: Model): Promise<void>;
  listByBrand(brandId: string): Promise<Model[]>;
}
