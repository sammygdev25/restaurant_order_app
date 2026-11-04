from django.db.models import Sum, Count, Q
from django.utils import timezone
from datetime import timedelta
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response

from api.models import Order, Reservation, Dish, Category
from api.serializers_admin import AdminStatsSerializer, AdminOrderSerializer, AdminReservationSerializer


class AdminStatsView(APIView):
    """
    Staff-only dashboard statistics endpoint.
    Returns aggregate counts and revenue figures for orders, reservations
    and menu items, plus the most recent orders and reservations.
    """
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        now = timezone.now()
        today = now.date()
        last_7_days = today - timedelta(days=7)
        last_30_days = today - timedelta(days=30)

        orders_qs = Order.objects.all()
        reservations_qs = Reservation.objects.all()
        dishes_qs = Dish.objects.all()

        total_orders = orders_qs.count()
        pending_orders = orders_qs.filter(
            status__in=['pending', 'paid', 'preparing', 'ready', 'out_for_delivery']
        ).count()
        completed_orders = orders_qs.filter(status='completed').count()
        cancelled_orders = orders_qs.filter(status='cancelled').count()

        total_revenue = orders_qs.filter(
            status__in=['paid', 'preparing', 'ready', 'out_for_delivery', 'completed']
        ).aggregate(total=Sum('total_amount'))['total'] or 0

        revenue_last_7_days = orders_qs.filter(
            status__in=['paid', 'preparing', 'ready', 'out_for_delivery', 'completed'],
            created_at__date__gte=last_7_days
        ).aggregate(total=Sum('total_amount'))['total'] or 0

        revenue_last_30_days = orders_qs.filter(
            status__in=['paid', 'preparing', 'ready', 'out_for_delivery', 'completed'],
            created_at__date__gte=last_30_days
        ).aggregate(total=Sum('total_amount'))['total'] or 0

        orders_today = orders_qs.filter(created_at__date=today).count()

        total_reservations = reservations_qs.count()
        pending_reservations = reservations_qs.filter(status='pending').count()
        confirmed_reservations = reservations_qs.filter(status='confirmed').count()
        reservations_today = reservations_qs.filter(date=today).count()
        upcoming_reservations = reservations_qs.filter(
            date__gte=today, status__in=['pending', 'confirmed']
        ).count()

        total_dishes = dishes_qs.count()
        available_dishes = dishes_qs.filter(is_available=True).count()
        unavailable_dishes = dishes_qs.filter(is_available=False).count()
        total_categories = Category.objects.count()

        status_breakdown = list(
            orders_qs.values('status').annotate(count=Count('id')).order_by('status')
        )

        recent_orders = orders_qs.order_by('-created_at')[:10]
        recent_reservations = reservations_qs.order_by('-created_at')[:10]

        data = {
            'total_orders': total_orders,
            'pending_orders': pending_orders,
            'completed_orders': completed_orders,
            'cancelled_orders': cancelled_orders,
            'orders_today': orders_today,
            'total_revenue': total_revenue,
            'revenue_last_7_days': revenue_last_7_days,
            'revenue_last_30_days': revenue_last_30_days,
            'total_reservations': total_reservations,
            'pending_reservations': pending_reservations,
            'confirmed_reservations': confirmed_reservations,
            'reservations_today': reservations_today,
            'upcoming_reservations': upcoming_reservations,
            'total_dishes': total_dishes,
            'available_dishes': available_dishes,
            'unavailable_dishes': unavailable_dishes,
            'total_categories': total_categories,
            'order_status_breakdown': status_breakdown,
            'recent_orders': AdminOrderSerializer(recent_orders, many=True).data,
            'recent_reservations': AdminReservationSerializer(recent_reservations, many=True).data,
        }

        return Response(data)