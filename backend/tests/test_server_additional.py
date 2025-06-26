from bson import ObjectId

def _insert_dummy_job(collection):
    job = {"title": "Dev", "company": "TestCorp", "link": "http://example.com", "bookmark": False}
    res = collection.insert_one(job)
    job['_id'] = str(res.inserted_id)
    return job

def test_update_bookmark_success(client, collection):
    job = _insert_dummy_job(collection)
    payload = {"_id": job["_id"], "bookmark": True}
    resp = client.post("/update_bookmark", json=payload)
    assert resp.status_code == 200
    doc = collection.find_one({"_id": ObjectId(job["_id"])})
    assert doc["bookmark"] is True

def test_update_bookmark_missing_param(client):
    resp = client.post("/update_bookmark", json={"bookmark": True})
    assert resp.status_code == 400

def test_update_search_alert_not_found(client):
    fake_id = str(ObjectId())
    resp = client.post(f"/update_search_alert/{fake_id}", json={})
    assert resp.status_code == 404

def test_delete_search_alert_not_found(client):
    fake_id = str(ObjectId())
    resp = client.delete(f"/delete_search_alert/{fake_id}")
    assert resp.status_code == 404

def test_get_search_results_empty(client):
    fake_alert_id = str(ObjectId())
    resp = client.get(f"/get_search_results/{fake_alert_id}")
    assert resp.status_code == 200
    assert resp.get_json() == []
