const sum = (/** @type {Number[]} */ array) => array.reduce((partialSum, a) => partialSum + a, 0);

function parseMillisecondsIntoReadableTime(milliseconds){
    //Get hours from milliseconds
    var hours = milliseconds / (1000*60*60);
    var absoluteHours = Math.floor(hours);
    var h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;
  
    //Get remainder from hours and convert to minutes
    var minutes = (hours - absoluteHours) * 60;
    var absoluteMinutes = Math.floor(minutes);
    var m = absoluteMinutes > 9 ? absoluteMinutes : '0' +  absoluteMinutes;
  
    //Get remainder from minutes and convert to seconds
    var seconds = (minutes - absoluteMinutes) * 60;
    var absoluteSeconds = Math.floor(seconds);
    var s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;
  
  
    return h + ':' + m + ':' + s;
  }

  function getLofidleIndex() {
    const startMs = new Date(2022, 10, 26, 0).getTime();
    const currentMs = new Date().getTime();
    return Math.floor((currentMs - startMs) / 1000 / 60 / 60 / 24)
  }

export {
    sum,
    parseMillisecondsIntoReadableTime,
    getLofidleIndex
}