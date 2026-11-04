import pytest

pytestmark = pytest.mark.django_db


class TestCategoryViewSet:

    def test_list_public(self, api_client):
        response = api_client.get("/api/api/categories/")
        assert response.status_code == 200
    def test_create_unauthenticated(self, api_client):
        response = api_client.post("/api/api/categories/", {})
        assert response.status_code in (400, 401, 403)


class TestDishViewSet:

    def test_list_public(self, api_client):
        response = api_client.get("/api/api/dishes/")
        assert response.status_code == 200
    def test_create_unauthenticated(self, api_client):
        response = api_client.post("/api/api/dishes/", {})
        assert response.status_code in (400, 401, 403)


class TestCartViewSet:

    def test_list_public(self, api_client):
        response = api_client.get("/api/api/cart/")
        assert response.status_code == 200
    def test_create_unauthenticated(self, api_client):
        response = api_client.post("/api/api/cart/", {})
        assert response.status_code in (400, 401, 403)


class TestCartItemViewSet:

    def test_list_public(self, api_client):
        response = api_client.get("/api/api/cart-items/")
        assert response.status_code == 200
    def test_create_unauthenticated(self, api_client):
        response = api_client.post("/api/api/cart-items/", {})
        assert response.status_code in (400, 401, 403)


class TestOrderViewSet:

    def test_list_public(self, api_client):
        response = api_client.get("/api/api/orders/")
        assert response.status_code == 200
    def test_create_unauthenticated(self, api_client):
        response = api_client.post("/api/api/orders/", {})
        assert response.status_code in (400, 401, 403)


class TestReservationViewSet:

    def test_list_public(self, api_client):
        response = api_client.get("/api/api/reservations/")
        assert response.status_code == 200
    def test_create_unauthenticated(self, api_client):
        response = api_client.post("/api/api/reservations/", {})
        assert response.status_code in (400, 401, 403)


class TestAdminStatsView:

    def test_list_public(self, api_client):
        response = api_client.get("/api/api/admin/stats/")
        assert response.status_code == 200
