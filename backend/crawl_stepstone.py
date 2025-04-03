import requests
from bs4 import BeautifulSoup
from requests.exceptions import ReadTimeout


def crawl_stepstone(keywords, location, radius):

    formatted_keywords_a = ',%20'.join(keywords)
    formatted_keywords_b = '_'.join(keywords).lower()

    query_params = f"radius={radius}&sort=2&action=sort_publish&q={formatted_keywords_a}&searchOrigin=Resultlist_top-search" # Hier werden die Parameter für die URL definiert
    base_url = f"https://www.stepstone.de/jobs/{formatted_keywords_b}/in-{location}?" # Hier wird die Basis-URL definiert
    # search_url = f"{base_url}{query_params}&page=1"
    headers = { # Hier werden die Header für die Anfrage definiert
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    # response = requests.get(search_url, headers=headers, timeout=10)

    # if response.status_code == 200:

    #     soup = BeautifulSoup(response.content, 'html.parser')

        # pagination_list = soup.find('ul', class_='res-f7vubm')
        # if pagination_list:
        #     pages = pagination_list.find_all('li')
        #     last_page_element = pages[-2]
        #     last_page_span = last_page_element.find('span', {'aria-hidden': 'true'})
        #     last_page = int(last_page_span.text.strip()) if last_page_span else 1
        #     print(f"Gesamtanzahl der Seiten: {last_page}")
        # else:
        #     last_page = 1 
        #     print("Keine Pagination gefunden, es wird nur eine Seite gecrawlt.")

    all_jobs = [] # Hier wird eine leere Liste für alle Jobs erstellt

    for page in range(1, 7):

        search_url = f"{base_url}radius={radius}&page={page}&q=JIRA%2c+Python%2c+JavaScript&searchOrigin=Resultlist_top-search" # Hier wird die URL für die jeweilige Seite erstellt

        try:
            response = requests.get(search_url, headers=headers, timeout=10) # Hier wird die Anfrage an die URL gesendet
            if response.status_code == 200: # Hier wird überprüft, ob die Anfrage erfolgreich war (Statuscode 200)

                soup = BeautifulSoup(response.content, 'html.parser') # Hier wird der Inhalt der Seite mit BeautifulSoup geparsed
                job_listings = soup.find_all('div', class_='res-urswt') # Hier werden alle Jobangebote auf der Seite gefunden

                if job_listings:
                    for job in job_listings:

                        title = job.find('div', class_='res-nehv70').text.strip() if job.find('div', class_='res-nehv70') else "Kein Titel verfügbar" # Hier wird der Titel des Jobs gefunden
                        link = job.find('a', class_='res-1foik6i')['href'] if job.find('a', class_='res-1foik6i') else "Kein Link verfügbar" # Hier wird der Link zum Job gefunden
                        company = job.find('span', class_='res-btchsq').text.strip() if job.find('span', class_='res-btchsq') else "Keine Firma angegeben" # Hier wird der Firmenname gefunden

                        job_data = { # Hier wird ein Dictionary für den Job erstellt
                        'title': title,
                        'company': company,
                        'link': f"https://www.stepstone.de{link}" if link != "Kein Link verfügbar" else link
                        }
                        all_jobs.append(job_data) # Hier wird der Job zum Dictionary hinzugefügt

                    print(f"Seite {page}: {len(job_listings)} Jobs gefunden.")

                else:
                    print(f"Seite {page}: Keine Jobdaten gefunden.")

            else:
                print(f"Fehler beim Abrufen von Seite {page}: {response.status_code}")

        except ReadTimeout:
            print(f"Timeout bei Seite {page}.")

    return all_jobs # Hier wird die Liste mit allen Jobs zurückgegeben