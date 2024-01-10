import mongoose from "mongoose"

const URI = process.env.DB_URI

mongoose.connect(URI).then(() => {
        console.log("Conected to database")
    }).catch((error) => {
        console.error("Eror to connection", error)
    })

const collection = "users"

const userSchema = new mongoose.Schema({
    code: String,
    brand: String,
    product: String,
    price: String
})

const Product = mongoose.model("User", userSchema, collection)

export { Product }