"use client"

import LocalizedClientLink from "@/components/shared/localized-client-link"
import Image from "next/image"

export default function CheckoutHeader({ title }: { title: string }) {
  return (
    <header className="flex w-full items-center justify-center self-stretch bg-white px-10 py-5 shadow-sm">
      <div className="relative flex w-full max-w-6xl items-center justify-center">
        <LocalizedClientLink
          href="/"
          className="absolute top-1/2 left-0 -translate-y-1/2"
        >
          <Image
            src="/images/almond-logo-black.png"
            width={218}
            height={29}
            className="h-[29px] w-[218px] object-contain"
            alt="아몬드 로고"
          />
        </LocalizedClientLink>
        <p className="text-2xl font-bold text-black">{title}</p>
      </div>
    </header>
  )
}
