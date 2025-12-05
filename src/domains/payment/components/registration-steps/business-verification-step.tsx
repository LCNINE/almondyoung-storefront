// 사업자 인증 스템 컴포넌트
export default function BusinessVerificationStep({
  onComplete,
}: {
  onComplete: (data: {
    verified: boolean
    businessNumber: string
    companyName: string
  }) => void
}) {
  return (
    <div>
      <h1>Business Verification Step</h1>
    </div>
  )
}
