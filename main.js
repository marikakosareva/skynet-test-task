$(function() {

    $.ajax({
        type:'POST',
        url:'index.php',
        success:function(msg){
            //alert(msg);
            window.data = JSON.parse(msg);
            showAllTarifs();
        }
    });
});

function showAllTarifs() {

    let colorCounter = 0;
    if (!!window.data.tarifs) {
        for (const [index, elem] of window.data.tarifs.entries()) {
            //alert("yes");
            colorCounter ++;
            let maxPrice = 0;
            let minPrice = 0;
            if (!!elem.tarifs){
                maxPrice = elem.tarifs.reduce(function(max, current) {
                    if (max >= current.price/current.pay_period) return max;
                    else return current.price/current.pay_period;
                }, 0);
                minPrice = elem.tarifs.reduce(function(min, current) {
                    if (min == 0) min = Infinity;
                    if (min <= current.price/current.pay_period) return min;
                    else return current.price/current.pay_period;
                }, 0);
            }

            let free_options = "";
            if (!!elem.free_options){
                for (option of elem.free_options) {
                    free_options += `<p class="option">${option}</p>`;
                }
                free_options = `<div class="options-list">${free_options}</div>`;
            }



            let tarifBlock = `<div class="tarif-block">
                                        <div class="tarif-block-content">
                                            <p class="tarif-name title info-box">Тариф ${elem.title}</p>
                                            <hr>
                                            <div onclick="showTarifDetails(${index})" class="extra-info">
                                                <div class="extra-info-content">
                                                    <p class="tarif-speed ${colorCounter % 3 == 0 ? 'label-red' : (colorCounter + 1) % 3 == 0 ? 'label-blue' : 'label-brown'}">${elem.speed} Мбит/с</p>
                                                    <p class="tarif-price">${minPrice} - ${maxPrice} &#8381/мес </p>
                                                    ${free_options}
                                                </div>
                                                <div class="arrow-box">
                                                    <img src="img/arrow.svg">
                                                </div>
                                            </div>
                                            <hr>
                                            <div class="site-link-block info-box">
                                                <a class="site-link" href="https://www.sknt.ru">узнать подробнее на сайте www.sknt.ru</a>
                                            </div>
                                        </div>
                                    </div>`;
            $(tarifBlock).on("click",function() {
                showDetails(index)});

            $("div.page1").append(tarifBlock);
        }
    }

}

function backToTarifOverview() {
    $("div.page2").hide();
    $("div.page2").html("");
    $("div.details-tarif-title").hide();
    $("div.details-tarif-title").html("");
    $("div.page1").show();
}

function showTarifDetails(id){

    //alert(id);
    if (!!window.data.tarifs[id]) {
        $("div.page1").hide();
        let tarifTitleBlock = `<div class="tarif-title">
                                    <img onclick="backToTarifOverview()" src="img/arrow-back.png">
                                    <span>${window.data.tarifs[id].title}</span>
                                </div>`;
        $("div.details-tarif-title").append(tarifTitleBlock);
        for (const [index, elem] of window.data.tarifs[id].tarifs.sort((a, b) => a.id - b.id).entries()) {
            let tarifDetailsBlock = `<div class="tarif-block">
                                                    <div class="tarif-block-content">
                                                        <p class="tarif-name title info-box">${elem.pay_period} ${elem.pay_period == 1 ? "месяц" : elem.pay_period < 5 ? "месяца" : "месяцев"}</p>
                                                        <hr>
                                                        <div onclick="showSelectedTarif(${id},${index})" class="extra-info">
                                                            <div class="extra-info-content">
                                                                <p class="tarif-price details">${elem.price/elem.pay_period} &#8381/мес </p>
                                                                <div class="options-list">
                                                                    <p class="option">разовый платёж - ${elem.price} &#8381</p>
                                                                    <p class="option">скидка - ${elem.price_add} &#8381</p>
                                                                </div>
                                                            </div>
                                                            <div class="arrow-box">
                                                                <img src="img/arrow.svg">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>`;

            
            $("div.page2").append(tarifDetailsBlock);
        }
        $("div.page2").show();
        $("div.details-tarif-title").show();
    }
}

function backToTarifDetails() {
    $("div.page3").hide();
    $("div.page3").html("");
    $("div.selection-tarif-title").hide();
    $("div.selection-tarif-title").html("");
    $("div.page2").show();
    $("div.details-tarif-title").show();
}

function showSelectedTarif(id, index) {
    $("div.details-tarif-title").hide();
    $("div.page2").hide();
    let date = new Date();
    date.setMonth(date.getMonth() + window.data.tarifs[id].tarifs[index].pay_period);

    let selectedBlockTitle = `<div class="tarif-title">
                                <img onclick="backToTarifDetails()" src="img/arrow-back.png">
                                <span>Выбор тарифа</span>
                           </div>`;
    $("div.selection-tarif-title").append(selectedBlockTitle);

    let dateString = date.getDate() + "." + date.getMonth() + "." + date.getFullYear();
    let payPeriod = window.data.tarifs[id].tarifs[index].pay_period;
    let selectedTarifBlock = `<div class="tarif-block">
                                <div class="tarif-block-content">
                                    <p class="tarif-name title info-box">Тариф ${window.data.tarifs[id].title}</p>
                                    <hr>
                                    <div class="extra-info">
                                        <div class="extra-info-content">
                                            <div class="options-list tarif-price">
                                                <p class="option">Период оплаты - ${payPeriod} ${payPeriod == 1 ? "месяц" : payPeriod < 5 ? "месяца" : "месяцев"}</p>
                                                <p class="option">${window.data.tarifs[id].tarifs[index].price/payPeriod} &#8381/мес</p>
                                            </div>
                                            <div class="options-list">
                                                <p class="option">разовый платеж - ${window.data.tarifs[id].tarifs[index].price} &#8381</p>
                                                <p class="option">со cчёта спишется - ${window.data.tarifs[id].tarifs[index].price} &#8381</p>
                                            </div>
                                            <div class="options-list activation-time">
                                                <p class="option">вступит в силу - сегодня</p>
                                                <p class="option">активен до - ${dateString}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <hr>
                                    <div class="tarif-select">
                                        <a href="${window.data.tarifs[id].link}">Выбрать</a>
                                    </div>
                                </div>
                            </div>`;
    $("div.page3").append(selectedTarifBlock);
    $("div.page3").show();
    $("div.selection-tarif-title").show();

}
