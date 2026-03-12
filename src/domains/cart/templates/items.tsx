import { HttpTypes } from "@medusajs/types"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import Item from "../components/item"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

export default function ItemsTemplate({ cart }: ItemsTemplateProps) {
  // TODO: 테스트용 더미 데이터 - 나중에 제거
  const dummyItems: HttpTypes.StoreCartLineItem[] = Array.from(
    { length: 10 },
    (_, i) => ({
      id: `dummy-${i}`,
      title: `테스트 상품 ${i + 1}`,
      subtitle: "기본 품목",
      thumbnail: null,
      quantity: Math.floor(Math.random() * 3) + 1,
      variant_id: `variant-${i}`,
      product_id: `product-${i}`,
      product_title: `노몬드 속눈썹펌 롯드 0${i + 1} / C컬`,
      product_handle: `test-product-${i}`,
      unit_price: 3990 + i * 1000,
      compare_at_unit_price: 4990 + i * 1000,
      created_at: new Date().toISOString(),
      variant: {
        id: `variant-${i}`,
        title: "기본 품목",
        manage_inventory: false,
        inventory_quantity: 99,
      },
    })
  ) as HttpTypes.StoreCartLineItem[]

  const items = [...(cart?.items ?? []), ...dummyItems]

  return (
    <>
      <Table>
        <TableHeader className="border-t-0">
          <TableRow>
            <TableHead className="pl-0">상품</TableHead>
            <TableHead></TableHead>
            <TableHead>수량</TableHead>
            <TableHead className="hidden sm:table-cell">단가</TableHead>
            <TableHead className="pr-0 text-right">합계</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {items
            ?.sort((a, b) => {
              return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
            })
            .map((item) => (
              <Item
                key={item.id}
                item={item}
                currencyCode={cart?.currency_code ?? "KRW"}
              />
            ))}
        </TableBody>
      </Table>
    </>
  )
}
