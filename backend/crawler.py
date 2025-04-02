import requests
from bs4 import BeautifulSoup

from urllib.parse import urlencode

def crawl_stepstone():

    keywords = ["JIRA", "Python", "JavaScript"]
    location = "berlin"
    radius = 30

    formatted_keywords = '_'.join(keywords).lower()

    query_params = f"radius={radius}&searchOrigin=membersarea&q=JIRA,%20Python,%20JavaScript"
    search_url = f"https://www.stepstone.de/jobs/{formatted_keywords}/in-{location}?{query_params}"
    print(f"Such-URL: {search_url}")

    headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }

    response = requests.get(search_url, headers=headers, timeout=10)

    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        print("HTML-Inhalte erfolgreich geladen und geparst.")

        first_job = soup.find('div', class_='res-urswt')
        if first_job:
            title = first_job.find('div', class_='res-nehv70').text.strip()
            link = first_job.find('a', class_='res-1foik6i')['href']
            company = first_job.find('span', class_='res-btchsq').text.strip()
            job_data = {
                'title': title,
                'link': f"https://www.stepstone.de{link}",
                'company': company
            }
            print(f"Gefundener Job: {job_data}")
        else:
            print("Keine Jobdaten gefunden!")
    else:
        print(f"Fehler beim Abrufen der Webseite: {response.status_code}")

if __name__ == '__main__':
    crawl_stepstone()