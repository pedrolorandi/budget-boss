import { Inter } from "next/font/google";
import prisma from "@/prisma/prismaclient";
import useHook from '../hooks/useHook';

import { getAllTransactions, getSixTransactions} from '../helpers/selectors';
import Transactions from '../pages/transactions/index';
// import TransactionList from "@/components/ui/TransactionsList";
// import RunningTotalChart from "@/components/ui/RunningTotalChart";

const inter = Inter({ subsets: ["latin"] });

export default function Home({ month, year, indexPage, transactionsRecent, transactionsUpcoming}) {
  const {route} = useHook();

  return (
    <>
      <div className="bg-[#FFF] flex flex-col flex-1 rounded-lg p-5">
        <div className="flex flex-row items-center">
          <img src="images/user-icon.png" className="flex h-20" />
          <h1 className="text-4xl ms-5">Hi, Jane!</h1>
        </div>
      </div>

      <div className="flex" style={{marginTop: '-10px', marginLeft: '290px'}}>
        <div className="w-1/2 p-32" style={{padding: '10px'}} onClick={() => route.push('/transactions')}>
          <Transactions 
          month={month} year={year} transactions={transactionsRecent} 
          indexPage={indexPage} text="Recent transactions"
          />
        </div>
        <div className="w-1/2 p-32" style={{padding: '10px', marginLeft: '70px'}} onClick={() => route.push('/transactions')}>
          <Transactions 
          month={month} year={year} transactions={transactionsUpcoming} 
          indexPage={indexPage} text="Upcoming transactions"
          />
        </div>
      </div>

    </>
  );
}

export async function getServerSideProps() {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const transactionList = await getAllTransactions(1, currentMonth, currentYear);
  

  const today = new Date().toISOString().slice(0,10);

  const SixTransactions = getSixTransactions(today, transactionList);  
  const transactionsRecent = SixTransactions.slice(0,3);
  const transactionsUpcoming = SixTransactions.splice(3,3);
  
  const indexPage = true;

  return {
    props: {      
      year: currentYear,
      transactionsRecent: transactionsRecent,
      transactionsUpcoming: transactionsUpcoming,
      indexPage: indexPage,
    },
  };
}


