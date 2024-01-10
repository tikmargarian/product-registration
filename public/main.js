const registrationFrom = document.querySelector(".registration-form");

registrationFrom.addEventListener("submit", function (evt) {
    evt.preventDefault()
    
    const code = document.getElementById("code").value;
    const brand = document.getElementById("brand").value;
    const product = document.getElementById("product").value;
    const price = document.getElementById("price").value;

    fetch("/post", {
        method: "POST",
        headers: {
            "content-type" : "application/json"
        },
        body: JSON.stringify({
            code: code,
            brand: brand,
            product: product,
            price: price
        })
    })
    .then((response) => response.json())
    .then((data) => {
        if(data.status === "200") {
            console.log("Успешная регистрация!");
            registrationFrom.reset();

            let registrationMessage = document.getElementById("registration-message");
            registrationMessage.textContent = "Данные успешно сохранены"

            setTimeout(() => {
                registrationMessage.textContent = ""
            }, 2500)

        } else if(data.status === "300") {
            console.log("Товар с таким кодом уже существует")

            let registrationMessage = document.getElementById("registration-message");
            registrationMessage.textContent = "Товар с таким кодом уже существует"
            registrationMessage.style.color = "red"

            setTimeout(() => {
                registrationMessage.textContent = ""
                registrationMessage.style.color = "green"
            }, 2500)
        }
    })
    .catch((error) => {
        console.error("Ошибка при регистрации:", error);
    })
})