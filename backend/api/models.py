"""
Models for restaurant_order_app — auto-generated from ProjectContract.
DO NOT EDIT — regenerate from contract if changes needed.
"""
from django.db import models
from django.contrib.auth.models import User
from django.conf import settings


class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return str(self.name)


class Dish(models.Model):
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True, default='')
    price = models.DecimalField(max_digits=6, decimal_places=2)
    category = models.ForeignKey(to='Category', on_delete=models.CASCADE, related_name='dishes')
    image = models.ImageField(upload_to='dishes/', blank=True, null=True)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return str(self.name)


class Cart(models.Model):
    user = models.OneToOneField(to=settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='cart')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return str(self.user)


class CartItem(models.Model):
    cart = models.ForeignKey(to='Cart', on_delete=models.CASCADE, related_name='items')
    dish = models.ForeignKey(to='Dish', on_delete=models.CASCADE, related_name='cart_items')
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return str(self.cart)


class Order(models.Model):
    user = models.ForeignKey(to=settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders')
    order_type = models.CharField(max_length=20, choices=[['pickup', 'Pickup'], ['delivery', 'Delivery']], default='pickup')
    status = models.CharField(max_length=20, choices=[['pending', 'Pending'], ['paid', 'Paid'], ['preparing', 'Preparing'], ['ready', 'Ready'], ['out_for_delivery', 'Out for Delivery'], ['completed', 'Completed'], ['cancelled', 'Cancelled']], default='pending')
    delivery_address = models.CharField(max_length=255, blank=True, default='')
    phone = models.CharField(max_length=20, blank=True, default='')
    subtotal = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    delivery_fee = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    stripe_payment_intent_id = models.CharField(max_length=255, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return str(self.user)


class OrderItem(models.Model):
    order = models.ForeignKey(to='Order', on_delete=models.CASCADE, related_name='items')
    dish = models.ForeignKey(to='Dish', on_delete=models.CASCADE, related_name='order_items')
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return str(self.order)


class Reservation(models.Model):
    user = models.ForeignKey(to=settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reservations')
    date = models.DateField()
    time = models.TimeField()
    party_size = models.PositiveIntegerField(default=2)
    status = models.CharField(max_length=20, choices=[['pending', 'Pending'], ['confirmed', 'Confirmed'], ['cancelled', 'Cancelled'], ['completed', 'Completed']], default='pending')
    notes = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['date', 'time']

    def __str__(self):
        return str(self.user)

