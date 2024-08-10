import dotenv from "dotenv";
dotenv.config();
import fileUpload from "express-fileupload";
import express from "express";
import cors from "cors";
imp.dirname(fileURLToPath(import.meta.url));

const app = express();

const dburl = process.env.MONGO_URL;

const connectDB = async () => {
    try {
        await mongoose.connect(dburl, {
            dbName: "numistics-db",
        });

        console.log("DB connected");
    } catch (error) {
        console.log(`DB Connection Error: ${error.message}`);
    }
};

connectDB();

app.use(
    cors({
        origin: "*",
    })
);
, "./views");

app.get("/test", async (req, res) => {
    try {
        res.render("verify-email");
    } catch (error) {
        console.log(error.message);
    }
});

app.set("trust proxy", true);

app.use(express.json({ limit: "50mb"
        tempFileDir: "/tmp/",
    })
);

app.use((req, res, next) => {
    const key = req.originalUrl || req.url;
    const cachedData = cache.get(key);

    if (cachedD
    }
});

app.get("/", async (req, res) => {
    try {
        res.sAPI Base Url");
    } catch (error) {
        console.log(error.message);
    }
});

app.use("/apiuter);

export default app;
