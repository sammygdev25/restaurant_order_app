"""Stripe webhook handler with signature verification."""
import json
import logging

from django.conf import settings
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

logger = logging.getLogger(__name__)


@csrf_exempt
@require_POST
def stripe_webhook(request):
    """
    POST /api/webhooks/stripe/
    Verifies Stripe signature, dispatches to event handlers.
    """
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE', '')
    webhook_secret = getattr(settings, 'STRIPE_WEBHOOK_SECRET', '')

    if not webhook_secret:
        logger.warning("STRIPE_WEBHOOK_SECRET not configured")
        return JsonResponse({"error": "Webhook not configured"}, status=503)

    try:
        import stripe
        event = stripe.Webhook.construct_event(payload, sig_header, webhook_secret)
    except ValueError:
        logger.error("Stripe webhook: invalid payload")
        return JsonResponse({"error": "Invalid payload"}, status=400)
    except stripe.error.SignatureVerificationError:
        logger.error("Stripe webhook: invalid signature")
        return JsonResponse({"error": "Invalid signature"}, status=400)
    except ImportError:
        logger.error("stripe package not installed")
        return JsonResponse({"error": "stripe package missing"}, status=500)

    event_type = event.get("type", "")
    event_data = event.get("data", {}).get("object", {})
    logger.info(f"Stripe webhook received: {event_type}")

    handler = EVENT_HANDLERS.get(event_type, _handle_unknown)
    return handler(event_type, event_data)


def _handle_checkout_completed(event_type, data):
    session_id = data.get("id")
    customer_email = data.get("customer_email")
    logger.info(f"Checkout completed: {session_id} for {customer_email}")
    # TODO: Provision access, update user subscription status
    return JsonResponse({"status": "ok"})


def _handle_invoice_paid(event_type, data):
    subscription_id = data.get("subscription")
    logger.info(f"Invoice paid for subscription: {subscription_id}")
    # TODO: Extend subscription period
    return JsonResponse({"status": "ok"})


def _handle_invoice_failed(event_type, data):
    subscription_id = data.get("subscription")
    logger.info(f"Invoice payment failed for subscription: {subscription_id}")
    # TODO: Notify user, mark subscription as past_due
    return JsonResponse({"status": "ok"})


def _handle_subscription_updated(event_type, data):
    sub_id = data.get("id")
    status = data.get("status")
    logger.info(f"Subscription updated: {sub_id} -> {status}")
    # TODO: Update user plan tier
    return JsonResponse({"status": "ok"})


def _handle_subscription_deleted(event_type, data):
    sub_id = data.get("id")
    logger.info(f"Subscription deleted: {sub_id}")
    # TODO: Revoke access, downgrade to free tier
    return JsonResponse({"status": "ok"})


def _handle_unknown(event_type, data):
    logger.debug(f"Unhandled Stripe event: {event_type}")
    return JsonResponse({"status": "ok"})


EVENT_HANDLERS = {
    "checkout.session.completed": _handle_checkout_completed,
    "invoice.paid": _handle_invoice_paid,
    "invoice.payment_failed": _handle_invoice_failed,
    "customer.subscription.updated": _handle_subscription_updated,
    "customer.subscription.deleted": _handle_subscription_deleted,
}
