import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authetication (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/signup (POST)', () => {
    const userEmail = 'ab1c@test.com';

    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: userEmail, password: '12345' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;

        expect(id).toBeDefined();
        expect(email).toBe(userEmail);
      });
  });

  it('/auth/whoami (GET)', async () => {
    const userEmail = 'ab1c@test.com';

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: userEmail, password: '12345' })
      .expect(201);

    const cookie = res.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toBe(userEmail);
  });

  it('/auth/signin (POST)', async () => {
    const userEmail = 'ab1c@test.com';
    const userPassword = '12345';

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: userEmail, password: userPassword });

    await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: userEmail, password: userPassword })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;

        expect(email).toBe(userEmail);
        expect(id).toBeDefined();
      });
  });
});
