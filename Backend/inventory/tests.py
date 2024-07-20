from django.test import TestCase
from pymongo import MongoClient
# Create your tests here.
client = MongoClient("mongodb+srv://SalesSage:SalesSageProject@salessage.mhnpimo.mongodb.net/SalesSage?retryWrites=true&w=majority")
db = client["SalesSage"]
ish = db['ishaan_sales']

ish.delete_many({})