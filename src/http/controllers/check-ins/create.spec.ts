import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "@/app"
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import { prisma } from '@/lib/prisma';

describe('Create Check-in (e2e)', () => {
    beforeAll(async () => {
        app.ready()
    })

    afterAll(async () => {
        app.close()
    })

    it('should be able to create a check-in', async () => {
        const { token } = await createAndAuthenticateUser(app)

        const gym = await prisma.gym.create({
            data: {
                title: 'JavaScript Gym',
                latitude: -19.632231,
                longitude: -43.895969,
            }
        })

        const response = await request(app.server)
            .post(`/gyms/${gym.id}/check-ins`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                latitude: -19.632231,
                longitude: -43.895969,
            })

        expect(response.statusCode).toEqual(201)
    })

})