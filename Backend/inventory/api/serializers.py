from rest_framework import serializers

class ObjectIdField(serializers.Field):
    def to_representation(self, value):
        return str(value)

class SalesSerializer(serializers.Serializer):
    _id = ObjectIdField(read_only=True)
    date = serializers.DateTimeField()
    product_id = serializers.CharField()
    sales_quantity = serializers.IntegerField()
    price_per_unit = serializers.FloatField()
    cost_per_unit = serializers.FloatField()