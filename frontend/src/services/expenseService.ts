import type { Expense } from '../types/expense'

const API_URL = `${import.meta.env.VITE_API_URL}/expenses`

export async function getExpenses(): Promise<Expense[]> {
    const response = await fetch(API_URL)
  
    if (!response.ok) {
      throw new Error('Failed to fetch expenses')
    }
  
    const data = await response.json()
  
    return data.map((expense: Expense) => ({
      ...expense,
      date: new Date(expense.date)
    }))
  }

export async function createExpense(
    expense: Omit<Expense, 'id'>
  ): Promise<Expense> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(expense)
    })
  
    if (!response.ok) {
      throw new Error('Failed to create expense')
    }
  
    const data = await response.json()
  
    return {
      ...data,
      date: new Date(data.date)
    }
  }

export async function updateExpense(
    id: string,
    expense: Omit<Expense, 'id'>
  ): Promise<Expense> {
  const response = await fetch(
    `${API_URL}/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(expense)
    }
  )

  if (!response.ok) {
    throw new Error('Failed to update expense')
  }
  const updatedExpense = await response.json()

  return {
    ...updatedExpense,
    date: new Date(updatedExpense.date)
  }
  }

export async function deleteExpense(id: string): Promise<void> {
    const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE"
        }
      )

    if (!response.ok) {
        throw new Error('Failed to delete expense')
    }
}