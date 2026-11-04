from django.contrib.auth.models import User
from rest_framework import serializers
from api.models import Category, Dish, Order, OrderItem, Reservation
from django.contrib.auth import get_user_model

User = get_user_model()



class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'created_at', 'updated_at']


class DishSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Dish
        fields = [
            'id', 'name', 'description', 'price', 'category', 'category_name',
            'image', 'is_available', 'created_at', 'updated_at',
        ]
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


class AdminUserBriefSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class AdminOrderItemSerializer(serializers.ModelSerializer):
    dish_name = serializers.CharField(source='dish.name', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'order', 'dish', 'dish_name', 'quantity', 'price', 'created_at', 'updated_at']


class AdminOrderSerializer(serializers.ModelSerializer):
    user = AdminUserBriefSerializer(read_only=True)
    items = AdminOrderItemSerializer(many=True, read_only=True, source='items', required=False, default=list)

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'order_type', 'status', 'delivery_address', 'phone',
            'subtotal', 'delivery_fee', 'total_amount', 'stripe_payment_intent_id',
            'items', 'created_at', 'updated_at',
        ]


class AdminReservationSerializer(serializers.ModelSerializer):
    user = AdminUserBriefSerializer(read_only=True)

    class Meta:
        model = Reservation
        fields = [
            'id', 'user', 'date', 'time', 'party_size', 'status', 'notes',
            'created_at', 'updated_at',
        ]


class AdminStatsSerializer(serializers.Serializer):
    total_orders = serializers.IntegerField(required=False, default=0)
    pending_orders = serializers.IntegerField(required=False, default=0)
    preparing_orders = serializers.IntegerField(required=False, default=0)
    completed_orders = serializers.IntegerField(required=False, default=0)
    total_revenue = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, default=0)
    today_revenue = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, default=0)
    total_reservations = serializers.IntegerField(required=False, default=0)
    pending_reservations = serializers.IntegerField(required=False, default=0)
    todays_reservations = serializers.IntegerField(required=False, default=0)
    total_dishes = serializers.IntegerField(required=False, default=0)
    available_dishes = serializers.IntegerField(required=False, default=0)
    total_categories = serializers.IntegerField(required=False, default=0)
    recent_orders = AdminOrderSerializer(many=True, required=False, default=list)
    recent_reservations = AdminReservationSerializer(many=True)

