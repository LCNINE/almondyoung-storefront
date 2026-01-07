import { ThemeToggle } from "@components/common/thema-toggle"

import {
  DesktopHeader,
  MobileGlobalHeader,
} from "@components/layout/components/header"
import { getBaseURL } from "@lib/utils/env"
import { Metadata } from "next"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function MainLayout(props: { children: React.ReactNode }) {
  const showDesktopHeader = true
  const showMobileHeader = true

  return (
    <div className="flex min-h-screen flex-col">
      {/* 데스크탑 글로벌 헤더 */}
      {showDesktopHeader && (
        <div className="hidden md:block">
          <DesktopHeader />
        </div>
      )}

      {/* 모바일 글로벌 헤더 */}
      {showMobileHeader && (
        <div className="block md:hidden">
          <MobileGlobalHeader />
        </div>
      )}
      {props.children}

      <ThemeToggle />
    </div>
  )
}
