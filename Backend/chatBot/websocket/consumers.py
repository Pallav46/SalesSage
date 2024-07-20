import json
from channels.generic.websocket import AsyncWebsocketConsumer # type: ignore

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        response = self.get_llm_response(message)

        # Stream the response
        for chunk in self.chunk_response(response):
            await self.send(text_data=json.dumps({
                'message': chunk
            }))

    def get_llm_response(self, message):
        #Jaldi de-dena Ubaid
        if message.lower() == 'hello':
            return "Hello! I'm your AI assistant, ready to help with any questions or tasks you might have. I can provide information, offer advice, or engage in creative writing. My knowledge spans a wide range of topics, from science and technology to arts and culture. How can I assist you today?"
        else:
            return "Sorry as I already told you that I am in development phase so I can't help you right now. You shall wait till Ubaid Abbas completes me. Also one of the team member has to deposit the down payment for the iPhone 15"

    def chunk_response(self, response):
        # Split the response into words
        words = response.split()
        chunk_size = 5  # Number of words per chunk
        for i in range(0, len(words), chunk_size):
            yield ' '.join(words[i:i+chunk_size])