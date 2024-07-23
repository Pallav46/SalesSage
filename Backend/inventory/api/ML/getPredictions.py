from SalesPredictModel import SalesPredictionModel
import pandas as pd
import threading

class GetPredictions:
    def __init__(self, data: pd.DataFrame, tier:int=1) -> None:
        self.data = data.copy()
        self.products = []
        self.period = {'D': 30, 'W': 4, 'M': 1,}
        self.all_prod_predictions = []
        self.numPred = None
        
        if tier == 1:
            self.numPred = 15
        elif tier == 2:
            self.numPred = 30
        elif tier == 3:
            self.numPred = 45

        
    def get_products(self):
        products = self.data['product'].unique()
        return products.tolist()
    
    def _train_model_for_product(self, prod, result_dict):
        prod_predictions = {'product': prod, 'predictions': {}}
        
        for per, lb in self.period.items():
            model = SalesPredictionModel(self.data, lookback=lb, product_name=prod, period=per)
            model.run(num_pred=self.numPred)
            future_dict = model.future_predictions_to_dict()
            
            if per == 'D':
                prod_predictions['predictions']['daily'] = future_dict
            elif per == 'W':
                prod_predictions['predictions']['weekly'] = future_dict
            elif per == 'M':
                prod_predictions['predictions']['monthly'] = future_dict
        
        result_dict[prod] = prod_predictions
    
    def predictions(self, num_pred:int=5):
        self.products = self.get_products()
        
        threads = []
        results = {}
        
        for prod in self.products:
            result_dict = {}
            thread = threading.Thread(target=self._train_model_for_product, args=(prod, result_dict))
            thread.start()
            threads.append((thread, result_dict))
        
        for thread, result_dict in threads:
            thread.join()
            self.all_prod_predictions.append(result_dict.popitem()[1])
        
        return self.all_prod_predictions
