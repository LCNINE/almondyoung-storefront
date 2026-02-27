import { VariantPrice } from "@/lib/types/common/price"
import { cn } from "@/lib/utils"
import { MembershipTagIcon } from "@/icons/membership-tag-icon"
import { ProductMembershipBadge } from "../prodcut-card/parts/product-membership-badge"

interface Props {
  price: VariantPrice
  membershipPrice: number
}

export default async function ProductPrice({ price, membershipPrice }: Props) {
  if (!price) {
    return null
  }

  return (
    <>
      <div>원가 {price.original_price}</div>
    </>
  )

  // return (
  //   <>
  //     <div>원가 {price.original_price}</div>
  //     <div
  //       className={cn("text-ui-fg-muted", {
  //         "text-ui-fg-interactive": price.price_type === "sale",
  //       })}
  //       data-testid="price"
  //     >
  //       {price.calculated_price}
  //     </div>
  //   </>
  // )
}
