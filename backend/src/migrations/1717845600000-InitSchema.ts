import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

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

    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'IDX_users_nickname',
        columnNames: ['nickname'],
        isUnique: true,
      }),
    );

    await queryRunner.createIndex(
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

    await queryRunner.createIndex(
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

    await queryRunner.createIndex(
      'models',
      new TableIndex({
        name: 'IDX_models_name',
        columnNames: ['name'],
      }),
    );

    await queryRunner.createForeignKey(
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

    await queryRunner.createIndex(
      'vehicles',
      new TableIndex({
        name: 'IDX_vehicles_license_plate',
        columnNames: ['license_plate'],
        isUnique: true,
      }),
    );

    await queryRunner.createIndex(
      'vehicles',
      new TableIndex({
        name: 'IDX_vehicles_chassis',
        columnNames: ['chassis'],
        isUnique: true,
      }),
    );

    await queryRunner.createIndex(
      'vehicles',
      new TableIndex({
        name: 'IDX_vehicles_renavam',
        columnNames: ['renavam'],
        isUnique: true,
      }),
    );

    await queryRunner.createForeignKey(
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
