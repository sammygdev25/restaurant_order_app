from rest_framework import viewsets, permissions
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from api.models import Reservation
from api.serializers_reservations import ReservationSerializer


class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all().order_by('date', 'time')
    serializer_class = ReservationSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filterset_fields = ['user', 'status', 'date']
    search_fields = ['notes']
    ordering_fields = ['date', 'time', 'created_at']

    def get_queryset(self):
        queryset = Reservation.objects.all().order_by('date', 'time')
        if self.request.user.is_authenticated and not self.request.user.is_staff:
            queryset = queryset.filter(user=self.request.user)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)