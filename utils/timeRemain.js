const moment = require('moment');

// diff formula
// masaDepan.diff(masaLalu/Saatini, 'unitWaktu');

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
        return time.remainingTime = `${remainingTimeText} tersisa`
        // return task.timeLeft = `${timeLeftText} tersisa`
    }
    // Late time 
    // Late time 
    const calculateLateTime = (timeUnit) => {
        const lateTime = moment.duration(Math.abs(remainingTime), 'minutes').humanize(false)
            .replace('days', 'hari')
            .replace('hours', 'jam')
            .replace('minutes', 'menit')
            .replace('seconds', 'detik')
            .replace('a day', '1 hari')
            .replace('an hour', '1 jam');
        
        return `<span class="text-danger">Terlambat ${lateTime}</span>`;
    };

    if (remainingTime > 0) {
        if (remainingTime > minutesInDay || remainingTime > minutesInHour) {
            return timeConf();
        } else {
            return timeConf();
        }
    } else {
        // if (remainingTime < 0) {
        //     return calculateLateTime('minutes');
        // } else if (remainingTime < 60) {
        //     return calculateLateTime('hours');
        // } else {
        //     return calculateLateTime('days');
        // }
        return calculateLateTime('days');
    }    
}