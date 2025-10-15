import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: 'src/app/api', // path to your API routes
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Knect API Docs',
        version: '1.0',
      },
      components: {
        schemas: {
          User: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' },
              emailVerified: { type: 'boolean' },
              image: { type: 'string', nullable: true },
              about: { type: 'string', nullable: true },
              researchFocusSkills: { type: 'string', nullable: true, description: 'Comma-separated list of research/focus/skill areas' },
              username: { type: 'string', nullable: true },
              location: { type: 'string', nullable: true },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
  });
  return spec;
};