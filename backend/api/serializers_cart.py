from rest_framework import serializers
from api.models import Cart, CartItem, Dish


class DishSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dish
        fields = [
            'id', 'name', 'description', 'price', 'category',
            'image', 'is_available', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
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


class CartItemSerializer(serializers.ModelSerializer):
    dish_detail = DishSerializer(source='dish', read_only=True)
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = [
            'id', 'cart', 'dish', 'dish_detail', 'quantity',
            'subtotal', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'cart', 'created_at', 'updated_at']

    def get_subtotal(self, obj):
        return str(obj.dish.price * obj.quantity)


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True, required=False, default=list)
    item_count = serializers.SerializerMethodField()
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = [
            'id', 'user', 'items', 'item_count', 'subtotal',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

    def get_item_count(self, obj):
        return sum(item.quantity for item in obj.items.all())

    def get_subtotal(self, obj):
        total = sum(item.dish.price * item.quantity for item in obj.items.all())
        return str(total)

