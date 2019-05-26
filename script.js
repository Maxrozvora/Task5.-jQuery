$(document).ready(function() {
        $("#myTable").tablesorter();
        $( "#datepicker" ).datepicker();

    
    $('#searchBtn').on('click', function () {
        const value = $('#datepicker').val();
        console.log(new Date(value)); // TODO console.log
        tableSearch(value);
    })

    function tableSearch(value) {
        const td =  $('td.departure');        
        $.each(td,function (i, item) {
            const itemVale = item.innerText
            const valueDate = new Date(value).toLocaleDateString();
            const regPhrase = new RegExp(valueDate, 'i');
            if(!regPhrase.test(itemVale)) {
               $(item).parent().addClass('d-none');
            }
        })
    }

    const trainNumber = $('.number')
    for(let item of trainNumber) {
        const elem = $(item);
        const value = elem.text().slice(0, 3)
        if (value < 500) {
            elem.attr('title', 'Звичайний');
        } else {
            elem.attr('title', 'Фірмовий');
        }
    }

    trainNumber.tooltip();
});