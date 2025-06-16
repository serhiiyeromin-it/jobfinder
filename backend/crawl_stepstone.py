import requests
from bs4 import BeautifulSoup
from requests.exceptions import ReadTimeout


def crawl_stepstone(keywords, location, radius):

    formatted_keywords_a = '%2c+'.join(keywords)
    formatted_keywords_b = '_'.join(keywords).lower()
    headers = { # Hier werden die Header für die Anfrage definiert
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }

    all_jobs = [] # Hier wird eine leere Liste für alle Jobs erstellt

    for page in range(1, 7):

        search_url = f"https://www.stepstone.de/jobs/{formatted_keywords_b}/in-{location}?radius={radius}&page={page}&sort=2&action=sort_publish&q={formatted_keywords_a}&searchOrigin=Resultlist_top-search" # Hier wird die URL für die jeweilige Seite erstellt
        print (search_url) # Hier wird die URL ausgegeben, um zu sehen, welche Seite gerade abgefragt wird
        try:
            response = requests.get(search_url, headers=headers, timeout=30) # Hier wird die Anfrage an die URL gesendet
            print("Status Code:", response.status_code)
            print(response.text[:5000])
            if response.status_code == 200: # Hier wird überprüft, ob die Anfrage erfolgreich war (Statuscode 200)

                soup = BeautifulSoup(response.content, 'html.parser') # Hier wird der Inhalt der Seite mit BeautifulSoup geparsed
                job_listings = soup.find_all('div', class_='res-4em2ed') # Hier werden alle Jobangebote auf der Seite gefunden

                if job_listings:
                    for job in job_listings:

                        title = job.find('div', class_='res-ewgtgq').text.strip() if job.find('div', class_='res-ewgtgq') else "Kein Titel verfügbar" # Hier wird der Titel des Jobs gefunden
                        link = job.find('a', class_='res-1cv93ld')['href'] if job.find('a', class_='res-1cv93ld') else "Kein Link verfügbar" # Hier wird der Link zum Job gefunden
                        company = job.find('span', class_='res-du9bhi').text.strip() if job.find('span', class_='res-du9bhi') else "Keine Firma angegeben" # Hier wird der Firmenname gefunden

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