from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from api.models import Cart, CartItem
from api.serializers_cart import CartSerializer, CartItemSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly


class CartViewSet(viewsets.ModelViewSet):
    queryset = Cart.objects.all().order_by('-created_at')
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filterset_fields = ['user']
    search_fields = []
    ordering_fields = ['created_at', 'updated_at']

    def get_queryset(self):
        queryset = Cart.objects.all().order_by('-created_at')
        if self.request.user.is_authenticated:
            return queryset.filter(user=self.request.user)
        return queryset.none()

    def list(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return Response([])
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(cart)
        return Response([serializer.data])

    def create(self, request, *args, **kwargs):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['get', 'post'], url_path='mine')
    def mine(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(cart)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='clear')
    def clear(self, request, pk=None):
        cart = self.get_object()
        cart.items.all().delete()
        serializer = self.get_serializer(cart)
        return Response(serializer.data)


class CartItemViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.all().order_by('created_at')
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filterset_fields = ['cart', 'dish']
    search_fields = []
    ordering_fields = ['created_at', 'updated_at', 'quantity']

    def get_queryset(self):
        queryset = CartItem.objects.all().order_by('created_at')
        if self.request.user.is_authenticated:
            return queryset.filter(cart__user=self.request.user)
        return queryset.none()

    def perform_create(self, serializer):
        cart, _ = Cart.objects.get_or_create(user=self.request.user)
        dish = serializer.validated_data.get('dish')
        quantity = serializer.validated_data.get('quantity', 1)
        existing = CartItem.objects.filter(cart=cart, dish=dish).first()
        if existing:
            existing.quantity += quantity
            existing.save()
            serializer.instance = existing
        else:
            serializer.save(cart=cart)