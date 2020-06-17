const getExclusionObject = (fields) => {
  if (Array.isArray(fields)) {
    let obj = {}
    fields.forEach((field) => (obj[field] = 0))
    return obj
  } else if (typeof fields === "string") return Object.fromEntries([[fields, 0]])
  return {}
}

module.exports = getExclusionObject
