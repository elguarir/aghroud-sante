import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import S3 from "aws-sdk/clients/s3";
import { env } from "@/env";
import { randomUUID } from "crypto";

const s3 = new S3({
  accessKeyId: env.R2_ACCESS_KEY,
  secretAccessKey: env.R2_SECRET_KEY,
  endpoint: env.R2_ENDPOINT,
  signatureVersion: "v4",
});

export const documentRouter = createTRPCRouter({
  generateUrl: protectedProcedure
    .input(z.object({ filename: z.string(), filetype: z.string() }))
    .mutation(async ({ input }) => {
      const { filename, filetype } = input;
      const fileId = randomUUID();
      const key = `${fileId}/${filename}`;

      const params = {
        Bucket: env.R2_BUCKET_NAME,
        Key: key,
        Expires: 120,
        ContentType: filetype,
      };

      const url = s3.getSignedUrl("putObject", params);
      return { url, key };
    }),
  getDocumentUrl: protectedProcedure
    .input(z.object({ key: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const { key } = input;
      const params = {
        Bucket: env.R2_BUCKET_NAME,
        Key: key,
        Expires: 3600,
      };
      const url = s3.getSignedUrl("getObject", params);
      return { url };
    }),
});

export async function getObjects() {
  const data = await s3
    .listObjectsV2({
      Bucket: env.R2_BUCKET_NAME,
    })
    .promise();

  return data.Contents;
}
