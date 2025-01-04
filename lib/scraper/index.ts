import { isValidUrl } from '@/lib/utils';

async function followRedirects(url: string): Promise<string> {
  const response = await fetch(url, { redirect: 'follow' });
  return response.url;
}

export async function scrapeJobDescription(url: string): Promise<string> {
  try {
    if (!isValidUrl(url)) {
      throw new Error('Invalid URL provided');
    }

    // Handle Google redirects (g.co links)
    let finalUrl = url;
    if (url.includes('g.co') || url.includes('google.com/search')) {
      try {
        finalUrl = await followRedirects(url);
      } catch (error) {
        console.warn('Failed to follow redirect:', error);
        // Continue with original URL if redirect fails
      }
    }

    // Use a CORS proxy to bypass restrictions
    const corsProxy = 'https://corsproxy.io/?';
    const response = await fetch(corsProxy + encodeURIComponent(finalUrl));
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Common selectors for job descriptions
    const selectors = [
      '[data-testid="job-description"]',
      '.job-description',
      '#job-description',
      '.description',
      'article',
      '.posting-requirements',
      '[role="main"]',
      '.job-details',
      '.details-info',
      '[jsname]',
      '[jsname="jobDescriptionText"]',
      '[jsname="description"]',
      '.NgUYpe',
      // Google Jobs specific selectors
      '.vDEn6d',
      '.HBvzbc',
      '.WbZuDe'
    ];

    let content = '';
    for (const selector of selectors) {
      const elements = doc.querySelectorAll(selector);
      if (elements.length > 0) {
        // Combine text from all matching elements
        content = Array.from(elements)
          .map(el => el.textContent || '')
          .join('\n\n')
          .trim();
        break;
      }
    }

    if (!content) {
      throw new Error('Could not find job description content');
    }

    return content.replace(/\s+/g, ' ').trim();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load job description: ${error.message}`);
    }
    throw new Error('Failed to load job description');
  }
}