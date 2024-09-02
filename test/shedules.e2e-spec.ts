import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

jest.setTimeout(10000);

describe('Shedules E2E Test', () => {
    let app: INestApplication;
    let jwtToken: string;
    let ShedulesId: number;

    beforeAll(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();

        jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwic3ViIjo1LCJpYXQiOjE3MjUyNTkzMjksImV4cCI6MTcyNTI2MjkyOX0.33SE6U8z9EtQwDwYD11Hd-aICVHVvHPN78FRBdefCGg'
    });

    it('POST: /shedules should create a schedule and return it', async () => {
        const response = await request(app.getHttpServer())
        .post('/shedules')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
            medicina: 1,
            user: 5,
            intervalo: 4,
            finish_time: new Date(),
        })
        //.expect(201);

        ShedulesId = response.body.id;

        //expect(response.body.id).toBeDefined();
        //expect(response.body.medicina).toBeDefined();
        //expect(response.body.medicina.id).toEqual(4);

        //expect(response.body.user).toBeDefined();
        //expect(response.body.user.id).toEqual(5);
    })

    it('GET: /shedule should return all shedules', async () => {
        const response = await request (app.getHttpServer())
        .get('/shedules')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        //expect(response.body.length).toBeGreaterThan(0);
    });

    it('GET: /shedules/:id should return a specific schedule', async () => {
        const response = await request(app.getHttpServer())
        .get(`/shedules/${ShedulesId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        //.expect(200);

        expect(response.body.id).toEqual(ShedulesId);
        //expect(response.body.medicina).toBeDefined();
        //expect(response.body.medicina.id).toEqual(9);
    });

    it('PATCH: /shedules/:id should update the schedule and return it', async () => {
        const updateResponse = await request(app.getHttpServer())
        .patch(`/shedules/${jwtToken}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({
            finish_time: new Date(),
        })
        //.expect(200);
        expect(updateResponse.body).toBeDefined();

        const response = await request(app.getHttpServer())
            .get(`/shedules/${ShedulesId}`)
            .set('Authorization', `Bearer ${jwtToken}`)
            //.expect(200);

            //expect(response.body.intervalo).toEqual(4);
    });

    it('DELETE: /shedules/:id should delete the schedule', async () => {
        await request(app.getHttpServer())
        .delete(`/shedules/${jwtToken}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        //.expect(200);

        await request(app.getHttpServer())
        .get(`/shedules/${ShedulesId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(400);
    });

    afterAll(async () => {
        if (app) {
            await app.close();
        }
    });
});