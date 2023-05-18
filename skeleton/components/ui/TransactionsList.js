import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { categoryIcons, formatTransaction } from "../../helpers/formatters.js";
import { faPen, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link.js";

export default function TransactionList({
  transactions,
  formattedDates,
  indexPage,
  text,
}) {
  return (
    <div className="p-5 bg-[#FEEECD] rounded-2xl flex flex-col flex-1">
      {indexPage ? <h1>{text}</h1> : <h1>Transactions</h1>}
      {transactions.map(({ date, transactions }) => {
        return (
          <div className="mt-2 flex flex-col" key={date + transactions[0].id}>
            <span className="text-sm">{formattedDates[date]}</span>
            {transactions.map((transaction) => {
              return (
                <div
                  key={transaction.id}
                  className="flex mt-1 p-5 hover:rounded-xl hover:bg-[#FFDE9B]"
                >
                  <div className="flex items-center w-16">
                    <FontAwesomeIcon
                      icon={categoryIcons(transaction.category.name)}
                      size="3x"
                    />
                  </div>
                  <div className="flex flex-col ms-5 flex-1 justify-center">
                    <div className="flex font-semibold text-xl">
                      {`${transaction.title} @ ${transaction.source.name}`}
                      <span className="text-[#6C757D] font-normal ms-2">{`[${transaction.account.name}]`}</span>
                    </div>
                    <div className="flex text-sm">{transaction.date}</div>
                  </div>
                  <div className="flex items-center font-bold text-xl">
                    {formatTransaction(
                      transaction.type,
                      transaction.amountDecimal
                    )}
                  </div>
                  {!indexPage && (
                    <div className="flex items-center ps-3 ms-3">
                      <Link
                        href={`/transactions/edit/${encodeURIComponent(
                          transaction.id
                        )}`}
                        title="Edit transaction"
                      >
                        <FontAwesomeIcon
                          icon={faPen}
                          className="hover:text-linkHover"
                        />
                      </Link>
                    </div>
                  )}
                  {!indexPage && (
                    <div className="flex items-center ps-3">
                      <Link
                        href={`/transactions/delete/${encodeURIComponent(
                          transaction.id
                        )}`}
                        title="Delete transaction"
                      >
                        <FontAwesomeIcon
                          icon={faTrashCan}
                          className="hover:text-linkHover"
                        />
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
