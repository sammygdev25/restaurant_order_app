from rest_framework import serializers
from api.models import Order, OrderItem, Dish, Cart, CartItem


class DishMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dish
        fields = ['id', 'name', 'price', 'image', 'is_available']
    image = serializers.SerializerMethodField()
    def get_image(self, obj):
        val = getattr(obj, 'image', None)
        if not val:
            return None
        val_str = str(val)
        if val_str.startswith(('http', 'data:', '/')):
            return val_str
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(val.url)
        return val.url


class OrderItemSerializer(serializers.ModelSerializer):
    dish_name = serializers.CharField(source='dish.name', read_only=True)
    dish_image = serializers.ImageField(source='dish.image', read_only=True)

    class Meta:
        model = OrderItem
        fields = [
            'id', 'order', 'dish', 'dish_name', 'dish_image',
            'quantity', 'price', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'dish_name', 'dish_image']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True, required=False, default=list)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'username', 'order_type', 'status',
            'delivery_address', 'phone', 'subtotal', 'delivery_fee',
            'total_amount', 'stripe_payment_intent_id', 'items',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'user', 'username', 'subtotal', 'delivery_fee',
            'total_amount', 'stripe_payment_intent_id', 'items',
            'created_at', 'updated_at'
        ]

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user if request else None

        try:
            cart = Cart.objects.get(user=user)
        except Cart.DoesNotExist:
            raise serializers.ValidationError('Your cart is empty.')

        cart_items = CartItem.objects.filter(cart=cart).select_related('dish')
        if not cart_items.exists():
            raise serializers.ValidationError('Your cart is empty.')

        subtotal = sum(item.dish.price * item.quantity for item in cart_items)
        order_type = validated_data.get('order_type', 'pickup')
        delivery_fee = 4.99 if order_type == 'delivery' else 0

        order = Order.objects.create(
            user=user,
            order_type=order_type,
            delivery_address=validated_data.get('delivery_address', ''),
            phone=validated_data.get('phone', ''),
            subtotal=subtotal,
            delivery_fee=delivery_fee,
            total_amount=subtotal + delivery_fee,
            status='pending',
        )

        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                dish=item.dish,
                quantity=item.quantity,
                price=item.dish.price,
            )

        cart_items.delete()
        return order

