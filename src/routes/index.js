import { Router } from "express";
import inquiresRouter from "./inquires.routes.js"
import literatureRouter from "./literature.routes.js"
import userRouter from "./users.routes.js"

const router = Router()

router.use("/users", userRouter)
router.use("/litera", literatureRouter)
router.use("/inquires", inquiresRouter)

router.get("/", (req, res) => {
    res.send("API ishlayapti!");
  });

export default router;
