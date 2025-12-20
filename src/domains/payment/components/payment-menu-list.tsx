// "use client"

// import Link from "next/link"
// import { MdChevronRight } from "react-icons/md"
// import { useSecuritySheetStore } from "./store/security-sheet-store"

// const menuItems = [
//   {
//     label: "결제 비밀번호 / 보안 설정",
//     type: "sheet",
//     action: "security",
//   },
//   {
//     label: "현금영수증 설정",
//     type: "link",
//     href: "/mypage/payment/receipt",
//   },
//   {
//     label: "나중결제 약관 및 정책",
//     type: "link",
//     href: "/mypage/payment/terms",
//   },
// ]

// export default function PaymentMenuList() {
//   const { openSheet } = useSecuritySheetStore()

//   return (
//     <>
//       <div className="mt-8">
//         {menuItems.map((item, idx) => {
//           const isLast = idx === menuItems.length - 1

//           // 링크 타입
//           if (item.type === "link") {
//             return (
//               <Link
//                 key={item.href}
//                 href={item.href!}
//                 className={`border-gray-20 hover:bg-gray-10 flex items-center justify-between border-t px-7 py-4 ${isLast ? "border-b" : ""}`}
//               >
//                 <span className="text-sm">{item.label}</span>
//                 <MdChevronRight className="size-4 text-gray-400" />
//               </Link>
//             )
//           }

//           return (
//             <button
//               key={item.action}
//               aria-label={item.label}
//               className={`border-gray-20 hover:bg-gray-10 flex w-full cursor-pointer items-center justify-between border-t px-7 py-4 text-left ${isLast ? "border-b" : ""}`}
//               onClick={openSheet}
//             >
//               <span className="text-sm">{item.label}</span>
//               <MdChevronRight className="size-4 text-gray-400" />
//             </button>
//           )
//         })}
//       </div>
//     </>
//   )
// }

import { ChevronRight } from "lucide-react"
import Link from "next/link"

const menuItems = [
  // { label: "계좌 사용 내역", href: "/mypage/payment/history" },
  { label: "결제 비밀번호 / 보안 설정", href: "/mypage/payment/security" },
  { label: "현금영수증 설정", href: "/mypage/payment/receipt" },
  { label: "나중결제 약관 및 정책", href: "/mypage/payment/terms" },
]

export default function PaymentMenuList() {
  return (
    <div className="mt-8">
      {menuItems.map((item, idx) => (
        <Link
          key={item.href}
          href={item.href}
          className={`border-gray-20 hover:bg-gray-10 flex items-center justify-between border-t px-7 py-4 ${idx === menuItems.length - 1 ? "border-b" : ""} `}
        >
          <span className="text-sm">{item.label}</span>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </Link>
      ))}
    </div>
  )
}
