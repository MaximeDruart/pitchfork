export const changePage = (url) => {
  return {
    type: "CHANGE_PAGE",
    page: url,
  }
}
