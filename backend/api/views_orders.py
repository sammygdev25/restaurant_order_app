from decimal import Decimal

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from api.models import Order, OrderItem, Cart, CartItem
from api.serializers_orders import OrderSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly

DELIVERY_FEE = Decimal('4.99')


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filterset_fields = ['order_type', 'status', 'user']
    search_fields = ['delivery_address', 'phone']
    ordering_fields = ['created_at', 'total_amount', 'status']

    def get_queryset(self):
        qs = Order.objects.all().order_by('-created_at')
        user = self.request.user
        if not user.is_authenticated:
            return Order.objects.none()
        if user.is_staff:
            return qs
        return qs.filter(user=user)

    def create(self, request, *args, **kwargs):
        user = request.user
        if not user.is_authenticated:
            return Response(
                {'detail': 'Authentication required to place an order.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        try:
            cart = Cart.objects.get(user=user)
        except Cart.DoesNotExist:
            return Response(
                {'detail': 'Your cart is empty.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        cart_items = CartItem.objects.filter(cart=cart).select_related('dish')
        if not cart_items.exists():
            return Response(
                {'detail': 'Your cart is empty.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        order_type = request.data.get('order_type', 'pickup')
        if order_type not in ('pickup', 'delivery'):
            order_type = 'pickup'

        delivery_address = request.data.get('delivery_address', '') or ''
        phone = request.data.get('phone', '') or ''

        if order_type == 'delivery' and not delivery_address:
            return Response(
                {'detail': 'A delivery address is required for delivery orders.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        subtotal = sum(
            (item.dish.price * item.quantity for item in cart_items),
            Decimal('0.00'),
        )
        delivery_fee = DELIVERY_FEE if order_type == 'delivery' else Decimal('0.00')
        total_amount = subtotal + delivery_fee

        order = Order.objects.create(
            user=user,
            order_type=order_type,
            status='pending',
            delivery_address=delivery_address,
            phone=phone,
            subtotal=subtotal,
            delivery_fee=delivery_fee,
            total_amount=total_amount,
            stripe_payment_intent_id=request.data.get('stripe_payment_intent_id', '') or '',
        )

        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                dish=item.dish,
                quantity=item.quantity,
                price=item.dish.price,
            )

        cart_items.delete()

        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], url_path='confirm_payment')
    def confirm_payment(self, request, pk=None):
        order = self.get_object()

        if order.user != request.user and not request.user.is_staff:
            return Response(
                {'detail': 'You do not have permission to confirm this order.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        if order.status not in ('pending',):
            return Response(
                {'detail': f'Order cannot be confirmed from status "{order.status}".'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        payment_intent_id = request.data.get('stripe_payment_intent_id', '')
        if payment_intent_id:
            order.stripe_payment_intent_id = payment_intent_id

        order.status = 'paid'
        order.save()

        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='update_status')
    def update_status(self, request, pk=None):
        order = self.get_object()

        if not request.user.is_staff:
            return Response(
                {'detail': 'Only staff may update order status.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        new_status = request.data.get('status')
        valid_statuses = [choice[0] for choice in Order._meta.get_field('status').choices]
        if new_status not in valid_statuses:
            return Response(
                {'detail': f'Invalid status. Must be one of {valid_statuses}.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        order.status = new_status
        order.save()

        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)