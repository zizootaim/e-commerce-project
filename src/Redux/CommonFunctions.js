export const showCart = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  document.querySelector(".mini__cart").classList.toggle("show");
  document.body.classList.toggle("overlay");

  document.querySelector(".currencies__list").style.height = 0 + "px";
  document.querySelector(".currencies__list__top i").className =
    "fas fa-angle-down";
};

export const getTotal = (arr) => {
  let t = "";
  arr.forEach((p) => {
    t += p.total;
  });
  const tax = (t * (21 / 100)).toFixed(2);
  return { total: Number(t).toFixed(2), tax };
};

export const getQuantity = (arr) => {
  let q = 0;
  arr.forEach((i) => {
    q += i.count;
  });
  return q;
};

export const showCurrenciesList = () => {
  document.querySelector(".mini__cart").classList.remove("show");
  document.body.classList.remove("overlay");
  let height = 0,
    iconDir = "";
  const icon = document.querySelector(".currencies__list__top i");
  if (icon.className === "fas fa-angle-down") iconDir = "up";
  else iconDir = "down";
  Array.from(document.querySelector(".currencies__list").children).forEach(
    (li) => {
      height += li.getBoundingClientRect().height;
    }
  );
  if (iconDir === "down") height = 0;

  icon.className = `fas fa-angle-${iconDir}`;
  document.querySelector(".currencies__list").style.height = height + "px";
};

export const closeMenues = () => {
  document.querySelector(".mini__cart").classList.remove("show");
  document.body.classList.remove("overlay");
  document.querySelector(".currencies__list").style.height = "0px";
  document.querySelector(".currencies__list__top i").className =
    "fas fa-angle-down";
};

