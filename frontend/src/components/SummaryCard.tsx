type SummaryCardProps = {
    title: string
    amount: number
    variant: 'expense' | 'refund' |'net'
  }

function SummaryCard({
    title,
    amount,
    variant
}: SummaryCardProps){

    return (
    <div className="summary-card">
        <h3>{title}</h3>
        <p className={`summary-amount ${
            variant === 'net'
                ? (amount > 0 ? 'expense' : 'refund')
                : variant
            }`}>
            {Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)}
        </p>
    </div>
    )
}

export default SummaryCard