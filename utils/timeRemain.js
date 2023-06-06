const moment = require('moment');

exports.remainingTime = (time) => {
    const minutesInDay = 1440;
    const minutesInHour = 60;

    const dueDate = moment(time.dueDate);
    const remainingTime = dueDate.diff(moment(), 'minutes');

    const timeConf = () => {
        let remainingTimeText = dueDate.fromNow(true)
            .replace('days', 'hari')
            .replace('hours', 'jam')
            .replace('minutes', 'menit')
            .replace('seconds', 'detik')
            .replace('a day', '1 hari')
            .replace('an hour', '1 jam');
        return time.remainingTime = `${remainingTimeText}`
    }

    if(remainingTime > 0) {
        if (remainingTime > minutesInDay || remainingTime > minutesInHour) {
            return time.remainingTime = timeConf();
        } else {
            return time.remainingTime = timeConf();
        }
    }
}

exports.countdownRejectLoan = (time, duration = "7") => {
    const minutesInDay = 1440;
    const minutesInHour = 60;

    const now = moment();
    const countdown = now.add(duration, 'days').fromNow();

    const timeConf = () => {
        let countdownText = dueDate.fromNow(true)
            .replace('days', 'hari')
            .replace('hours', 'jam')
            .replace('minutes', 'menit')
            .replace('seconds', 'detik')
            .replace('a day', '1 hari')
            .replace('an hour', '1 jam');
        return time.countdown = `${countdownText}`
    }

    if(countdown > 0) {
        // if (countdown > minutesInDay || countdown > minutesInHour) {
        //     return time.countdown = timeConf();
        // } else {
            return time.countdown = timeConf();
        // }
    }
}