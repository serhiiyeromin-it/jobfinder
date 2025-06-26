def test_jobsuchen_get_empty(client):
    resp = client.get('/jobsuchen')
    assert resp.status_code == 200
    assert resp.get_json() == []

def test_bookmark_flow(client):
    # füge Dummy-Job ein (POST /jobsuchen simulieren)
    job = {"title": "Tester", "company": "ACME", "link": "http://example.com", "bookmark": False}
    resp = client.post('/update_bookmark', json=job)  # erwarteter 400, fehlt _id
    assert resp.status_code == 400

def test_search_alert_crud(client):
    # 1) Save new alert
    payload = {"keywords": ["Python"], "location": "Berlin", "radius": 30, "email": "test@example.com"}
    resp = client.post('/save_search', json=payload)
    assert resp.status_code == 200
    alert_id = resp.get_json()['search_alert']['_id']

    # 2) List alerts
    resp = client.get('/search_alerts')
    assert resp.status_code == 200
    alerts = resp.get_json()
    assert any(a['_id'] == alert_id for a in alerts)

    # 3) Update alert
    new_data = {"keywords": ["Django"], "location": "Berlin", "radius": 25, "email": "test@example.com"}
    resp = client.post(f'/update_search_alert/{alert_id}', json=new_data)
    assert resp.status_code == 200 and resp.get_json()['success'] is True

    # 4) Get search results (leer)
    resp = client.get(f'/get_search_results/{alert_id}')
    assert resp.status_code == 200
    assert resp.get_json() == []

    # 5) Delete alert
    resp = client.delete(f'/delete_search_alert/{alert_id}')
    assert resp.status_code == 200 and resp.get_json()['success'] is True

    # 6) Verify deletion
    resp = client.get('/search_alerts')
    assert alert_id not in [a['_id'] for a in resp.get_json()]
