import { randomUUID } from 'node:crypto';

export interface ModelProps {
  id: string;
  name: string;
  brandId: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface CreateModelProps {
  name: string;
  brandId: string | null;
  createdBy: string;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Model {
  private constructor(private props: ModelProps) {}

  static create(props: CreateModelProps) {
    const now = props.createdAt ?? new Date();
    return new Model({
      id: props.id ?? randomUUID(),
      name: props.name,
      brandId: props.brandId,
      createdAt: now,
      updatedAt: props.updatedAt ?? now,
      createdBy: props.createdBy,
    });
  }

  static restore(props: ModelProps) {
    return new Model(props);
  }

  rename(name: string) {
    this.props.name = name;
    this.touch();
  }

  assignBrand(brandId: string | null) {
    this.props.brandId = brandId;
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  get id() {
    return this.props.id;
  }

  get name() {
    return this.props.name;
  }

  get brandId() {
    return this.props.brandId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get createdBy() {
    return this.props.createdBy;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      brandId: this.brandId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      createdBy: this.createdBy,
    };
  }
}
