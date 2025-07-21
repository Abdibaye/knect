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
    },
  });
  return spec;
};
export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
