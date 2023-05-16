// import Head from "next/head";
// import Image from "next/image";
import { Inter } from "next/font/google";
import prisma from "@/prisma/prismaclient";
import useHook from '../hooks/useHook';

import Layout from "@/components/layout/Layout";
import { getTransactions } from "../helpers/selectors";
import Transactions from '../pages/transactions/index';
// import TransactionList from "@/components/ui/TransactionsList";
// import RunningTotalChart from "@/components/ui/RunningTotalChart";

const inter = Inter({ subsets: ["latin"] });

export default function Home({ user, month, year, indexPage, transactionsRecent, transactionsUpcoming}) {
  const {route} = useHook();

  return (
    <>
      <Layout user={user}></Layout>
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
  const transactionList = await getTransactions(1, currentMonth, currentYear);
  const transactionsRecent = transactionList.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0,3);
  const transactionsUpcoming = transactionList.slice(3,6);
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
      year: currentYear,
      transactionsRecent: transactionsRecent,
      transactionsUpcoming: transactionsUpcoming,
      indexPage: indexPage,
    },
  };
}


