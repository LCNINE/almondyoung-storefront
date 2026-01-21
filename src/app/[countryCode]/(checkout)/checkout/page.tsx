import { retrieveCart } from "@/lib/api/medusa/cart"
import ProtectedRoute from "@components/protected-route"
import { fetchMe } from "@lib/api/users/me"
import { StoreCart } from "@medusajs/types"
import CheckoutTemplate from "domains/checkout/templates/checkout-template"
import { notFound } from "next/navigation"

export default async function CheckoutPage() {
  const currentUser = await fetchMe()
  const cart: StoreCart | null = await retrieveCart()

  if (!cart) {
    return notFound()
  }

  return (
    <ProtectedRoute>
      <CheckoutTemplate user={currentUser} cart={cart} />
    </ProtectedRoute>
  )
}
