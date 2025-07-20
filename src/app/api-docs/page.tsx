import { getApiDocs } from '@/lib/swagger';
import SwaggerUIClient from './SwaggerUIClient';

export default async function DocsPage() {
  const spec = await getApiDocs();
  return (
    <div style={{ height: '100vh' }}>
      <SwaggerUIClient spec={spec} />
    </div>
  );
}