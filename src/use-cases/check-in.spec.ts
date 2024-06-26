import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository()
        gymsRepository = new InMemoryGymsRepository()

        sut = new CheckInUseCase(checkInsRepository, gymsRepository)

        await gymsRepository.create({
            id: 'gym-01',
            title: 'JavaScript Gym',
            description: '',
            phone: '',
            latitude: -19.632231,
            longitude: -43.895969,
        })

        vi.useFakeTimers()
    })

    afterEach
        (() => {
            vi.useRealTimers()
        })

    it('should be able to check in', async () => {

        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -19.632231,
            userLongitude: -43.895969
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })


    it('should not be able to check in twice in the same day', async () => {
        vi.setSystemTime(new Date(2022, 1, 1, 13, 0, 0))

        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -19.632231,
            userLongitude: -43.895969
        })

        await expect(() =>
            sut.execute({
                gymId: 'gym-01',
                userId: 'user-01',
                userLatitude: -19.632231,
                userLongitude: -43.895969
            })
        ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
    })

    it('should be able to check in twice but in different days', async () => {
        vi.setSystemTime(new Date(2022, 1, 1, 13, 0, 0))

        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -19.632231,
            userLongitude: -43.895969
        })

        vi.setSystemTime(new Date(2022, 1, 2, 13, 0, 0))

        const { checkIn } = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -19.632231,
            userLongitude: -43.895969
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('should not be able to check in on distant gym', async () => {
        gymsRepository.items.push({
            id: 'gym-02',
            title: 'JavaScript Gym',
            description: '',
            phone: '',
            latitude: new Decimal(-19.6458515),
            longitude: new Decimal(-43.9014169),

        })

        await expect(() =>
            sut.execute({
                gymId: 'gym-02',
                userId: 'user-01',
                userLatitude: -19.632231,
                userLongitude: -43.895969
            })
        ).rejects.toBeInstanceOf(MaxDistanceError)
    })

})