import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { categoryIcons, formatTransaction } from "../../helpers/formatters.js";
import { faPen, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link.js";

export default function TransactionList({ transactions, formattedDates }) {
  return (
    <div className="p-5 bg-[#FFEFE1] rounded-lg flex flex-col flex-1 mt-2">
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
                      {`${transaction.title} @ ${transaction.source.name}`}
                      <span className="text-[#aaa] font-normal ms-2">{`[${transaction.account.name}]`}</span>
                    </div>
                    <div className="flex text-sm">{transaction.date}</div>
                  </div>
                  <div className="flex items-center font-bold text-xl">
                    {formatTransaction(
                      transaction.type,
                      transaction.amountDecimal
                    )}
                  </div>
                  <div className="flex items-center ps-3 ms-3">
                    <Link
                      href={`/transactions/edit/${encodeURIComponent(
                        transaction.id
                      )}`}
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </Link>
                  </div>
                  <div className="flex items-center ps-3">
                    <Link
                      href={`/transactions/delete/${encodeURIComponent(
                        transaction.id
                      )}`}
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
