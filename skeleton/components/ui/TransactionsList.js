import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { categoryIcons, formatTransaction } from "../../helpers/formatters.js";

export default function TransactionList({ transactions, formattedDates }) {
  return (
    <>
      <div className="p-5 bg-mid-gray rounded-lg flex flex-col flex-1">
        <h1>Transactions</h1>
        {transactions.map(({ date, transactions }) => {
          return (
            <div className="mt-5 flex flex-col" key={date + transactions[0].id}>
              <span className="text-sm">{formattedDates[date]}</span>
              {transactions.map((transaction) => {
                return (
                  <div key={transaction.id} className="flex mt-5">
                    <div className="flex items-center w-16">
                      <FontAwesomeIcon
                        icon={categoryIcons(transaction.category.name)}
                        size="3x"
                      />
                    </div>
                    <div className="flex flex-col ms-5 flex-1 justify-center">
                      <div className="flex font-semibold text-xl">
                        {transaction.title} - {transaction.accountId}
                      </div>
                      <div className="flex text-sm">{transaction.date}</div>
                    </div>
                    <div className="flex items-center font-bold text-xl">
                      {formatTransaction(
                        transaction.type,
                        transaction.amountDecimal
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}
