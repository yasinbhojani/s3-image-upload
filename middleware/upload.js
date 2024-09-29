import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
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
      if (req.file) {
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
      }

      next();
    });
  };
};

/**
 * @param imageName Name of the image
 * @returns URL of image
 */
export const getImageUrl = async (imageName) => {
  try {
    const getObjectParams = {
      Bucket: bucketName,
      Key: imageName,
    };

    const command = new GetObjectCommand(getObjectParams);
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

    return url;
  } catch (error) {
    console.error("Error getting signed URL:", error);
    throw new Error("Could not generate image URL");
  }
};

/**
 * @param imageName Name of the image
 * @returns {boolean} `true` if the image is deleted successfully, or `false` if it fails
 */
export const deleteImage = async (imageName) => {
  try {
    const params = {
      Bucket: bucketName,
      Key: imageName,
    };

    const command = new DeleteObjectCommand(params);
    await s3.send(command);

    return true;
  } catch (error) {
    console.error("Error deleting image:", error);
    return false;
  }
};
