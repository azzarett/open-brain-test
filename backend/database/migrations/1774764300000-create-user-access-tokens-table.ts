import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateUserAccessTokensTable1774764300000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_access_tokens',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'token',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'user_access_tokens',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'user_access_tokens',
      new TableIndex({
        name: 'IDX_USER_ACCESS_TOKENS_TOKEN_UNIQUE',
        columnNames: ['token'],
        isUnique: true,
      }),
    );

    await queryRunner.createIndex(
      'user_access_tokens',
      new TableIndex({
        name: 'IDX_USER_ACCESS_TOKENS_USER_ID',
        columnNames: ['user_id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(
      'user_access_tokens',
      'IDX_USER_ACCESS_TOKENS_USER_ID',
    );
    await queryRunner.dropIndex(
      'user_access_tokens',
      'IDX_USER_ACCESS_TOKENS_TOKEN_UNIQUE',
    );

    const table = await queryRunner.getTable('user_access_tokens');
    const foreignKey = table?.foreignKeys.find((fk) =>
      fk.columnNames.includes('user_id'),
    );

    if (foreignKey) {
      await queryRunner.dropForeignKey('user_access_tokens', foreignKey);
    }

    await queryRunner.dropTable('user_access_tokens');
  }
}