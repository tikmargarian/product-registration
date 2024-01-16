import express from "express"
import path from "path"
import { Product } from "./db.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"))
app.use("/admin", express.static(path.resolve("public/admin")));

app.get("/main", (req, res) => {
    res.sendFile(path.resolve("public/main.html"))
})

app.get("/data", async (req, res) => {
    try {
        let product = await Product.find( { "code": req.query.code} )

        res.send(product)
    } catch (err) {
        res.status(400).json({
            status: "400",
            message: err.message
        })
    }
})

app.post("/post", async (req, res) => {
    try {
        const { code, brand, product, price } = req.body;

        const existingProduct = await Product.findOne({ code });

        if (existingProduct) {
            // Товар с таким кодом уже существует
            return res.status(403).json({
                status: "403",
                message: "Товар с таким кодом уже существует"
            });
        }

        let productItem = new Product({ code, brand, product, price });
        productItem = await productItem.save(); // Сохранение продукта

        res.status(200).json({
            status: "200"
            // Данные успешно сохранены
        })

    } catch (err) {
        res.status(400).json({
            status: "400",
            message: err.message
        });
    }
});

app.put("/update/:id", async (req, res) => {
    try {
        const { code } = req.body
        
        const existingProduct = await Product.findOne({ code, _id: { $ne: req.params.id } });

        if (existingProduct) {
            // Товар с таким кодом уже существует
            return res.status(403).json({
                status: "403",
                message: "Товар с таким кодом уже существует"
            });
        }

        const query = {_id: req.params.id}
        const updatedProduct = await Product.findByIdAndUpdate( query, req.body, {new: true})
        
        if(updatedProduct) {
            // console.log("Документ успешно обновлен:", updatedProduct);
            res.status(200).json(updatedProduct);
        } else {
            console.log("Документ не найден.");
            res.status(404).send("Документ не найден");
        }
    } catch (err) {
        console.error("Ошибка при обновлении документа:", err);
        res.status(500).send("Internal Server Error");
    }
})

app.delete("/delete/:id", async (req, res) => {
    try {
        await Product.deleteOne({"_id": req.params.id });
        res.send("User deleted successfully");
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});