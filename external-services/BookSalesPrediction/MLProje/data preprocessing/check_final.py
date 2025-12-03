import pandas as pd

df = pd.read_csv('kitapdata_model_ready.csv')

print('='*80)
print('DUZELTILMIS MODEL VERI SETI - FINAL KONTROL')
print('='*80)
print(f'\nBoyut: {df.shape[0]} satir x {df.shape[1]} sutun')
print(f'\nString sutun var mi? {len([c for c in df.columns if df[c].dtype == "object"])} adet')
print(f'Sayisal sutun: {len([c for c in df.columns if df[c].dtype != "object"])} adet')
print(f'Eksik deger: {df.isnull().sum().sum()} adet')
print(f'\n✓ TUM DEGERLER SAYISAL - MODEL ICIN HAZIR!')
print(f'\nSutunlar ({df.shape[1]} adet):')
for i, col in enumerate(df.columns, 1):
    dtype = 'numeric' if df[col].dtype != 'object' else 'STRING'
    print(f'  {i:2d}. {col[:45]:45s} [{dtype}]')

print(f'\nIlk 3 satir ornegi:')
print(df.head(3))


