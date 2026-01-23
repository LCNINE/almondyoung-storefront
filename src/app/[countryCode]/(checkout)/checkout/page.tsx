import { listCartShippingMethods, retrieveCart } from "@/lib/api/medusa/cart"
import { listCartPaymentMethods } from "@/lib/api/medusa/payment"
import { CartResponseDto } from "@/lib/types/dto/medusa"
import ProtectedRoute from "@components/protected-route"
import { fetchMe } from "@lib/api/users/me"
import CheckoutTemplate from "domains/checkout/templates/checkout-template"
import { notFound } from "next/navigation"

export default async function CheckoutPage() {
  const currentUser = await fetchMe()
  const cart = (await retrieveCart()) as CartResponseDto["cart"]

  // todo:OrderProductsSection 컴포넌트에 cart.items를 전달하고잇는데 cart의 prices들을 전달해줘도될것같음
  if (!cart) {
    return notFound()
  }

  const shippingMethods = await listCartShippingMethods(cart.id)
  const paymentMethods = await listCartPaymentMethods(cart.region?.id ?? "")

  console.log("cart:", cart)
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
