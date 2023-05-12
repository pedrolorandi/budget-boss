// Importing necessary dependencies for category icons
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

// Function to retrieve the appropriate icon for a given category
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

// Function to format the date text based on whether it is today, yesterday, or another date
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

// Function to format the transaction text with the appropriate signal and amount
export function formatTransaction(type, amount) {
  const signal = type === "Income" ? "+" : "-";

  return signal + "$" + (amount / 100).toFixed(2);
}

// Function to format the category class name for styling purposes
export function formatCategoryClassName(category) {
  return category.toLowerCase().replaceAll(" ", "_").replace("&", "n");
}
