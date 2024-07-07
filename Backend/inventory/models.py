from mongoengine import Document, DateField, StringField, IntField, FloatField

class Sales(Document):
    date = DateField(required=True)
    product_id = StringField(max_length=50, required=True)
    sales_quantity = IntField(required=True)
    price_per_unit = FloatField(required=True)
    cost_per_unit = FloatField(required=True)
