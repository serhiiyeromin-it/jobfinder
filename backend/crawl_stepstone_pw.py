from playwright.sync_api import sync_playwright

def crawl_stepstone_playwright(keywords, location, radius, pages=2):
    results = []
    formatted_keywords = "-".join(keywords)
    formatted_location = location.lower().replace(" ", "-")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        for page_number in range(1, pages + 1):
            url = (
                f"https://www.stepstone.de/jobs/{formatted_keywords}/in-{formatted_location}/"
                f"?radius={radius}&sort=2&action=sort_publish&searchOrigin=homepage&page={page_number}"
            )
            print(f"🔍 Navigiere zu: {url}")
            try:
                page.goto(url, timeout=60000, wait_until="load")
                job_cards = page.query_selector_all('article[data-test-id="job-item"]')

                if not job_cards:
                    print("⚠️ Keine Jobkarten gefunden auf Seite", page_number)

                for job in job_cards:
                    title_el = job.query_selector('a')
                    title = title_el.inner_text().strip() if title_el else "Kein Titel"
                    link = title_el.get_attribute("href") if title_el else ""
                    if link and not link.startswith("http"):
                        link = "https://www.stepstone.de" + link

                    company_el = job.query_selector('span[data-at="job-item-company-name"]')
                    company = company_el.inner_text().strip() if company_el else "Keine Firma"

                    results.append({
                        "title": title,
                        "company": company,
                        "link": link
                    })

            except Exception as e:
                print(f"❌ Fehler beim Laden der Seite {page_number}: {e}")

        browser.close()

    return results

# Starter
if __name__ == "__main__":
    jobs = crawl_stepstone_playwright(["python", "entwickler"], "berlin", 50, pages=2)
    for job in jobs:
        print(job)
