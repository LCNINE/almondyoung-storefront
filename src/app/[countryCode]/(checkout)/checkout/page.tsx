import { listCartShippingMethods, retrieveCart } from "@/lib/api/medusa/cart"
import { listCartPaymentMethods } from "@/lib/api/medusa/payment"
import ProtectedRoute from "@components/protected-route"
import { fetchMe } from "@lib/api/users/me"
import { StoreCart } from "@medusajs/types"
import CheckoutTemplate from "domains/checkout/templates/checkout-template"
import { notFound } from "next/navigation"

export default async function CheckoutPage() {
  const currentUser = await fetchMe()
  const cart: StoreCart | null = await retrieveCart()
  console.log("cart::", cart)
  if (!cart) {
    return notFound()
  }

  const shippingMethods = await listCartShippingMethods(cart.id)
  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? "")

  return (
    <ProtectedRoute>
      <CheckoutTemplate
        user={currentUser}
        cart={cart}
        shippingFee={shippingMethods?.[0]?.amount ?? 0}
      />
    </ProtectedRoute>
  )
}
