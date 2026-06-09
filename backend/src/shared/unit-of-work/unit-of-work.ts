import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export class UnitOfWork {
  constructor(private readonly dataSource: DataSource) {}

  async execute<T>(work: (manager: EntityManager) => Promise<T>): Promise<T> {
    return this.dataSource.transaction(async (entityManager) =>
      work(entityManager),
    );
  }
}
