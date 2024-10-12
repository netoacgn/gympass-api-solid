import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { app } from "@/app"
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';

describe('Nearby Gyms (e2e)', () => {
    beforeAll(async () => {
        app.ready()
    })

    afterAll(async () => {
        app.close()
    })

    it('should be able to list nearby gims', async () => {
        const { token } = await createAndAuthenticateUser(app)

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'JavaScript Gym',
                description: 'Some description',
                phone: '31999999999',
                latitude: -19.632231,
                longitude: -43.895969,
            })

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'TypeScript Gym',
                description: 'Some description',
                phone: '31999999999',
                latitude: -19.5421511,
                longitude: -43.7837277,
            })

        const response = await request(app.server)
            .get('/gyms/nearby')
            .query({
                latitude: -19.632231,
                longitude: -43.895969,
            })
            .set('Authorization', `Bearer ${token}`)
            .send()

        expect(response.statusCode).toEqual(200)
        expect(response.body.gyms).toHaveLength(1)
        expect(response.body.gyms).toEqual([
            expect.objectContaining({
                title: 'JavaScript Gym',
            })
        ])
    })

})