// Category icons
import {
  faBus,
  faShirt,
  faUtensils,
  faUserGraduate,
  faLaptop,
  faBurger,
  faGift,
  faCartShopping,
  faPeopleRoof,
  faWifi,
  faBuildingColumns,
  faHospital,
  faUser,
  faPaw,
  faHouse,
  faArrowsSpin,
  faSackDollar,
} from "@fortawesome/free-solid-svg-icons";

export function categoryIcons(category) {
  const CATEGORY_ICONS = {
    Transportation: faBus,
    Clothing: faShirt,
    "Dining Out": faUtensils,
    Education: faUserGraduate,
    Electronics: faLaptop,
    "Fast-Food": faBurger,
    Gifts: faGift,
    Groceries: faCartShopping,
    Household: faPeopleRoof,
    "Internet & Phone": faWifi,
    Loans: faBuildingColumns,
    Medical: faHospital,
    Personal: faUser,
    Pet: faPaw,
    Rent: faHouse,
    Subscriptions: faArrowsSpin,
    Income: faSackDollar,
  };

  return CATEGORY_ICONS[category];
}

// Check if the date is today or yesterday and format text accordingly
export function formatDate(date) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  return date === today.toLocaleDateString()
    ? "Today"
    : date === yesterday.toLocaleDateString()
    ? "Yesterday"
    : date;
}

export function formatAmount(type, amount) {
  const signal = type === "Income" ? "+$" : "-$";
  const cents = (amount / 100).toFixed(2);

  return signal + cents;
}
