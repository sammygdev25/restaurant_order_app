from rest_framework import serializers
from api.models import Reservation


class ReservationSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Reservation
        fields = [
            'id', 'user', 'user_username', 'date', 'time', 'party_size',
            'status', 'notes', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'user', 'user_username', 'status', 'created_at', 'updated_at']

