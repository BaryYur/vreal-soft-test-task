import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { DatabaseModule } from "./modules/database";
import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";
import { DirectoryModule } from "./modules/directory/directory.module";
import { FileModule } from "./modules/file/file.module";
import { AwsModule } from "./modules/aws/aws.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UserModule,
    AuthModule,
    DirectoryModule,
    FileModule,
    AwsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
