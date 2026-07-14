def test_root(client):
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Library Management System API is running."}


def test_health_check(client):
    response = client.get("/health/")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_openapi_schema(client):
    response = client.get("/openapi.json")
    assert response.status_code == 200
