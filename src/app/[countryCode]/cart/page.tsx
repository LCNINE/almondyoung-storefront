import {
  addCartShippingMethodDuringRender,
  listCartShippingMethods,
  retrieveCart,
} from "@/lib/api/medusa/cart"
import { EmptyCartView } from "@/components/cart/empty-cart-view"
import { notFound } from "next/navigation"
import { retrieveCustomer } from "@/lib/api/medusa/customer"
import CartTemplate from "@/domains/cart/templates"

// todo: 쇼핑배송비 설정부분 파악
export default async function Cart() {
  let cart = await retrieveCart().catch((error) => {
    console.error(error)
    return notFound()
  })

  if (!cart) {
    return <EmptyCartView showHeader={false} bgColor="bg-muted" />
  }

  // shipping method가 없으면 기본 배송 옵션 추가
  if (!cart.shipping_methods?.length) {
    const options = await listCartShippingMethods(cart.id)
    if (options?.[0]) {
      const updatedCart = await addCartShippingMethodDuringRender(
        cart.id,
        options[0].id
      )
      console.log("updatedCart", updatedCart)

      if (updatedCart) {
        cart = updatedCart
      }
    }
  }

  const customer = await retrieveCustomer()

  return <CartTemplate cart={cart} customer={customer} />
}
