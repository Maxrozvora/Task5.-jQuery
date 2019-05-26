const cities = ['Київ', 'Харків', 'Львів', 'Одеса', 'Дніпро'];

const distances = [
    [0, 200, 250, 300, 350],
    [200, 0, 300, 350, 400],
    [250, 300, 0, 400, 200],
    [300, 350, 400, 0, 250],
    [350, 400, 200, 250, 0]
];

const dayOfWeek = ["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота"];


const data = [];


const schedule = {

    getRandomCityIndex(cities) {
        return this.randomInteger(0, cities.length - 1);
    },

    getArriveCity() {
        const n = prompt('Введіть кількість поїздів', 20);

        if ( n > 20 || n <= 0 || isNaN(n)) {
            alert('Ви ввели неправильне значення')
        } else {
            const usedCities = [];

            while (data.length < n && n <= 20) {
                const randDepartureCity = this.getRandomCityIndex(cities);

                const randArrivalCity = this.getRandomCityIndex(cities);

                let departureCity = cities[randDepartureCity];

                let arrivalCity = cities[randArrivalCity];


                if (randDepartureCity == randArrivalCity) {
                    continue
                }

                if (!usedCities.includes(departureCity + arrivalCity)) {
                    usedCities.push(departureCity + arrivalCity);
                    data.push(this.createScheduleItem(randDepartureCity, randArrivalCity))
                }
            }
        }

    },

    createScheduleItem(randDepartureCity, randArrivalCity) {

        const date = new Date(this.randomInteger(new Date().getTime(), new Date().getTime() + 604800000));

        const distance = this.getDistance(randDepartureCity, randArrivalCity);

        const data = new Date(date);

        const averageSpeed = this.randomInteger(80, 120);

        const arriveTime = data.addHours(this.getTravelTime(distance, averageSpeed));

        const cost = (distance / averageSpeed * 40.251).toFixed(2);

        return {
            'from': cities[randDepartureCity],
            'to': cities[randArrivalCity],
            'number': this.getNumberOfTrain(),
            'day': dayOfWeek[date.getDay()],
            'departure': {
                'left': new Date(date).getTime(),
                'day': this.getDayOfWeek(date),
                'time': this.getTimeFormat(date)
            },
            'arrive': {
                'day': this.getDayOfWeek(arriveTime),
                'time': this.getTimeFormat(arriveTime)
            },
            'cost': cost
        };
    },

    getNumberOfTrain() {
        const letter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        return this.randomInteger(100, 999) + letter[this.randomInteger(0, letter.length - 1)];
    },

    randomInteger(min, max) {
        const rand = min - 0.5 + Math.random() * (max - min + 1);
        return Math.round(rand);

    },

    getDayOfWeek(date) {
        // if (date.getDate() === new Date().getDate()) {
        //     return 'Сьгодні'
        // } else if (date.getDate() === new Date().getDate() + 1) {
        //     return 'Завтра'
        // } else {
            return dayOfWeek[date.getDay()]
        // }
    },

    getTravelTime(distance, averageSpeed) {
        const result = (distance / averageSpeed).toFixed(2) * 60;
        const hours = result / 60 | 0;
        const minutes = (result % 60).toFixed();
        return [hours, parseInt(minutes)]
    },

    getTimeFormat(time) {
        let hours = time.getHours();
        let minutes = time.getMinutes();
        if (minutes <= 9) {
            minutes = `0${time.getMinutes()}`
        }
        if (hours <= 9) {
            hours = `0${time.getHours()}`
        }
        return `${hours} : ${minutes}`
    },

    getDistance(from, to) {
        return distances[from][to];
    },


    renderTable(data) {
        let tr = '';
        for (let item of data) {
            const itemRow = `<tr>
      <td>${item.number}</td>
      <td>${item.from}</td>
      <td>${item.to}</td>
      <td>${item.day}</td>
      <td class="timer" data-timer="${item.departure.left}">${item.departure.left}</td>
      <td>
        <div>${item.departure.day}</div>
        <div>${item.departure.time}</div>
        </td>
      <td>
        <div>${item.arrive.day}</div>
        <div>${item.arrive.time}</div>
        </td>
      <td>${item.cost}</td>
    </tr>`

            tr = tr + itemRow;

        }

        document.querySelector('tbody').innerHTML = tr
    },

    timer(timeLeft, item) {
        const target_date = parseInt(timeLeft);
        let days, hours, minutes, seconds;

        getCountdown();

        setInterval(function () { getCountdown(); }, 1000);

        function getCountdown(){  

            let current_date = new Date().getTime();
            let seconds_left = (target_date - current_date) / 1000;

            days = pad( parseInt(seconds_left / 86400) );
            seconds_left = seconds_left % 86400;

            hours = pad( parseInt(seconds_left / 3600) );
            seconds_left = seconds_left % 3600;

            minutes = pad( parseInt(seconds_left / 60) );
            seconds = pad( parseInt( seconds_left % 60 ) );

            item.innerHTML = `<span>  ${days} дн. </span><span>${hours}:</span> <span> ${minutes}:</span> <span>${seconds}</span>`;
        }

        function pad(n) {
            return (n < 10 ? '0' : '') + n;
        }
    },

    startTimer() {
        const timerEl = document.querySelectorAll('.timer');
        timerEl.forEach(item => {
            const timeLeft = item.getAttribute('data-timer');
             this.timer(timeLeft, item);
        })
    },

    init() {
        this.getArriveCity();
        this.getNumberOfTrain();
        this.renderTable(data);
        this.startTimer();
    }
};

Date.prototype.addHours = function (time) {
    this.setHours(this.getHours() + time[0]);
    this.setMinutes(this.getMinutes() + time[1]);
    return this;
};

function saveTrain(data, filename){
    data = JSON.stringify(data, undefined, 4);
    let blob = new Blob([data], {type: 'text/json'});
    let a = document.querySelector('.btn');
    a.download = filename;
    a.href = window.URL.createObjectURL(blob)

}

schedule.init();

saveTrain(data, 'test.json');

$(document).ready(function()
    {
        $("#myTable").tablesorter();
    }
);









