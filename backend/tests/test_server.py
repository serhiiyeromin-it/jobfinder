def test_jobsuchen_get_empty(client):
    """GET /jobsuchen sollte 200 liefern und eine leere Liste zurückgeben,
    wenn keine Jobs vorhanden sind."""
    resp = client.get("/jobsuchen")
    assert resp.status_code == 200
    assert resp.is_json
    assert resp.get_json() == []
