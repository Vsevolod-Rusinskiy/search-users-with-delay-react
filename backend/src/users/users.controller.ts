import { Body, Controller, Post } from '@nestjs/common'
import { UsersService } from './users.service'
import { User } from './entities/user.entity'
import { SearchUsersDto } from './dto/search-users.dto'

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('search')
    async searchUsers(@Body() filters: SearchUsersDto): Promise<User[]> {
        return this.usersService.findUsers(filters)
    }
}
