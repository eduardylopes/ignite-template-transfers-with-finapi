import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterTableStatementCreateReceiverColumn1655662707877
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "statements",
      new TableColumn({ name: "receiver_id", type: "uuid", isNullable: true })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("statements", "receiver_id");
  }
}
