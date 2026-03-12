import { CartHeader } from "@/app/[countryCode]/cart/(components)/cart-header"
import { Card, CardContent } from "@/components/ui/card"
import { HttpTypes } from "@medusajs/types"
import ItemsTemplate from "./items"
import Summary from "./summary"

type Props = {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}

export default function CartTemplate({ cart, customer }: Props) {
  return (
    <main className="bg-background container mx-auto max-w-[1360px] px-4 lg:px-[40px] lg:py-8">
      <CartHeader />

      <div className="grid grid-cols-1 gap-x-10 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardContent className="pt-6">
            {/* todo: 이거는 추후에 다시 고려해보겠습니다. 반응이 좀 느려요 */}
            {/* <ShippingNotice
            shippingTotal={cart?.shipping_total || 0}
            selectedTotal={cart?.subtotal || 0}
            variant="desktop"
          /> */}

            <ItemsTemplate cart={cart as HttpTypes.StoreCart} />
          </CardContent>
        </Card>

        <div className="lg:sticky lg:top-5">
          <Card>
            <CardContent>
              {cart && cart.region && (
                <div className="py-6">
                  <Summary
                    cart={
                      cart as HttpTypes.StoreCart & {
                        promotions: HttpTypes.StorePromotion[]
                      }
                    }
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
