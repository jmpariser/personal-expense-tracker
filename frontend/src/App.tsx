import './App.css'
import ExpenseSummary from './components/ExpenseSummary'
import {useState, useRef, useEffect} from 'react'
import type {FormEvent} from 'react'
import type { Expense, TransactionType, ExpenseCategory } from './types/expense'
import SummaryCard from './components/SummaryCard'


function App() {

  const [expenses, setExpenses] = useState<Expense[]>([])
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [transactionType, setTransactionType] = useState<TransactionType>('expense')
  const [category, setCategory] = useState<ExpenseCategory>('Other')
  const [editingId, setEditingId] = useState<number | null>(null)
  const titleInputRef = useRef<HTMLInputElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses')
    if (savedExpenses) {
      const parsedExpenses = JSON.parse(savedExpenses)
  
      const restoredExpenses = parsedExpenses.map((expense: Expense) => ({
        ...expense,
        date: new Date(expense.date)
      }))

      setExpenses(restoredExpenses)
    }
    setIsLoaded(true)
  }, [])
  

  useEffect(() => {
    if (!isLoaded) return

    localStorage.setItem('expenses', JSON.stringify(expenses))
  }, [expenses, isLoaded])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!title.trim()){
      return
    }

    const numericAmount = Number(amount)

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return
    }

    if (editingId !== null) {
      setExpenses((previousExpenses) =>
        previousExpenses.map((expense) =>
        
          expense.id === editingId
                  ? {   ...expense,
                    title: title.trim(),
                    amount: numericAmount,
                    type: transactionType,
                    category: category
                  }
                  : expense
              )
            )
    } else {
      const newExpense = {
        id: Date.now(), 
        title: title.trim(), 
        amount: numericAmount,
        type: transactionType,
        date: new Date(),
        category: category
      }
      setExpenses((previousExpenses) => [
        ...previousExpenses, 
        newExpense
      ])
    }

    setTitle('')
    setAmount('')
    setTransactionType('expense')
    setEditingId(null)
    setCategory(category)
    titleInputRef.current?.focus()
  }

  function handleDelete(id: number){
    setExpenses((previousExpenses)=> {
      return previousExpenses.filter((expense) => {
        return expense.id !== id
      })
    })
  }

  function handleEdit(expense: Expense){
    setEditingId(expense.id)
    setTitle(expense.title)
    setAmount(String(expense.amount))
    setTransactionType(expense.type)
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

      <button type="submit"> {editingId !== null ? 'Save Changes' :`Add ${transactionType === 'expense' ? 'Expense' : 'Refund'}`}</button>
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

    {[...expenses]
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
    ))}

    </>
  )
}

export default App
