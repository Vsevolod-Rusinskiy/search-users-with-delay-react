import { Injectable, OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'
import { readFile } from 'fs/promises'
import { join } from 'path'

@Injectable()
export class UsersService implements OnModuleInit {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async onModuleInit() {
        try {
            const filePath = join(process.cwd(), 'src', 'users', 'users.json')
            const usersData = JSON.parse(await readFile(filePath, 'utf8'))

            const existingUsers = await this.usersRepository.find()
            if (existingUsers.length === 0) {
                await this.usersRepository.save(usersData)
            }
        } catch (error) {
            console.error('Ошибка при инициализации данных пользователей:', error)
        }
    }

    async findUsers(filters: Partial<User>): Promise<User[]> {
        const searchFilters: Partial<User> = {}

        if (filters.email) {
            searchFilters.email = filters.email
        }

        if (filters.number) {
            searchFilters.number = filters.number.replace(/-/g, '')
        }

        await new Promise((resolve) => setTimeout(resolve, 5000))
        return this.usersRepository.find({ where: searchFilters })
    }
}
