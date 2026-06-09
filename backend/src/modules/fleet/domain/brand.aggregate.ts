import { randomUUID } from 'node:crypto';

export interface BrandProps {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface CreateBrandProps {
  name: string;
  createdBy: string;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Brand {
  private constructor(private props: BrandProps) {}

  static create(props: CreateBrandProps) {
    const now = props.createdAt ?? new Date();
    return new Brand({
      id: props.id ?? randomUUID(),
      name: props.name,
      createdAt: now,
      updatedAt: props.updatedAt ?? now,
      createdBy: props.createdBy,
    });
  }

  static restore(props: BrandProps) {
    return new Brand(props);
  }

  rename(name: string) {
    this.props.name = name;
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
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      createdBy: this.createdBy,
    };
  }
}
