import requests
import time
from bs4 import BeautifulSoup
from requests.exceptions import ReadTimeout, RequestException


def crawl_stepstone():
    keywords = ["JIRA", "Python", "JavaScript"]
    location = "berlin"
    radius = 30
    formatted_keywords = '_'.join(keywords).lower()

    query_params = f"radius={radius}&q=JIRA,%20Python,%20JavaScript&searchOrigin=Resultlist_top-search"
    base_url = f"https://www.stepstone.de/jobs/{formatted_keywords}/in-{location}?"

    session = requests.Session()
    cookies = (
    "USER_HASH_ID=9b23e660-6915-4696-af5a-e02fa33fcd30; "
    "STEPSTONEV5LANG=de; anonymousUserId=54c38f96-52bd-fe64-0203-6d6746e69ed5; "
    "VISITOR_ID=194e15aca5cb58c161a302b8bba1c74e; s_vi=[CS]v1|687ced4e7e515fa6-53e0727c610c8c83[CE]; "
    "s_fid=687ced4e7e515fa6-53e0727c610c8c83; V5=1; optimizelySession=1743511178329; "
    "CONSENTMGR=c1:1%7Cc2:1%7Cc3:1%7Cc4:1%7Cc5:0%7Cc6:1%7Cc7:1%7Cc8:0%7Cc9:1%7Cc10:0%7Cc11:0%7Cc12:1%7Cc13:1%7Cc14:0%7Cc15:0%7Cts:1743511183752%7Cconsent:true; "
    "_fbp=fb.1.1743511184333.562437931613812460; _gcl_au=1.1.1804221148.1743511184; _scid=GosweDy3qpvs5jfNjXg9fhKQ_PU6QlFZ;"
    )
    session.headers.update({
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Cookie": cookies
    })


    first_page_url = f"{base_url}?{query_params}&page=1"
    print(f"Scraping URL der ersten Seite: {first_page_url}")

    response = session.get(first_page_url, timeout=10)

    if response.status_code == 200:
        
        soup = BeautifulSoup(response.content, 'html.parser')
        print("HTML-Inhalte erfolgreich geladen und geparst.")

        pagination_list = soup.find('ul', class_='res-f7vubm')
        if pagination_list:
            pages = pagination_list.find_all('li')
            last_page_element = pages[-2]
            last_page_span = last_page_element.find('span', {'aria-hidden': 'true'})
            last_page = int(last_page_span.text.strip()) if last_page_span else 1
            print(f"Gesamtanzahl der Seiten: {last_page}")
        else:
            last_page = 1 
            print("Keine Pagination gefunden, es wird nur eine Seite gecrawlt.")

        all_jobs = []

        for page in range(1, last_page + 1):
            search_url = f"{base_url}radius={radius}&page={page}&q=JIRA%2c+Python%2c+JavaScript&searchOrigin=Resultlist_top-search"
            retries = 0
            max_retries = 3
            print(f"Scraping Seite {page}: {search_url}")
            
            while retries < max_retries:
                try:
                    response = session.get(search_url, timeout=10)
                    if response.status_code == 200:
                        soup = BeautifulSoup(response.content, 'html.parser')
                        job_listings = soup.find_all('div', class_='res-urswt')

                        if job_listings:
                            for job in job_listings:
                                title = job.find('div', class_='res-nehv70').text.strip() if job.find('div', class_='res-nehv70') else "Kein Titel verfügbar"
                                link = job.find('a', class_='res-1foik6i')['href'] if job.find('a', class_='res-1foik6i') else "Kein Link verfügbar"
                                company = job.find('span', class_='res-btchsq').text.strip() if job.find('span', class_='res-btchsq') else "Keine Firma angegeben"
                                all_jobs.append({
                                    'title': title,
                                    'link': f"https://www.stepstone.de{link}" if link != "Kein Link verfügbar" else link,
                                    'company': company
                                })
                            print(f"Seite {page}: {len(job_listings)} Jobs gefunden.")
                            break
                        else:
                            print(f"Seite {page}: Keine Jobdaten gefunden.")
                            break
                    else:
                        print(f"Fehler beim Abrufen von Seite {page}: {response.status_code}")
                        retries += 1

                except ReadTimeout:
                    print(f"Timeout bei Seite {page}, Versuch {retries + 1} von {max_retries}.")
                    retries += 1
                except RequestException as e:
                    print(f"Ein Fehler ist aufgetreten: {e}")
                    break
                
                time.sleep(5 * retries)
            time.sleep(2)

        print(f"Gesamtanzahl gefundener Jobs: {len(all_jobs)}")
        for job in all_jobs:
            print(job)

    else:
        print(f"Fehler beim Abrufen der ersten Seite: {response.status_code}")

if __name__ == '__main__':
    crawl_stepstone()