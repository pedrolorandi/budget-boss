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
  faReceipt,
  faChartSimple,
  faChartPie,
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
// Function to convert a Date object to a formatted date string in the "YYYY-MM-DD" format
export function convertDate(date) {
  // Extract the year, month, and date components from the Date object
  const dateParts = [
    date.getFullYear(), // Year component
    ("0" + (date.getMonth() + 1)).slice(-2), // Month component (padded with leading zero if needed)
    ("0" + date.getDate()).slice(-2), // Date component (padded with leading zero if needed)
  ];

  // Join the date parts into a formatted date string using hyphens
  return dateParts.join("-");
}

export function linkIcons(link) {
  const LINK_ICONS = {
    Overview: faHouse,
    Accounts: faReceipt,
    Budgets: faChartSimple,
    Reports: faChartPie,
  };

  return LINK_ICONS[link];
}

// Function to format the date text based on whether it is today, yesterday, or another date
export function formatDate(transactions) {
  // Create a new Date object representing the current date and time
  const today = new Date();

  // Create a new Date object and set it to the same date and time as today
  const yesterday = new Date(today);

  // Subtract 1 day from yesterday's date
  yesterday.setDate(yesterday.getDate() - 1);

  // Initialize an empty object to store formatted transaction dates
  const transactionDates = transactions.reduce((datesObj, transaction) => {
    // Format the transaction date based on its value
    const formattedDate =
      transaction.date === convertDate(today)
        ? "Today"
        : transaction.date === convertDate(yesterday)
        ? "Yesterday"
        : transaction.date;

    // Assign the formatted date to the corresponding transaction date in the object
    datesObj[transaction.date] = formattedDate;

    // Return the updated object for the next iteration
    return datesObj;
  }, {});

  // Return the object containing formatted transaction dates
  return transactionDates;
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

export function formatDateISOString(date) {
  const today = new Date();
  const hours = today.getHours().toString().padStart(2, "0");
  const minutes = today.getMinutes().toString().padStart(2, "0");
  const time = `${hours}:${minutes}`;

  const dateAndTime = new Date(`${date}T${time}`);
  dateAndTime.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  const isoDateAndTime = dateAndTime.toISOString();
  return isoDateAndTime;
}
