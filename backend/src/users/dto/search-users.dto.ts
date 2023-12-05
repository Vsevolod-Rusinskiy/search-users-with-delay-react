import { IsEmail, IsOptional, IsString } from 'class-validator'

export class SearchUsersDto {
    @IsEmail({}, { message: 'Неверный формат email' })
    email: string

    @IsString()
    @IsOptional()
    number?: string
}
