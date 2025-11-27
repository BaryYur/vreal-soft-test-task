import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  CopyObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

@Injectable()
export class S3Service {
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly logger = new Logger(S3Service.name);

  constructor(private config: ConfigService) {
    this.s3 = new S3Client({
      region: this.config.get("AWS_REGION"),
      credentials: {
        accessKeyId: this.config.get("AWS_ACCESS_KEY_ID") ?? "",
        secretAccessKey: this.config.get("AWS_SECRET_ACCESS_KEY") ?? "",
      },
    });
    this.bucket = this.config.get("S3_BUCKET") ?? "";
  }

  buildKey(ownerId: string, fileId: string, filename: string) {
    const safe = encodeURIComponent(filename);

    return `${ownerId}/${fileId}/${safe}`;
  }

  async getPresignedPutUrl(
    key: string,
    contentType?: string,
    expiresSeconds?: number,
  ) {
    const cmd = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });

    const url = await getSignedUrl(this.s3, cmd, {
      expiresIn:
        expiresSeconds ?? Number(this.config.get("S3_URL_EXP_SECONDS") ?? 900),
    });
    return url;
  }

  async getPresignedGetUrl(key: string, expiresSeconds?: number) {
    const cmd = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    const url = await getSignedUrl(this.s3, cmd, {
      expiresIn:
        expiresSeconds ?? Number(this.config.get("S3_URL_EXP_SECONDS") ?? 900),
    });
    return url;
  }

  async deleteObject(key: string) {
    const cmd = new DeleteObjectCommand({ Bucket: this.bucket, Key: key });
    await this.s3.send(cmd);
  }

  async copyObject(sourceKey: string, destKey: string) {
    const cmd = new CopyObjectCommand({
      Bucket: this.bucket,
      CopySource: `${this.bucket}/${sourceKey}`,
      Key: destKey,
    });
    await this.s3.send(cmd);
  }

  async exists(key: string) {
    try {
      await this.s3.send(
        new HeadObjectCommand({ Bucket: this.bucket, Key: key }),
      );
      return true;
    } catch (e) {
      return false;
    }
  }
}
