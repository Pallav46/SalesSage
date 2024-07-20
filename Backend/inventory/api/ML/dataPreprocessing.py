import pandas as pd
from sklearn.preprocessing import LabelEncoder, StandardScaler #type: ignore
import warnings
warnings.filterwarnings('ignore')

class DataPreprocessing:
    def handle_missing_values(self, data: pd.DataFrame, threshold: int = 10):
        numeric_list = ['int16', 'int32', 'int64', 'float16', 'float32', 'float64']
        for col in data.columns:
            if data[col].dtype == 'object' and data[col].nunique() <= threshold:
                mode_value = data[col].mode()[0]
                data[col] = data[col].fillna(mode_value)
            elif data[col].dtype in numeric_list:
                median_value = data[col].median()
                data[col] = data[col].fillna(median_value)
                
        return data
    
    def find_datetime_column(self, df: pd.DataFrame) -> str:
        data = df 
        for column in data.select_dtypes(include=['object']):
            try:
                data[column] = pd.to_datetime(data[column])
                if pd.api.types.is_datetime64_any_dtype(data[column]):
                    return column
            except ValueError:
                continue
            
        datetime_types = ["datetime64[ns]", "datetime64", "datetime", "datetimetz"]
        datetime_columns = df.select_dtypes(include=datetime_types).columns
        
        if len(datetime_columns) > 0:
            return datetime_columns[0]
    
        return None

    def dropni_features(self, data: pd.DataFrame, correlation_threshold=0.8, category_threshold: int=50):
        cols_to_drop = []
        datetime_col = self.find_datetime_column(data)
        
        object_columns = data.select_dtypes(include=['object']).columns
        for col in object_columns:
            if col is datetime_col:
                continue
            elif data[col].nunique() > category_threshold:
                cols_to_drop.append(col)
            
        col_corr = set()
        numeric_data = data.select_dtypes(include=['number'])
        corr_matrix = numeric_data.corr()
        for i in range(len(corr_matrix.columns)):
            for j in range(i):
                if abs(corr_matrix.iloc[i, j]) > correlation_threshold:
                    colname = corr_matrix.columns[i]
                    col_corr.add(colname)
                    
        
        cols_to_drop.extend(list(col_corr))
        if 'sales' or 'Sales' in cols_to_drop:
            cols_to_drop.remove('sales')
            
        data.drop(cols_to_drop, axis=1, inplace=True)
        
        return data
        
    def encoding_features(self, data: pd.DataFrame, encoding_threshold: int = 2):
        label_encoder = LabelEncoder()
        object_columns = data.select_dtypes(include=['object']).columns
        for col in object_columns:
            if data[col].nunique() <= encoding_threshold:
                data[col] = data[col].astype('category')
                data[col] = label_encoder.fit_transform(data[col])
                
        return data
    
    def normalize_features(self, data: pd.DataFrame):
        # Use Standard Scaler
        numeric_columns = data.select_dtypes(include=['number']).columns
        scaler = StandardScaler()
        data[numeric_columns] = scaler.fit_transform(data[numeric_columns])
        
        return data
        
    def lowercase_columns(self, data: pd.DataFrame):
        data.columns = [col.lower() for col in data.columns]
        
    def process_data(self, df: pd.DataFrame, normalize=False):
        data = df.copy()
        self.lowercase_columns(data)
        self.handle_missing_values(data)
        self.dropni_features(data)
        self.encoding_features(data)
        if normalize:
            self.normalize_features(data)
        return data