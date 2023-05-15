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

export default function Home({ user, month, year, transactions, nextMonth, indexPage}) {
  return (
    <>
      <Layout user={user}></Layout>
      <div class="flex">
        <div class="w-1/3 p-4">
          <Transactions month={month} year={year} transactions={transactions} indexPage={indexPage}/>
        </div>
        <div class="w-1/5 p-4">
          <Transactions month={nextMonth} year={year} transactions={transactions} indexPage={indexPage}/>
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
      indexPage: indexPage,
    },
  };
}


