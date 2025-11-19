const request = require('supertest');
const app = require('../src/app');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

describe('Authentication API', () => {
    let testUser;

    beforeAll(async () => {
        await prisma.user.deleteMany({
            where: { email: 'test@example.com' }
        });
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    describe('POST /api/auth/register', () => {
        it('повинен зареєструвати нового користувача', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test@example.com',
                    password: 'testpassword123',
                    name: 'Test User'
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('user');
            expect(response.body).toHaveProperty('tokens');
            expect(response.body.user.email).toBe('test@example.com');

            testUser = response.body.user;
        });

        it('не повинен зареєструвати користувача з існуючим email', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test@example.com',
                    password: 'testpassword123',
                    name: 'Test User 2'
                });

            expect(response.status).toBe(409);
        });

        it('не повинен зареєструвати користувача з коротким паролем', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'test2@example.com',
                    password: 'short',
                    name: 'Test User 2'
                });

            expect(response.status).toBe(400);
        });
    });

    describe('POST /api/auth/login', () => {
        it('повинен увійти з правильними credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'testpassword123'
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('tokens');
            expect(response.body.tokens).toHaveProperty('accessToken');
            expect(response.body.tokens).toHaveProperty('refreshToken');
        });

        it('не повинен увійти з невірним паролем', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'wrongpassword'
                });

            expect(response.status).toBe(401);
        });
    });
    
});