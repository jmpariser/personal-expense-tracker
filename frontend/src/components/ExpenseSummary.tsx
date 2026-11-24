import type {TransactionType, ExpenseCategory} from '../types/expense'

type ExpenseSummaryProps = {
    title: string
    amount: number
    type?: TransactionType
    date?: Date
    category?: ExpenseCategory
    onDelete?: () => void
    onEdit?: () => void
    
}


function ExpenseSummary({ 
    title, 
    amount,
    type,
    date,
    category,
    onDelete,
    onEdit
}: ExpenseSummaryProps) {

  return (
    <div className="transaction-card">

        <div className="transaction-header">
            <h2>{title}</h2>
            <p className={type === 'expense' ? 'expense' : 'refund'}>
                {Intl.NumberFormat('en-US', { 
                    style: 'currency', 
                    currency: 'USD' 
                }).format(amount)} 
            </p>
        </div>

        <div className="transaction-footer">
            {type && <p>Type: {type}</p>}
            {category && <p>category: {category}</p>}
            {date && <p>{date.toLocaleString('en-US', { 
                dateStyle: 'medium', 
                timeStyle: 'medium' 
                })
            }</p>}
            {onDelete && <button onClick={onDelete}>Delete</button>}
            {onEdit && <button onClick={onEdit}>Edit</button>}
        </div>
    
    </div>
  )
}

export default ExpenseSummary
