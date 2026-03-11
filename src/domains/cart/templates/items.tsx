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
  const items = cart?.items

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
