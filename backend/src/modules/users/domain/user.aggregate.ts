import { randomUUID } from 'node:crypto';

import { UserRole } from './user-role.enum';

export interface UserProps {
  id: string;
  nickname: string;
  name: string;
  email: string;
  passwordHash: string;
  roles: UserRole[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface CreateUserProps {
  nickname: string;
  name: string;
  email: string;
  passwordHash: string;
  roles: UserRole[];
  createdBy: string;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  private constructor(private props: UserProps) {}

  static create(props: CreateUserProps) {
    const now = props.createdAt ?? new Date();
    return new User({
      id: props.id ?? randomUUID(),
      nickname: props.nickname,
      name: props.name,
      email: props.email,
      passwordHash: props.passwordHash,
      roles: props.roles,
      createdAt: now,
      updatedAt: props.updatedAt ?? now,
      createdBy: props.createdBy,
    });
  }

  static restore(props: UserProps) {
    return new User(props);
  }

  updatePassword(hash: string) {
    this.props.passwordHash = hash;
    this.touch();
  }

  updateProfile(name: string, nickname: string) {
    this.props.name = name;
    this.props.nickname = nickname;
    this.touch();
  }

  updateRoles(roles: UserRole[]) {
    this.props.roles = roles;
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  get id() {
    return this.props.id;
  }

  get nickname() {
    return this.props.nickname;
  }

  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get passwordHash() {
    return this.props.passwordHash;
  }

  get roles() {
    return this.props.roles;
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
      nickname: this.nickname,
      name: this.name,
      email: this.email,
      roles: this.roles,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      createdBy: this.createdBy,
    };
  }
}
