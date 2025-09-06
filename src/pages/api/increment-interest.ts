import type { APIRoute } from 'astro';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: import.meta.env.NOTION_TOKEN });

export const POST: APIRoute = async ({ request }) => {
  try {
    const { projectId } = await request.json();

    if (!projectId) {
      return new Response(JSON.stringify({ error: 'Project ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 1. Fetch the current page data to get the current interest count
    const page = await notion.pages.retrieve({ page_id: projectId });

    // Check if the Interest property exists and is a number
    if (!('Interest' in page.properties) || page.properties.Interest.type !== 'number') {
      throw new Error('The "Interest" property is not a number or does not exist.');
    }

    const currentInterest = page.properties.Interest.number || 0;
    const newInterest = currentInterest + 1;

    // 2. Update the page with the new interest count
    await notion.pages.update({
      page_id: projectId,
      properties: {
        Interest: {
          number: newInterest,
        },
      },
    });

    // 3. Return the new count
    return new Response(JSON.stringify({ count: newInterest }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error incrementing interest:', error);
    return new Response(JSON.stringify({ error: 'Failed to increment interest' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
