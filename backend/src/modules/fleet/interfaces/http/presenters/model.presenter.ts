import { Model } from '../../../domain/model.aggregate';

export interface ModelResponse {
  id: string;
  name: string;
  brandId: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export const toModelResponse = (model: Model): ModelResponse => ({
  id: model.id,
  name: model.name,
  brandId: model.brandId ?? null,
  createdAt: model.createdAt,
  updatedAt: model.updatedAt,
  createdBy: model.createdBy,
});
