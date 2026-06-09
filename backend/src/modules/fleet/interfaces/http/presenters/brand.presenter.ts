import { Brand } from '../../../domain/brand.aggregate';

export interface BrandResponse {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export const toBrandResponse = (brand: Brand): BrandResponse => ({
  id: brand.id,
  name: brand.name,
  createdAt: brand.createdAt,
  updatedAt: brand.updatedAt,
  createdBy: brand.createdBy,
});
