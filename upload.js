import { Router } from "express";
import dotenv from "dotenv";
import { Images } from "./models/Images.js";
import { deleteImage, getImageUrl, uploadImage } from "./middleware/upload.js";

const router = Router();

dotenv.config();

router.get("/product/:id", async (req, res, next) => {
  try {
    const url = await getImageUrl(req.params.id);

    res.status(200).json({ imageUrl: url });
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message || err || "an error occured!");
  }
});

router.post("/product", uploadImage("image"), async (req, res, next) => {
  try {
    const image = await Images.create({
      name: req.body.image,
    });

    res.status(200).json(image);
  } catch (error) {
    res.status(500).json(err.message || err || "an error occured!");
  }
});

router.delete("/product/:id", async (req, res, next) => {
  try {
    await deleteImage(req.params.id);

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message || err || "an error occured!");
  }
});

export default router;
