import gsap from "gsap/gsap-core"

export const dateToYearPercent = (date, returnType = "cart") => {
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

  // sends back a value between 0 and 20
  let zero20range = parseInt(mdy[2]) - 1999 + months.indexOf(mdy[0]) / 12 + parseInt(mdy[1]) / 365
  if (returnType === "cart") {
    return zero20range
  } else if (returnType === "rad") {
    // sends back an angle in rad between 0 and 2PI
    return gsap.utils.mapRange(0, 20, 0, Math.PI * 2 * (62 / 64), zero20range)
  }
}

export const degToRad = (degrees) => degrees * (Math.PI / 180)

export const radToDeg = (rad) => rad / (Math.PI / 180)
