import { DataSource } from 'typeorm';

import { UnitOfWork } from '../../../src/shared/unit-of-work/unit-of-work';
import { ModelOrmEntity } from '../../../src/modules/fleet/infrastructure/entities/model.orm-entity';
import { BrandOrmEntity } from '../../../src/modules/fleet/infrastructure/entities/brand.orm-entity';
import { VehicleOrmEntity } from '../../../src/modules/fleet/infrastructure/entities/vehicle.orm-entity';

describe('UnitOfWork', () => {
  let dataSource: DataSource;
  let unitOfWork: UnitOfWork;

  beforeAll(async () => {
    dataSource = new DataSource({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: [ModelOrmEntity, BrandOrmEntity, VehicleOrmEntity],
      synchronize: true,
    });
    await dataSource.initialize();
    unitOfWork = new UnitOfWork(dataSource);
  });

  afterAll(async () => {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  afterEach(async () => {
    if (dataSource.isInitialized) {
      await dataSource.getRepository(ModelOrmEntity).clear();
    }
  });

  it('rolls back changes when work throws', async () => {
    await expect(
      unitOfWork.execute(async (manager) => {
        const repository = manager.getRepository(ModelOrmEntity);
        await repository.save(
          repository.create({
            name: 'rollback-model',
            brandId: null,
            createdBy: 'tester',
          }),
        );

        throw new Error('forced failure');
      }),
    ).rejects.toThrow('forced failure');

    const persisted = await dataSource.getRepository(ModelOrmEntity).count();
    expect(persisted).toBe(0);
  });
});
