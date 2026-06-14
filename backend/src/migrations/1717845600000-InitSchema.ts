import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

// Cria o índice apenas se ele ainda não existir na tabela, tornando a migration
// idempotente quando o schema já foi provisionado (ex.: volume reaproveitado sem
// registro na tabela `migrations`), evitando o erro "index already exists".
const ensureIndex = async (
  queryRunner: QueryRunner,
  tableName: string,
  index: TableIndex,
): Promise<void> => {
  const table = await queryRunner.getTable(tableName);
  if (!table?.indices.some((existing) => existing.name === index.name)) {
    await queryRunner.createIndex(tableName, index);
  }
};

// Idem para chaves estrangeiras: só cria se ainda não existir.
const ensureForeignKey = async (
  queryRunner: QueryRunner,
  tableName: string,
  foreignKey: TableForeignKey,
): Promise<void> => {
  const table = await queryRunner.getTable(tableName);
  if (
    !table?.foreignKeys.some((existing) => existing.name === foreignKey.name)
  ) {
    await queryRunner.createForeignKey(tableName, foreignKey);
  }
};

export class InitSchema1717845600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uniqueidentifier',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
            default: 'NEWID()',
          },
          {
            name: 'nickname',
            type: 'nvarchar',
            length: '150',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'nvarchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'nvarchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'password_hash',
            type: 'nvarchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'roles',
            type: 'nvarchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'datetime2',
            default: 'SYSDATETIME()',
          },
          {
            name: 'updated_at',
            type: 'datetime2',
            default: 'SYSDATETIME()',
          },
          {
            name: 'created_by',
            type: 'nvarchar',
            length: '150',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await ensureIndex(
      queryRunner,
      'users',
      new TableIndex({
        name: 'IDX_users_nickname',
        columnNames: ['nickname'],
        isUnique: true,
      }),
    );

    await ensureIndex(
      queryRunner,
      'users',
      new TableIndex({
        name: 'IDX_users_email',
        columnNames: ['email'],
        isUnique: true,
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'brands',
        columns: [
          {
            name: 'id',
            type: 'uniqueidentifier',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
            default: 'NEWID()',
          },
          {
            name: 'name',
            type: 'nvarchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'datetime2',
            default: 'SYSDATETIME()',
          },
          {
            name: 'updated_at',
            type: 'datetime2',
            default: 'SYSDATETIME()',
          },
          {
            name: 'created_by',
            type: 'nvarchar',
            length: '150',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await ensureIndex(
      queryRunner,
      'brands',
      new TableIndex({
        name: 'IDX_brands_name',
        columnNames: ['name'],
        isUnique: true,
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'models',
        columns: [
          {
            name: 'id',
            type: 'uniqueidentifier',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
            default: 'NEWID()',
          },
          {
            name: 'name',
            type: 'nvarchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'brand_id',
            type: 'uniqueidentifier',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'datetime2',
            default: 'SYSDATETIME()',
          },
          {
            name: 'updated_at',
            type: 'datetime2',
            default: 'SYSDATETIME()',
          },
          {
            name: 'created_by',
            type: 'nvarchar',
            length: '150',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await ensureIndex(
      queryRunner,
      'models',
      new TableIndex({
        name: 'IDX_models_name',
        columnNames: ['name'],
      }),
    );

    await ensureForeignKey(
      queryRunner,
      'models',
      new TableForeignKey({
        name: 'FK_models_brand',
        columnNames: ['brand_id'],
        referencedTableName: 'brands',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'vehicles',
        columns: [
          {
            name: 'id',
            type: 'uniqueidentifier',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
            default: 'NEWID()',
          },
          {
            name: 'license_plate',
            type: 'nvarchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'chassis',
            type: 'nvarchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'renavam',
            type: 'nvarchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'year',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'model_id',
            type: 'uniqueidentifier',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'datetime2',
            default: 'SYSDATETIME()',
          },
          {
            name: 'updated_at',
            type: 'datetime2',
            default: 'SYSDATETIME()',
          },
          {
            name: 'created_by',
            type: 'nvarchar',
            length: '150',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await ensureIndex(
      queryRunner,
      'vehicles',
      new TableIndex({
        name: 'IDX_vehicles_license_plate',
        columnNames: ['license_plate'],
        isUnique: true,
      }),
    );

    await ensureIndex(
      queryRunner,
      'vehicles',
      new TableIndex({
        name: 'IDX_vehicles_chassis',
        columnNames: ['chassis'],
        isUnique: true,
      }),
    );

    await ensureIndex(
      queryRunner,
      'vehicles',
      new TableIndex({
        name: 'IDX_vehicles_renavam',
        columnNames: ['renavam'],
        isUnique: true,
      }),
    );

    await ensureForeignKey(
      queryRunner,
      'vehicles',
      new TableForeignKey({
        name: 'FK_vehicles_model',
        columnNames: ['model_id'],
        referencedTableName: 'models',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('vehicles', 'FK_vehicles_model');
    await queryRunner.dropTable('vehicles');

    await queryRunner.dropForeignKey('models', 'FK_models_brand');
    await queryRunner.dropTable('models');

    await queryRunner.dropTable('brands');
    await queryRunner.dropTable('users');
  }
}
