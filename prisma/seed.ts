import { PrismaClient } from '@prisma/client'
import { subDays, eachDayOfInterval } from 'date-fns'
import { createId } from '@paralleldrive/cuid2'

const prisma = new PrismaClient()

const SEED_USER_ID = "r5zzt4xb3j4lgesi"

const SEED_CATEGORIES = [
  { id: createId(), name: "Food", userId: SEED_USER_ID, plaidId: null },
  { id: createId(), name: "Rent", userId: SEED_USER_ID, plaidId: null },
  { id: createId(), name: "Utilities", userId: SEED_USER_ID, plaidId: null },
  { id: createId(), name: "Clothing", userId: SEED_USER_ID, plaidId: null },
  { id: createId(), name: "Transportation", userId: SEED_USER_ID, plaidId: null },
  { id: createId(), name: "Entertainment", userId: SEED_USER_ID, plaidId: null },
  { id: createId(), name: "Health", userId: SEED_USER_ID, plaidId: null },
  { id: createId(), name: "Miscellaneous", userId: SEED_USER_ID, plaidId: null },
]

const SEED_ACCOUNTS = [
  { id: createId(), name: "Checking", userId: SEED_USER_ID, plaidId: null },
  { id: createId(), name: "Savings", userId: SEED_USER_ID, plaidId: null },
  { id: createId(), name: "Credit Card", userId: SEED_USER_ID, plaidId: null },
]

const generateRandomAmount = (categoryName: string): number => {
  switch (categoryName) {
    case "Rent":
      return Math.random() * 400 + 90
    case "Utilities":
      return Math.random() * 200 + 50
    case "Food":
      return Math.random() * 30 + 10
    case "Transportation":
    case "Health":
      return Math.random() * 50 + 15
    case "Entertainment":
    case "Clothing":
    case "Miscellaneous":
      return Math.random() * 100 + 20
    default:
      return Math.random() * 50 + 10
  }
}

interface TransactionData {
  id: string
  accountId: string
  categoryId: string
  date: Date
  amount: number
  payee: string
  notes: string
}

const generateTransactions = (): TransactionData[] => {
  const transactions: TransactionData[] = []
  const defaultTo = new Date()
  const defaultFrom = subDays(defaultTo, 90)
  const days = eachDayOfInterval({ start: defaultFrom, end: defaultTo })
  
  const payees = ["Amazon", "Walmart", "Target", "Starbucks", "Netflix", "Spotify", "Apple", "Google", "Uber", "DoorDash"]
  const notes = ["Monthly subscription", "Grocery shopping", "Online purchase", "Restaurant bill", "Transportation", "Entertainment", "Healthcare", "Shopping"]

  days.forEach(day => {
    const numTransactions = Math.floor(Math.random() * 4) + 1
    
    for (let i = 0; i < numTransactions; i++) {
      const category = SEED_CATEGORIES[Math.floor(Math.random() * SEED_CATEGORIES.length)]
      const account = SEED_ACCOUNTS[Math.floor(Math.random() * SEED_ACCOUNTS.length)]
      const isExpense = Math.random() > 0.6
      const amount = generateRandomAmount(category.name)
      const formattedAmount = Math.round((isExpense ? -amount : amount) * 100)

      const payee = payees[Math.floor(Math.random() * payees.length)]
      const note = notes[Math.floor(Math.random() * notes.length)]

      transactions.push({
        id: createId(),
        accountId: account.id,
        categoryId: category.id,
        date: day,
        amount: formattedAmount,
        payee,
        notes: note,
      })
    }
  })

  return transactions
}

async function main() {
  console.log('🌱 Starting seed...')

  // Clean up existing data
  console.log('🧹 Cleaning up existing data...')
  await prisma.transaction.deleteMany({})
  await prisma.account.deleteMany({})
  await prisma.categoryFinance.deleteMany({})
  await prisma.connectedBank.deleteMany({})
  await prisma.subscriptionFinance.deleteMany({})

  // Seed categories
  console.log('📂 Seeding categories...')
  for (const category of SEED_CATEGORIES) {
    await prisma.categoryFinance.create({
      data: category,
    })
  }

  // Seed accounts
  console.log('💰 Seeding accounts...')
  for (const account of SEED_ACCOUNTS) {
    await prisma.account.create({
      data: account,
    })
  }

  // Generate and seed transactions
  console.log('💳 Generating transactions...')
  const SEED_TRANSACTIONS = generateTransactions()
  
  // Insert transactions in batches for better performance
  const batchSize = 1000
  for (let i = 0; i < SEED_TRANSACTIONS.length; i += batchSize) {
    const batch = SEED_TRANSACTIONS.slice(i, i + batchSize)
    console.log(`📊 Seeding transactions ${i + 1} to ${Math.min(i + batchSize, SEED_TRANSACTIONS.length)}...`)
    
    await prisma.transaction.createMany({
      data: batch,
    })
  }

  // Optional: Seed connected bank
  console.log('🏦 Seeding connected bank...')
  await prisma.connectedBank.create({
    data: {
      id: createId(),
      userId: SEED_USER_ID,
      accessToken: `test_access_token_${Date.now()}`,
    },
  })

  // Optional: Seed subscription
  console.log('🔔 Seeding subscription...')
  await prisma.subscriptionFinance.create({
    data: {
      id: createId(),
      userId: SEED_USER_ID,
      subscriptionId: `sub_test_${Date.now()}`,
      status: 'active',
    },
  })

  console.log('✅ Seed completed successfully!')

  // Print summary
  const categoryCount = await prisma.categoryFinance.count()
  const accountCount = await prisma.account.count()
  const transactionCount = await prisma.transaction.count()
  
  console.log('\n📊 Seed Summary:')
  console.log(`   Categories: ${categoryCount}`)
  console.log(`   Accounts: ${accountCount}`)
  console.log(`   Transactions: ${transactionCount}`)
  console.log(`   User ID: ${SEED_USER_ID}`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error during seed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })