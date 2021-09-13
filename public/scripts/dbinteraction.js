// Получение данных 
async function GetData() {
    // отправляет запрос и получаем ответ
    const response = await fetch("/api/fortress", {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    // если запрос прошел нормально
    if (response.ok === true) {
        // получаем данные
        const values = await response.json();
        // заменяем данные в инпутах
        var inputs = document.querySelectorAll("input");
        for (i = 0; i < inputs.length; i++) {
            for (let b = 0; b < values.length; b++) {
                if (inputs[i].id == values[b].id) { //если атрибуты id совпадают
                    inputs[i].value = values[b].data //установка данных из базы                    
                    inputs[i].name = values[b]._id //замена дефолтного id на id из базы
                    var input = inputs[i];
                    // var InputClass = $('.input__date')
                    if ($(input).attr("type") == "datetime-local") {
                        if ($(input).css('z-index') == 11) {
                            $(input).parent().removeClass('time1').addClass('time');

                        }
                        if ($(input).css('z-index') == 10) {
                            $(input).parent().removeClass('time').addClass('time1');
                        }
                        ChangeData(input);
                    }
                }
            }
        }
    }
};

let timerId = setInterval(() => GetData(), 60 * 1000);

// Добавление данных
async function CreateData(fortressId, fortressData) {

    const response = await fetch("api/fortress", {

        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            id: fortressId,
            data: fortressData,
        })
    });
};

// Изменение данных
async function EditData(fortressId, fortressData) {
    const response = await fetch("api/fortress", {

        method: "PUT",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            id: fortressId,
            data: fortressData,

        })
    });
}

// отправка данных
document.querySelectorAll('input').forEach((element) => {
    element.addEventListener('change', function () {

        // invalid option in input
        if ($(element).css('z-index') == 11) {
            // clear row in table

            $(element).parent().removeClass('time1').addClass('time');            
            var parent = $(element).parent().parent();
            var tableList = $(parent).children(".hour-list__item").toArray();
            tableReset(tableList);
        }
        if ($(element).css('z-index') == 10){
            $(element).parent().removeClass('time').addClass('time1');
        }
        const data = this.value;
        const id = this.getAttribute("id");
        const name = this.getAttribute("name");
        if (name == 0)
            CreateData(id, data); //если ид по дефолту - создаем новый объект
        else
            EditData(id, data);//если ид не по дефолту (уже взят из базы)- изменяем объект

        // если инпут даты - вывод в таблицу
        if ($(element).attr("type") == "datetime-local") {
            ChangeData(element);
        }
    });
});

// загрузка данных
GetData();