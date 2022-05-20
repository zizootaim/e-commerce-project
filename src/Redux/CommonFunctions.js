export const showCart = (close) => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  document.querySelector(".mini__cart").classList.toggle("show");
  document.body.classList.toggle("overlay");
  // Close Currencies List
  document.querySelector(".currencies__list").style.height = 0 + "px";
  document.querySelector(".currencies__list__top i").className =
    "fas fa-angle-down";
};

export const  getTotal = (arr) =>{
  let t = 0
  arr.forEach(p => {
    t += p.total
  })
  const tax = t * (21/100);

  return {total:t-tax,tax};
}