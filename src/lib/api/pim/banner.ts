import { BannerGroupDto } from "@/lib/types/dto/pim"
import { api } from "../api"

export async function getBannerGroupByCode(code: string) {
  return await api<BannerGroupDto>("pim", `/banner-groups/by-code`, {
    method: "GET",
    withAuth: false,
    params: {
      code,
    },
  })
}
