export const dateToYearPercent = (date) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  let mdy = date.split(" ")
  return parseInt(mdy[2]) - 1999 + months.indexOf(mdy[0]) / 12 + parseInt(mdy[1]) / 365
}
