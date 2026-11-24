import './App.css'
import ExpenseSummary from './components/ExpenseSummary'
import {useState, useRef, useEffect} from 'react'
import type {FormEvent} from 'react'
import type { Expense, TransactionType, ExpenseCategory } from './types/expense'
import SummaryCard from './components/SummaryCard'
import { createExpense, getExpenses, updateExpense, deleteExpense } from './services/expenseService'


function App() {

  const [expenses, setExpenses] = useState<Expense[]>([])
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [transactionType, setTransactionType] = useState<TransactionType>('expense')
  const [category, setCategory] = useState<ExpenseCategory>('Other')
  const [editingId, setEditingId] = useState<string | null>(null)
  const titleInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notification, setNotification] = useState<{
    message: string
    type: 'success' | 'error'
  } | null>(null)
  const [isSaving, setIsSaving] = useState(false)


  async function loadExpenses() {
    try {
      const data = await getExpenses()
      setExpenses(data)
    } catch (error) {
      console.error("Failed to load expenses:", error)
      setError("Unable to load expenses. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Load expenses once when the app starts
  useEffect(() => {
    loadExpenses()
  }, [])

  useEffect(() => {
    if (!notification) {
      return
    }

    const timer = setTimeout(() => {
      setNotification(null)
    }, 3000)

    return () => clearTimeout(timer)
  }, [notification])

// ---------------------------------------------------------------------------------
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    

    if (!title.trim()){
      setNotification({
        message: 'Please enter an expense name.',
        type: 'error'
      })
      return
    }

    const numericAmount = Number(amount)
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setNotification({
        message: 'Amount must be greater than zero.',
        type: 'error'
      })
      return
    }

    const expenseData = {
      title: title.trim(),
      amount: Number(amount),
      type: transactionType,
      category,
      date: new Date()
    }

    setIsSaving(true)
    try{
      if (editingId !== null) {


        const restoredExpense = await updateExpense(editingId, expenseData)

        setExpenses(previousExpenses =>
          previousExpenses.map(expense =>
            expense.id === editingId ? restoredExpense : expense
          )
        )
        setNotification({
          message: 'Expense updated successfully!',
          type: 'success'
        })
      } else{
        const newExpense = await createExpense(expenseData)

        setExpenses(previousExpenses => [
          ...previousExpenses,
          newExpense
        ])
        setNotification({
          message: 'Expense created successfully!',
          type: 'success'
        })
      }

      setTitle('')
      setAmount('')
      setTransactionType('expense')
      setEditingId(null)
      setCategory('Other')
      titleInputRef.current?.focus()
    } catch (error) {
      setNotification({
        message: 'Unable to connect to the server. Please try again.',
        type: 'error'
      })
    } finally {
      setIsSaving(false)
    }
  }


  // ---------------------------------------------------------------------------------
  async function handleDelete(id: string){
    try {
      await deleteExpense(id)

      setExpenses(previousExpenses =>
        previousExpenses.filter(expense => expense.id !== id)
      )
  
      setNotification({
        message: 'Expense deleted successfully!',
        type: 'success'
      })
    } catch (error) {
      setNotification({
        message: 'Unable to connect to the server. Please try again.',
        type: 'error'
      })
    }
  }

  async function handleEdit(expense: Expense){
    setEditingId(expense.id)
    setTitle(expense.title)
    setAmount(String(expense.amount))
    setTransactionType(expense.type)
    setCategory(expense.category)
  }


  const netSpending = expenses.reduce((total, expense) => {
    return expense.type === 'expense'
      ? total + expense.amount
      : total - expense.amount
  }, 0)

  const totalExpenses = expenses.reduce((total, expense) => {
    return expense.type === 'expense'
      ? total + expense.amount
      : total
  }, 0)

  const totalRefunds = expenses.reduce((total, expense) => {
    return expense.type === 'refund'
      ? total + expense.amount
      : total
  }, 0)

  return (
    <>
    {notification && (
      <div className={`notification ${notification.type}`}>
        {notification.message}
      </div>
    )}
    <h1>Personal Expense Tracker</h1>

    <form className="transaction-form" onSubmit={handleSubmit}>
      <input
        ref={titleInputRef}
        type="text"
        placeholder="Expense name"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
      />

      <select
        value={transactionType}
        onChange={(event) =>
          setTransactionType(event.target.value as TransactionType)
        }
      >
        <option value="expense">Expense</option>
        <option value="refund">Refund</option>
      </select>

      <select
        value={category}
        onChange={(event) =>
          setCategory(event.target.value as ExpenseCategory)
        }
      >
        <option value="Other">Other</option>
        <option value="Food">Food</option>
        <option value="Transportation">Transportation</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Bills">Bills</option>
        <option value="Shopping">Shopping</option>
        <option value="Healthcare">Healthcare</option>
        <option value="Other">Other</option>
      </select>

      <button type="submit" disabled={isSaving}> 
        {isSaving ? 'Saving...' : editingId !== null ? 'Save Changes' :`Add ${transactionType === 'expense' ? 'Expense' : 'Refund'}`}
      </button>
    </form>


    <div className="summary-grid">
      <SummaryCard
        title="Net Spending"
        amount={netSpending}
        variant='net'
      />
      <SummaryCard
        title="Total Expenses"
        amount={totalExpenses}
        variant="expense"
      />
      <SummaryCard
        title="Total Refunds"
        amount={totalRefunds}
        variant="refund"
      />
    </div>

    {isLoading ? (
      <p>Loading expenses...</p>
    ) : error ? (
      <p>{error}</p>
    ) : (
      [...expenses]
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .map((expense) => (
          <ExpenseSummary
            key={expense.id} 
            title={expense.title} 
            amount={expense.amount} 
            type={expense.type}
            date={expense.date}
            category={expense.category}
            onDelete={() => handleDelete(expense.id)}
            onEdit={() => handleEdit(expense)}
          />
        ))
    )}
    </>
  )
}

export default App
