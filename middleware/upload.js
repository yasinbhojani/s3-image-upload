import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { s3 } from "../config/aws.js";
import { upload } from "../config/multer.js";
import { randomImageName } from "../utils/functions.js";

const bucketName = process.env.BUCKET_NAME;

/**
 * @param fieldName Name of the multipart form field to process.
 * @returns {import("express").RequestHandler}
 */
export const uploadImage = (fieldName) => {
  const uploadFunction = upload.single(fieldName);

  return async (req, res, next) => {
    await uploadFunction(req, res, async () => {
      const imageName = randomImageName();

      const pararms = {
        Bucket: bucketName,
        Key: imageName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };

      const command = new PutObjectCommand(pararms);
      await s3.send(command);

      req.body[fieldName] = imageName;

      next();
    });
  };
};

/**
 * @param imageName Name of the image
 * @returns URL of image
 */
export const getImageUrl = (imageName) => {
  return new Promise(async (resolve, reject) => {
    const getObjectParams = {
      Bucket: bucketName,
      Key: imageName,
    };

    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

    if (url) {
      resolve(url);
    } else {
      reject("image with provided name doesn't exist");
    }
  });
};
