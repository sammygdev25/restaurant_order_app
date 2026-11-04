from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from api.models import Category, Dish
from api.serializers_menu import CategorySerializer, DishSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = []
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']


class DishViewSet(viewsets.ModelViewSet):
    queryset = Dish.objects.all().order_by('name')
    serializer_class = DishSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = []
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'name', 'created_at']