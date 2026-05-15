import { tokens } from '../config/tokens'

type RiskLevelIndicatorProps = {
  dailyInterest: number
}

export function RiskLevelIndicator({ dailyInterest }: RiskLevelIndicatorProps) {
  if (dailyInterest <= 0) return null

  const isHigh = dailyInterest > 0.4
  const isMedium = dailyInterest >= 0.1 && dailyInterest <= 0.4
  const styles = {
    bg: isHigh ? '#FEF2F2' : isMedium ? '#FFFBEB' : '#F0FDF4',
    border: isHigh ? '#FECACA' : isMedium ? '#FDE68A' : '#BBF7D0',
    text: isHigh ? '#B91C1C' : isMedium ? '#B45309' : '#15803D',
    heading: isHigh ? '#991B1B' : isMedium ? '#92400E' : '#166534',
  }

  return (
    <div
      className="flex items-start gap-3 p-4 border"
      style={{
        borderRadius: tokens.radius.md,
        backgroundColor: styles.bg,
        borderColor: styles.border,
      }}
    >
      <div className="mt-0.5" style={{ color: styles.text }}>
        {isHigh ? (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286L21.75 18m-5.786-2.143L21.75 18l-2.143-5.786" />
          </svg>
        ) : isMedium ? (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        ) : (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </div>
      <div>
        <h4 className="text-sm font-bold uppercase" style={{ color: styles.heading }}>
          {isHigh ? 'BERISIKO TINGGI!' : isMedium ? 'BERISIKO SEDANG' : 'RISIKO RENDAH'}
        </h4>
        <p className="text-sm" style={{ color: styles.text }}>
          {isHigh
            ? 'Bunga sangat tinggi! Pertimbangkan alternatif lain.'
            : isMedium
            ? 'Bunga masih dalam batas wajar, namun perhatikan biaya admin.'
            : 'Bunga rendah dan bersaing. Pilihan yang relatif lebih aman.'}
        </p>
      </div>
    </div>
  )
}
