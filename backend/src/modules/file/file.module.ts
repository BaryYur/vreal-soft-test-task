import { Module } from "@nestjs/common";

import { FileController } from "./file.controller";
import { FileService } from "./file.service";
import { S3Service } from "../aws/aws.service";

@Module({
  imports: [],
  controllers: [FileController],
  providers: [FileService, S3Service],
})
export class FileModule {}
