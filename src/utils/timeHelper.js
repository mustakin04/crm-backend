const moment = require("moment-timezone");

const getTodayDate = () => {
  return moment().tz("Asia/Dhaka").format("YYYY-MM-DD");
};

const getCurrentTime = () => {
  return moment().tz("Asia/Dhaka").format("hh:mm A");
};

const isLate = () => {
  const now = moment().tz("Asia/Dhaka");
  const officeTime = moment().tz("Asia/Dhaka").set({
    hour: 10,
    minute: 15,
    second: 0,
  });

  return now.isAfter(officeTime);
};

const calculateWorkHours = (checkIn, checkOut) => {
  const format = "hh:mm A";
  const start = moment(checkIn, format);
  const end = moment(checkOut, format);

  const duration = moment.duration(end.diff(start));
  return duration.asHours().toFixed(2);
};

module.exports = {
  getTodayDate,
  getCurrentTime,
  isLate,
  calculateWorkHours,
};