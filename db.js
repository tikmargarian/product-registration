import mongoose from "mongoose"

const URI = process.env.DB_URI

mongoose.connect(URI).then(() => {
        console.log("Conected to database")
    }).catch((error) => {
        console.error("Eror to connection", error)
    })
   
// Прослушивание события ошибки подключения
mongoose.connection.on('error', err => {
    console.error('Database connection error:', err);
});

// Прослушивание события завершения работы приложения и закрытие соединения
process.on('SIGINT', () => {
    mongoose.connection.close().then(() => {
        console.log('Disconnected from the database');
        process.exit(0);
    }).catch((error) => {
        console.error('Error closing the database connection:', error);
        process.exit(1);
    });
}); 

const collection = "users"

const userSchema = new mongoose.Schema({
    code: String,
    brand: String,
    product: String,
    price: String
})

const Product = mongoose.model("User", userSchema, collection)

export { Product }