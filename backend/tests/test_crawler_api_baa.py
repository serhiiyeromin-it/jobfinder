from unittest.mock import patch
from crawler_api_baa import crawl_arbeitsagentur

def fake_response(*args, **kwargs):
    class FakeResp:
        status_code = 200
        def raise_for_status(self): pass
        def json(self):
            return {
                "stellenangebote": [
                    {
                        "hashId": "abc123",
                        "beruf": "Python Entwickler",
                        "arbeitgeber": "Test GmbH",
                        "arbeitsort": "Berlin",
                        "stellenangebotURL": "https://example.com/job/1"
                    }
                ]
            }
    return FakeResp()

@patch("crawler_api_baa.requests.get", side_effect=fake_response)
def test_crawl_arbeitsagentur_single(mock_get):
    jobs = crawl_arbeitsagentur(["Python"], "Berlin", 30)
    assert len(jobs) == 1
    job = jobs[0]
    assert job["title"] == "Python Entwickler"
    assert job["company"] == "Test GmbH"
    assert job["location"] == "Berlin"
    assert job["link"] == "https://example.com/job/1"
