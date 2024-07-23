import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ModelTrainingConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.company_id = self.scope['url_route']['kwargs']['company_id']
        self.group_name = f'training_status_{self.company_id}'

        # Join room group
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        pass

    # Receive message from room group
    async def training_status(self, event):
        status = event['status']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': status
        }))
