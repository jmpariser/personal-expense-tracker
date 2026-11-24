export type TransactionType = 'expense' | 'refund'

export type Expense = {
  id: string
  title: string
  amount: number
  type: TransactionType
  date: Date
  category: ExpenseCategory
}

export type ExpenseCategory =
  | 'Food'
  | 'Transportation'
  | 'Entertainment'
  | 'Bills'
  | 'Shopping'
  | 'Healthcare'
  | 'Other'