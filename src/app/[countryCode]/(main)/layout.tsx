import { getBaseURL } from "@lib/utils/env"
import { Metadata } from "next"
import { MainHeader } from "./_components/header"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function MainLayout(props: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <MainHeader />
      {props.children}
    </div>
  )
}
