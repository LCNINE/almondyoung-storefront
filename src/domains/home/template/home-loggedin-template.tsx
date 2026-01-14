import type { UserDetail } from "@/lib/types/ui/user"

interface HomeLoggedInTemplateProps {
  user: UserDetail
}

/*───────────────────────────────────────────────
 * 로그인한 사용자용
 *───────────────────────────────────────────────*/
export function HomeLoggedInTemplate({ user }: HomeLoggedInTemplateProps) {
  return <div>HomeLoggedInTemplate</div>
}
