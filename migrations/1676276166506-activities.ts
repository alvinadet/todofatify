import {MigrationInterface, QueryRunner} from "typeorm";

export class activities1676276166506 implements MigrationInterface {
    name = 'activities1676276166506'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`activities\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` text NOT NULL, \`email\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`activities\``);
    }

}
