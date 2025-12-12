import type { UserBaseType } from "../common/users"
import type { AddressDto, ShopInfoDto } from "../dto/users"

export interface UserDetail extends UserBaseType {
  shop: ShopInfoType | null
  profile: Profile | null
}

export interface Profile extends UserBaseType {
  phoneNumber: string | null
  address: Address | null
  birthDate: Date | null
  profileImageUrl: string | null
  createdAt: Date
  updatedAt: Date
}

export type ShopInfoType = ShopInfoDto

export type Address = AddressDto
