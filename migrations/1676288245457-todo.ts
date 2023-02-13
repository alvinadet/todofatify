import {MigrationInterface, QueryRunner} from "typeorm";

export class todo1676288245457 implements MigrationInterface {
    name = 'todo1676288245457'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`todos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` text NOT NULL, \`is_active\` tinyint NULL DEFAULT 1, \`priority\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`activity_group_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`todos\` ADD CONSTRAINT \`FK_73ef6e8f84da3fd84725eb3b93c\` FOREIGN KEY (\`activity_group_id\`) REFERENCES \`activities\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`todos\` DROP FOREIGN KEY \`FK_73ef6e8f84da3fd84725eb3b93c\``);
        await queryRunner.query(`DROP TABLE \`todos\``);
    }

}
