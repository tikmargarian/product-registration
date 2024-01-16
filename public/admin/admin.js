const searchBtn = document.getElementById("search-button");
const inputEvent = document.getElementById("search-input");

searchBtn.addEventListener("click", function () {
    handleSearch()
})

inputEvent.addEventListener("keydown", function (evt) {
    if(evt.key === "Enter") {
        handleSearch()
    }
})

function handleSearch () {
    let inputValue = document.getElementById("search-input").value;
    let result = document.querySelector(".search-result");

    fetch(`/data?code=${inputValue}`)
    .then((result) => result.json())
    .then((dataArray) => {
        result.innerHTML = ""
        hideChangeDataForm()

        if(dataArray.length > 0) {
            dataArray.forEach(element => {
                const code = createElelemtWithText("p", `Код товара: ${element.code}`)
                const brand = createElelemtWithText("p", `Бренд товара: ${element.brand}`)
                const product = createElelemtWithText("p", `Имя товара: ${element.product}`)
                const price = createElelemtWithText("p", `Цена товара: ${element.price}`)
                const deleteBtn = createDeleteButton(element._id)
                const changeBtn = createChangebutton(element._id)
                
                result.appendChild(code)
                result.appendChild(brand)
                result.appendChild(product)
                result.appendChild(price)
                result.appendChild(deleteBtn)
                result.appendChild(changeBtn)
            });
        } else {
            result.textContent = "Товар не существует"
        }
    })
    .catch(error => {
        console.log("Error on fetching data", error)
    })
}

function createElelemtWithText (tag, text) {
    const element = document.createElement(tag);
    element.innerHTML = text
    return element
}

function createDeleteButton (id) {
    const deleteBtn = document.createElement("button");
    deleteBtn.setAttribute("id", "delete-button")
    deleteBtn.innerHTML = "Удалить товар"

    let result = document.querySelector(".search-result");

    deleteBtn.addEventListener("click", function () {
        fetch(`/delete/${id}`, {
            method: "DELETE"
        }).then((response) => {
            if(response.ok) {
                result.innerHTML = ""
                hideChangeDataForm()
            } else {
                console.log('Произошла ошибка при удалении данных:', response.status);
            }
        })
        .catch((error) => {
            console.error('Произошла ошибка при удалении данных:', error);
        })
    })

    return deleteBtn
}

function createChangebutton (id) {
    const changeDataBtn = document.createElement("button");
    changeDataBtn.setAttribute("id", "change-button");
    changeDataBtn.innerHTML = "Изменить данные товара"

    const changeDataDiv = document.getElementById("change-data")

    changeDataBtn.addEventListener("click", function () {
        changeDataDiv.classList.toggle("active");
        changeDataDiv.innerHTML = ""

        if(changeDataDiv.classList.contains("active")){
            changeDataDiv.appendChild(createChangeDataForm(id));
        }
        
    })

    return changeDataBtn
}

function createChangeDataForm (id) {
    const changeDataForm = document.createElement("form")
    changeDataForm.classList.add("change-data-form");
    // changeDataForm.setAttribute("data-id", id)
    // changeDataForm.setAttribute("data-action", "update")

    changeDataForm.addEventListener("submit", function(evt) {
        evt.preventDefault()

        const newCode = changeDataForm.querySelector('input[name="new-code"]').value;
        const newBrand = changeDataForm.querySelector('input[name="new-brand"]').value;
        const newProduct = changeDataForm.querySelector('input[name="new-product"]').value;
        const newPrice = changeDataForm.querySelector('input[name="new-price"]').value;

        fetch(`/update/${id}`, {
            method: "PUT",
            headers: {
                "content-type" : "application/json"
            },
            body: JSON.stringify({
                code: newCode,
                brand: newBrand,
                product: newProduct,
                price: newPrice
            })
        })
        .then((response) => {
            if(response.ok) {
                console.log("Данные успешно обновлены");
                changeDataForm.reset();

                let changeDataMessage = document.getElementById("change-data-message")
                let existingColor = changeDataMessage.style.color

                changeDataMessage.textContent = "Данные успешно изменены"
                changeDataMessage.style.color = "green";

                setTimeout(() => {
                    changeDataMessage.textContent = ""
                    changeDataMessage.style.color = existingColor;
                }, 2500)

            } else if(response.status === 403) {

                let changeDataMessage = document.getElementById("change-data-message");
                let existingColor = changeDataMessage.style.color

                changeDataMessage.textContent = "Товар с таким кодом уже существует";
                changeDataMessage.style.color = "red";

                setTimeout(() => {
                    changeDataMessage.textContent = "";
                    changeDataMessage.style.color = existingColor;
                }, 2500)
                
                console.log("Товар с таким кодом уже существует у другого товара");
            } 
            else {
                console.log('Произошла ошибка при обновлении данных:', response.status);
            }
        })
        .catch((error) => {
            console.error('Произошла ошибка при обновлении данных:', error);
        })
    })

    changeDataForm.appendChild(createNewInput("text", "Новый код", "new-code"))
    changeDataForm.appendChild(createNewInput("text", "Новый бренд", "new-brand"))
    changeDataForm.appendChild(createNewInput("text", "Новое имя", "new-product"))
    changeDataForm.appendChild(createNewInput("text", "Новая цена", "new-price"))
    changeDataForm.appendChild(createChangeDataButton(id))

    changeDataForm.querySelectorAll('input').forEach(input => input.setAttribute('required', 'required'));

    return changeDataForm
}

function createNewInput (type, placeholder, name) {
    const newInput = document.createElement("input");
    newInput.setAttribute("type", type);
    newInput.setAttribute("placeholder", placeholder);
    newInput.setAttribute("name", name)
    return newInput
}

function createChangeDataButton () {
    const changeDataBtn = document.createElement("button");
    changeDataBtn.setAttribute("id", "data-change-btn");
    changeDataBtn.setAttribute("type", "submit")
    changeDataBtn.innerHTML = "Сохранить новые данные "
    return changeDataBtn
}

function hideChangeDataForm () {
    const changeDataDiv = document.getElementById("change-data");
    changeDataDiv.classList.remove("active");
    changeDataDiv.innerHTML = ""
}