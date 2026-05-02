import { isValidUrl } from '@/lib/utils';

const descriptionCache = new Map<string, string>();
const MAX_RETRIES = 3;
const TIMEOUT_MS = 10_000;

async function fetchWithRetry(url: string, retries = MAX_RETRIES): Promise<Response> {
  for (let attempt = 0; attempt < retries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        redirect: 'follow',
        signal: controller.signal,
      });
      clearTimeout(timeout);
      return response;
    } catch (error) {
      clearTimeout(timeout);
      if (attempt === retries - 1) throw error;
      const delay = Math.pow(2, attempt) * 500;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
}

async function followRedirects(url: string): Promise<string> {
  const response = await fetchWithRetry(url);
  return response.url;
}

export async function scrapeJobDescription(url: string): Promise<string> {
  const cached = descriptionCache.get(url);
  if (cached) return cached;

  try {
    if (!isValidUrl(url)) {
      throw new Error('Invalid URL provided');
    }

    let finalUrl = url;
    if (url.includes('g.co') || url.includes('google.com/search')) {
      try {
        finalUrl = await followRedirects(url);
      } catch (error) {
        console.warn('Failed to follow redirect:', error);
      }
    }

    const corsProxy = 'https://corsproxy.io/?';
    const response = await fetchWithRetry(corsProxy + encodeURIComponent(finalUrl));

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

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
      '.vDEn6d',
      '.HBvzbc',
      '.WbZuDe'
    ];

    let content = '';
    for (const selector of selectors) {
      const elements = doc.querySelectorAll(selector);
      if (elements.length > 0) {
        content = Array.from(elements)
          .map(el => el.textContent || '')
          .join('\n\n')
          .trim();
        if (content) break;
      }
    }

    if (!content) {
      throw new Error('Could not find job description content');
    }

    const result = content.replace(/\s+/g, ' ').trim();
    descriptionCache.set(url, result);
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load job description: ${error.message}`);
    }
    throw new Error('Failed to load job description');
  }
}
