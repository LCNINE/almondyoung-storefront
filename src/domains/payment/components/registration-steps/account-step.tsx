// 계좌 등록 스텝 컴포넌트
export default function AccountStep({
  onComplete,
}: {
  onComplete: (data: {
    verified: boolean
    accountNumber: string
    bank: string
  }) => void
}) {
  return (
    <div>
      <h1>Account Registration Step</h1>
    </div>
  )
}
