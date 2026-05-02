import argparse
import csv
import sys
from jobspy import scrape_jobs


def main():
    parser = argparse.ArgumentParser(
        description="Scrape job listings from various job boards."
    )
    parser.add_argument(
        "--site-names",
        required=True,
        nargs="+",
        choices=["indeed", "linkedin", "zip_recruiter", "glassdoor", "google"],
        help="List of sites to scrape (space-separated)",
    )
    parser.add_argument(
        "--search-term", help='General job search term (e.g., "software engineer")'
    )
    parser.add_argument(
        "--google-search-term", help="Custom search term for Google jobs"
    )
    parser.add_argument(
        "--location", required=True, help="Geographic location for job search"
    )
    parser.add_argument(
        "--results-wanted",
        type=int,
        default=20,
        help="Number of desired results (default: 20)",
    )
    parser.add_argument(
        "--hours-old",
        type=int,
        default=72,
        help="Age limit for postings in hours (default: 72)",
    )
    parser.add_argument(
        "--country-indeed",
        default="USA",
        help="Country for Indeed searches (default: USA)",
    )
    parser.add_argument(
        "--linkedin-fetch-description",
        action="store_true",
        help="Enable detailed LinkedIn descriptions (slower)",
    )
    parser.add_argument(
        "--proxies", nargs="+", help="Proxy servers to use (space-separated)"
    )
    parser.add_argument(
        "--output", default="jobs.csv", help="Output CSV filename (default: jobs.csv)"
    )

    args = parser.parse_args()

    if not args.search_term and not args.google_search_term:
        parser.error(
            "At least one of --search-term or --google-search-term must be provided"
        )

    # Prepare parameters for scraping
    scrape_params = {
        "site_name": args.site_names,
        "search_term": args.search_term,
        "google_search_term": args.google_search_term,
        "location": args.location,
        "results_wanted": args.results_wanted,
        "hours_old": args.hours_old,
        "country_indeed": args.country_indeed,
        "linkedin_fetch_description": args.linkedin_fetch_description,
        "proxies": args.proxies,
    }

    # Remove None values to use function defaults
    scrape_params = {k: v for k, v in scrape_params.items() if v is not None}

    try:
        jobs = scrape_jobs(**scrape_params)
        print(f"Found {len(jobs)} jobs")
        print(jobs.head())

        jobs.to_csv(
            args.output, quoting=csv.QUOTE_NONNUMERIC, escapechar="\\", index=False
        )
        print(f"Jobs saved to {args.output}")
    except Exception as e:
        print(f"An error occurred: {str(e)}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
