// import Head from "next/head";
// import Image from "next/image";
import { Inter } from "next/font/google";
import prisma from "@/prisma/prismaclient";

import Layout from "@/components/layout/Layout";
import { getTransactions } from "../helpers/selectors";
import Transactions from '../pages/transactions/index';
// import TransactionList from "@/components/ui/TransactionsList";
// import RunningTotalChart from "@/components/ui/RunningTotalChart";

const inter = Inter({ subsets: ["latin"] });

export default function Home({ user, month, year, transactions, nextMonth, transactionsNextMonth, indexPage}) {
  return (
    <>
      <Layout user={user}></Layout>
      <div className="flex">
        <div className="w-1/2 p-32" style={{paddingRight: '10px'}}>
          <Transactions 
          month={month} year={year} transactions={transactions} 
          indexPage={indexPage} text="Recent transactions"
          />
        </div>
        <div className="w-1/2 p-32" style={{paddingRight: '10px'}}>
          <Transactions 
          month={nextMonth} year={year} transactions={transactionsNextMonth} 
          indexPage={indexPage} text="Upcoming transactions"
          />
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const currentMonth = new Date().getMonth() + 1;
  const nextMonth = new Date().getMonth() + 2;
  const currentYear = new Date().getFullYear();
  const transactions = await getTransactions(1, currentMonth, currentYear);
  const transactionsNextMonth = await getTransactions(1, nextMonth, currentYear);
  const user = await prisma.user.findUnique({
    where: {
      id: 1,
    },
  });
  const indexPage = true;

  return {
    props: {
      user,
      month: currentMonth,
      nextMonth: nextMonth,
      year: currentYear,
      transactions: transactions,
      transactionsNextMonth: transactionsNextMonth,
      indexPage: indexPage,
    },
  };
}


