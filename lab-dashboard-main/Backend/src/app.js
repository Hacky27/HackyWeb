import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import path from "path"

const app = express();

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
}));

// Increase limit for file uploads
app.use(express.json({ limit: "16mb" }))
app.use(express.urlencoded({
    extended: true,
    limit: "16mb"
}))

// Serve static files from the public directory at root level
app.use(express.static(path.join(path.dirname(process.cwd()), "public")))
app.use(cookieParser())

// Route imports
import { router as userRouter } from "./routes/user.route.js"
import { router as productRouter } from "./routes/product.route.js"
import { router as machineFormRouter } from "./routes/machineForm.route.js"
import { router as labManualRouter } from "./routes/labManual.route.js"
import { router as faqsRouter } from "./routes/faqs.route.js"
import { router as courseMaterialRouter } from "./routes/courseMaterial.route.js"
import { router as CourseVideoRouter } from "./routes/courseVideo.route.js"
import { router as checkoutRouter } from "./routes/checkout.route.js"
import { router as authRouter } from "./routes/auth.route.js"
import { router as examRouter } from "./routes/exam.route.js"
import { router as orderRouter } from "./routes/order.route.js"


// Routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/faqs", faqsRouter);
app.use("/api/v1/labManuals", labManualRouter);
app.use("/api/v1/machineForms", machineFormRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/courseMaterials", courseMaterialRouter);
app.use("/api/v1/courseVideos", CourseVideoRouter);
app.use("/api/v1/checkout", checkoutRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/exam", examRouter);

app.use("/api/v1/order", orderRouter);
// Handle 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    })
})

export { app }