const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'Документація API для вебдодатку',
            contact: {
                name: 'API Support',
                email: 'support@example.com'
            }
        },
        servers: [
            {
                url: process.env.BASE_URL || "http://localhost:3000",
                description: 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Введіть JWT токен'
                }
            },
            schemas: {
                Error: {
      type: 'object',
      properties: {
        code: { 
          type: 'integer', 
          description: 'HTTP код помилки', 
          enum: [400, 401, 404, 500], 
        },
        message: { 
          type: 'string', 
          description: 'Повідомлення про помилку', 
          enum: [
            'Некоректний запит',
            'Неавторизований користувач',
            'Ресурс не знайдено',
            'Помилка на сервері'
          ],
        },
        details: { 
          type: 'string', 
          description: 'Додаткова інформація про помилку', 
          nullable: true, 
        }
      },
    },
                User: {
                    type: 'object',
                    properties: {
                        id: { 
                            type: 'integer' 
                        },
                        name: { 
                            type: 'string' 
                        },
                        email: { 
                            type: 'string', format: 'email'                             
                        },
                        birthDate: { 
                            type: 'string', format: 'date-time', nullable: true 
                        },
                        role: { 
                            type: 'string', enum: ['USER', 'ADMIN'] 
                        },
                        avatar: { 
                            type: 'string', nullable: true 
                        },
                        createdAt: { 
                            type: 'string', format: 'date-time' 
                        },
                        updatedAt: { 
                            type: 'string', format: 'date-time' 
                        }
                    }
                },

                Task: {
                    type: 'object',
                    properties: {
                        id: 
                        { 
                            type: 'integer'                     
                        },
                        title: 
                        { 
                            type: 'string'                             
                        },
                        description: 
                        { 
                            type: 'string', nullable: true 
                        },
                        dueDate: 
                        { 
                            type: 'string', format: 'date-time', nullable: true 
                        },
                        priority: 
                        { 
                            type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'] 
                        },
                        timeSpent: 
                        { 
                            type: 'number', nullable: true 
                        },
                        completed: 
                        { 
                            type: 'boolean' 
                        },
                        userId: 
                        { 
                            type: 'integer' 
                        },
                        categoryId: 
                        { 
                            type: 'integer', nullable: true 
                        },
                        createdAt: 
                        { 
                            type: 'string', format: 'date-time' 
                        },
                        updatedAt: 
                        { 
                            type: 'string', format: 'date-time' 
                        }
                    }
                },

                Category: {
                    type: 'object',
                    properties: {
                        id: 
                        { 
                            type: 'integer' 
                        },
                        name: 
                        { 
                            type: 'string' 
                        }
                    }
                },

                Timelog: {
                    type: 'object',
                    properties: {
                        id: 
                        { 
                            type: 'integer' 
                        },
                        userId: 
                        { 
                            type: 'integer' 
                        },
                        taskId: 
                        { 
                            type: 'integer' 
                        },
                        startTime: 
                        { 
                            type: 'string', format: 'date-time' 
                        },
                        endTime: 
                        { 
                            type: 'string', format: 'date-time', nullable: true 
                        },
                        duration: 
                        { 
                            type: 'number', nullable: true 
                        },
                        createdAt: 
                        { 
                            type: 'string', format: 'date-time'                             
                        }
                    }
                },

                File: {
                    type: 'object',
                    properties: {
                        id: 
                        { 
                            type: 'integer' 
                        },
                        filename: 
                        { 
                            type: 'string' 
                        },
                        originalName: 
                        { 
                            type: 'string' 
                        },
                        mimetype: 
                        { 
                            type: 'string' 
                        },
                        size: 
                        { 
                            type: 'integer' 
                        },
                        path: 
                        { 
                            type: 'string' 
                        },
                        uploadedBy: 
                        { 
                            type: 'integer' 
                        },
                        taskId: 
                        { 
                            type: 'integer', nullable: true 
                        },
                        createdAt: 
                        { 
                            type: 'string', format: 'date-time' 
                        }
                    }
                },

                Pagination: {
                    type: 'object',
                    properties: {
                        page: {
                            type: 'integer'
                        },
                        limit: {
                            type: 'integer'
                        },
                        total: {
                            type: 'integer'
                        },
                        totalPages: {
                            type: 'integer'
                        },
                        hasMore: {
                            type: 'boolean'
                        }
                    }
                }
            }
        },
        tags: [
            {
                name: 'Authentication',
                description: 'Операції аутентифікації'
            },
            {
                name: 'Files',
                description: 'Управління файлами'
            },
            {
                name: "Users",
                description: "Управління користувачами",
            },
            {
                name: "Tasks",
                description: "Управління завданнями",
            },
            {
                name: "Categories",
                description: "Управління категоріями завдань",
            },
            {
                name: "Timelogs",
                description: "Управління записами часу",
            },
        ]
    },
    apis: ['./src/routes/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = specs;