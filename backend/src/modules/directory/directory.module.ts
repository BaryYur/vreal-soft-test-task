import { Module } from "@nestjs/common";

import { DirectoryController } from "./directory.controller";
import { DirectoryService } from "./directory.service";
import { DatabaseModule } from "../database";

@Module({
  imports: [DatabaseModule],
  controllers: [DirectoryController],
  providers: [DirectoryService],
  exports: [],
})
export class DirectoryModule {}
