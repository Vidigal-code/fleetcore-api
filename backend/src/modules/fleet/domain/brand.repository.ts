import { Brand } from './brand.aggregate';

export interface BrandRepository {
  findById(id: string): Promise<Brand | null>;
  findByName(name: string): Promise<Brand | null>;
  list(): Promise<Brand[]>;
  save(brand: Brand): Promise<Brand>;
  remove(brand: Brand): Promise<void>;
}
