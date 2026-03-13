"use client"

import FilterRadioGroup from "./filter-radio-group"

// TODO: 인기순도 추가 필요
export type SortOptions = "created_at" | "price_asc" | "price_desc"

type SortProductsProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: SortOptions) => void
  "data-testid"?: string
}

const sortOptions = [
  {
    value: "created_at",
    label: "최신순",
  },
  {
    value: "price_asc",
    label: "낮은가격순",
  },
  {
    value: "price_desc",
    label: "높은가격순",
  },
]

const SortProducts = ({ sortBy, setQueryParams }: SortProductsProps) => {
  const handleChange = (value: string) => {
    setQueryParams("sortBy", value as SortOptions)
  }

  return (
    <FilterRadioGroup
      items={sortOptions}
      value={sortBy}
      handleChange={handleChange}
    />
  )
}

export default SortProducts
