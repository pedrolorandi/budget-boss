import { Inter } from "next/font/google";
import { PrismaClient } from "@prisma/client";
import useHook from '../hooks/useHook';

import { 
  getTransactionsGroupedByDate, getSixTransactions, getRunnigTotalByAccount,
  getTransactionsGroupedByCategory, getBudgets, getCategoriesData
} from '../helpers/selectors';
import { getBudgetAmounts, getBudgetSum } from "../helpers/budgetHelper";
import Transactions from '../pages/transactions/index';
import Reports from '../pages/reports';
import Budgets from '../pages/budgets/index';

const inter = Inter({ subsets: ["latin"] });

export default function Home({ month, year, accounts, transactions, runningTotalbyAccount, budgetSum, budgets, budgetAmounts, firstSixBudgets, nextFiveBudgets, lastFiveBudgets, categories, categoriesPercentages, percentagePerCategory, indexPage, accountIndex, transactionsRecent, transactionsUpcoming}) {
  const {route} = useHook();
  
  return (
    <div className="bg-[#FFF] flex flex-col flex-1 rounded-lg p-5">
      <div className="flex flex-row items-center">
        <img src="images/user-icon.png" className="flex h-20" />
        <h1 className="text-4xl ms-5">Hi, Jane!</h1>
      </div>

      <section className="flex" style={{marginTop: '30px', marginLeft: '30px'}}>
        <div className="w-1/2 p-32" style={{padding: '10px'}} onClick={() => route.push('/reports')}> 
          <Reports 
              month={month} year={year} indexPage={indexPage} 
              budgetAmounts={budgetAmounts} categories={categories} 
              categoriesPercentages={categoriesPercentages} percentagePerCategory={percentagePerCategory}
            />
        </div>
        <div className="w-1/2 p-32" style={{padding: '20px', paddingTop: '40px', marginLeft: '60px'}} onClick={() => route.push('/transactions')}>
          <Transactions 
            accounts={accounts} runningTotalbyAccount={runningTotalbyAccount}
            accountIndex={accountIndex} transactions={transactions}
          />
        </div>
      </section>
    
      <div className="flex" style={{marginTop: '50px', marginLeft: '30px'}} onClick={() => route.push('/transactions')}>
        <div className="w-1/2 p-32" style={{padding: '10px'}}>
          <Transactions 
            transactions={transactionsRecent} 
            indexPage={indexPage} 
            text="Recent Transactions"
          />
        </div>
        <div className="w-1/2 p-32" style={{padding: '10px', marginLeft: '70px'}}>
          <Transactions 
            transactions={transactionsUpcoming} 
            indexPage={indexPage} text="Upcoming Transactions"
          />
        </div>
      </div>

      <div className="flex" style={{marginTop: '40px', marginLeft: '30px'}} onClick={() => route.push('/budgets')}>
        <div className="w-1/2 p-32" style={{padding: '10px'}}>
          <Budgets 
            month={month} year={year} 
            indexPage={indexPage} budgetSum={budgetSum}
            budgets={budgets} budgetAmounts={firstSixBudgets}
          />
        </div>
        <div className="w-1/2 p-32" style={{padding: '10px', marginLeft: '70px'}} >
          <Budgets 
            month={month} year={year} 
            indexPage={indexPage} budgetSum={budgetSum}
            budgets={budgets} budgetAmounts={nextFiveBudgets}
          />
        </div>
        <div className="w-1/2 p-32" style={{padding: '10px', marginLeft: '70px'}} >
          <Budgets 
            month={month} year={year} 
            indexPage={indexPage} budgetSum={budgetSum}
            budgets={budgets} budgetAmounts={lastFiveBudgets}
          />
        </div>
      </div>

    </div>
  );
}

export async function getServerSideProps() {
  const prisma = new PrismaClient();
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const {
    month,
    year,
    categories,
    categoriesPercentages,
    percentagePerCategory,
  } = await getCategoriesData(1, currentMonth, currentYear);


  const today = new Date().toLocaleDateString().slice(0,10);
  const transactionList = await getTransactionsGroupedByDate(1, currentMonth, currentYear, undefined);

  const SixTransactions = getSixTransactions(today, transactionList);
  const transactionsRecent = SixTransactions.slice(0,3);
  const transactionsUpcoming = SixTransactions.splice(3,3);
  
  const indexPage = true;
  const accountIndex = true;

  const accounts = await prisma.account.findMany({
    where: { userId: 1 },
  });

  const runningTotalbyAccount = await getRunnigTotalByAccount(1);
  const transactions = await getTransactionsGroupedByDate(
    1,
    currentMonth,
    currentYear,
    undefined
  );

  const budgets = await getBudgets(1, currentMonth, currentYear);
  const budgetAmounts = await getBudgetAmounts(
    await getTransactionsGroupedByCategory(1, currentMonth, currentYear),
    await getBudgets(1, currentMonth, currentYear)
  );
  const copiedBudgetAmounts = JSON.parse(JSON.stringify(budgetAmounts));
  const firstSixBudgets = copiedBudgetAmounts.slice(0, 6);
  const nextFiveBudgets = copiedBudgetAmounts.splice(6, 5);
  const lastFiveBudgets = copiedBudgetAmounts.splice(6, 5);

  const transactionsByCategory = await getTransactionsGroupedByCategory(
    1,
    currentMonth,
    currentYear
  );
  const budgetSum = await getBudgetSum(transactionsByCategory, budgets);
  
  return {
    props: {      
      month,
      year,
      categories,
      categoriesPercentages,
      percentagePerCategory,
      runningTotalbyAccount,
      transactions,
      transactionsRecent: transactionsRecent,
      transactionsUpcoming: transactionsUpcoming,
      indexPage: indexPage,
      accountIndex,
      budgets,
      budgetAmounts,
      firstSixBudgets,
      nextFiveBudgets,
      lastFiveBudgets,
      budgetSum,
      accounts,
    },
  };
}

