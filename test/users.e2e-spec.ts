import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
jest.setTimeout(30000);
describe('Users E2E Test', () => {
  let app: INestApplication;
  let jwtToken: string;
  let userId: number;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    // Establece el token directamente
    jwtToken =  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwic3ViIjo1LCJpYXQiOjE3MjUyNTkzMjksImV4cCI6MTcyNTI2MjkyOX0.33SE6U8z9EtQwDwYD11Hd-aICVHVvHPN78FRBdefCGg';
  });

  it('POST: /users/register should create a user and return it', async () => {
    const response = await request(app.getHttpServer())
      .post('/users/register')
      .send({
        userName: 'testuser',
        email: 'testuser@example.com',
        password: 'testpassword',
      })
      .expect(201);

    userId = response.body.user.id;

    expect(response.body.user.id).toBeDefined();
    expect(response.body.user.email).toEqual('testuser@example.com');
  });

  it('GET: /users should return all users', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization',` Bearer ${jwtToken}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('GET: /users/:id should return a specific user', async () => {
    const response = await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(response.body.id).toEqual(userId);
    expect(response.body.email).toEqual('testuser@example.com');
  });

  it('PATCH: /users/:id should update the user and return it', async () => {
    await request(app.getHttpServer())
      .patch(`/users/${userId}`)
      .set('Authorization',` Bearer ${jwtToken}`)
      .send({
        userName: 'updateduser',
        email: 'updateduser@example.com',
      })
      .expect(200);

    const response = await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(response.body.userName).toEqual('updateduser');
    expect(response.body.email).toEqual('updateduser@example.com');
  });

  it('DELETE: /users/:id should delete the user', async () => {
    await request(app.getHttpServer())
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(404);
  });

  afterAll(async () => {

    if (app) {
      await app.close();
    }
  });
});