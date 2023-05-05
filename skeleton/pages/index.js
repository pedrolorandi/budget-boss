import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { PrismaClient } from '@prisma/client'

const inter = Inter({ subsets: ['latin'] })

export default function Home({blogs}) {
  return (
    <>
    <h1>hiiii</h1>
      {/* <Head>
        <title>NextJs Primsa Skeleton</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
      <h1 className={styles.title}>Welcome, to your LHL Skeleton!</h1>
      <p className={styles.subtitle}>Please read the the skeleton set up for this should be in the read me one directory above your current.</p>
        <div className={styles.description}> 
          <Image
            src="https://http.cat/100"
            alt="Vercel Logo"
            className={styles.vercelLogo}
            width={300}
            height={250}
            priority
          />
        </div>
        <div className={styles.dbContainer}>
          <h3>Values pulled from your DB, these values can be updated or change by typing &rdquo;npx prisma studio&rdquo; in your terminal</h3>
          {blogs && blogs.map(blog => (
            <div key={blog.id}>
              <h4>{blog.title}</h4>
              <p>{blog.content}</p>
            </div>
          ))}
        </div> 
      </main> */}
    </>
  )
}

// export async function getStaticProps() {
//   const prisma = new PrismaClient()
//   const blogs = await prisma.blog.findMany()

//   return {
//     props : { blogs }
//   }
// }