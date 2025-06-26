
from unittest import mock
import mongomock

with mock.patch('pymongo.MongoClient', new=lambda *args, **kwargs: mongomock.MongoClient()):
    import importlib
    mongo_mod = importlib.import_module('mongodb_connect')

def test_collections_exist():
    assert hasattr(mongo_mod, 'collection')
    assert hasattr(mongo_mod, 'search_alerts_collection')
    assert hasattr(mongo_mod, 'search_results_collection')
