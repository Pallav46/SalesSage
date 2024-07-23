"""
ASGI config for SalesSage project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter # type: ignore
from channels.auth import AuthMiddlewareStack # type: ignore
from chatBot.websocket import routing as chatBot_routing
from inventory.websocket import routing as training_routing

ws_patterns = chatBot_routing.websocket_urlpatterns + training_routing.websocket_urlpatterns

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'SalesSage.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            ws_patterns
        )
    ),
})