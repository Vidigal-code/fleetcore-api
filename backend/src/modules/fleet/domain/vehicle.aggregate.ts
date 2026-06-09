import { randomUUID } from 'node:crypto';

export interface VehicleProps {
  id: string;
  licensePlate: string;
  chassis: string;
  renavam: string;
  year: number;
  modelId: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface CreateVehicleProps {
  licensePlate: string;
  chassis: string;
  renavam: string;
  year: number;
  modelId: string;
  createdBy: string;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Vehicle {
  private constructor(private props: VehicleProps) {}

  static create(props: CreateVehicleProps) {
    const now = props.createdAt ?? new Date();
    return new Vehicle({
      id: props.id ?? randomUUID(),
      licensePlate: props.licensePlate,
      chassis: props.chassis,
      renavam: props.renavam,
      year: props.year,
      modelId: props.modelId,
      createdAt: now,
      updatedAt: props.updatedAt ?? now,
      createdBy: props.createdBy,
    });
  }

  static restore(props: VehicleProps) {
    return new Vehicle(props);
  }

  update(details: Partial<Omit<CreateVehicleProps, 'modelId' | 'createdBy'>>) {
    this.props.licensePlate = details.licensePlate ?? this.props.licensePlate;
    this.props.chassis = details.chassis ?? this.props.chassis;
    this.props.renavam = details.renavam ?? this.props.renavam;
    this.props.year = details.year ?? this.props.year;
    this.touch();
  }

  changeModel(modelId: string) {
    this.props.modelId = modelId;
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  get id() {
    return this.props.id;
  }

  get licensePlate() {
    return this.props.licensePlate;
  }

  get chassis() {
    return this.props.chassis;
  }

  get renavam() {
    return this.props.renavam;
  }

  get year() {
    return this.props.year;
  }

  get modelId() {
    return this.props.modelId;
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
      licensePlate: this.licensePlate,
      chassis: this.chassis,
      renavam: this.renavam,
      year: this.year,
      modelId: this.modelId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      createdBy: this.createdBy,
    };
  }
}
