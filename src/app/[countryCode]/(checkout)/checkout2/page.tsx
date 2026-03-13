import { retrieveCart } from "@/lib/api/medusa/cart"
import { retrieveCustomer } from "@/lib/api/medusa/customer"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "결제",
}

export default async function Checkout2() {
  const cart = await retrieveCart()

  if (!cart) {
    return notFound()
  }

  const customer = await retrieveCustomer()

  return (
    <div className="small:grid-cols-[1fr_416px] content-container grid grid-cols-1 gap-x-40 py-12">
      <PaymentWrapper cart={cart}>
        <CheckoutForm cart={cart} customer={customer} />
      </PaymentWrapper>
      <CheckoutSummary cart={cart} />
    </div>
  )
}
