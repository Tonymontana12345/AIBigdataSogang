import pandas as pd
import json

# 1. risk_classification_results.csv 파일 읽기
risk_data = pd.read_csv('./data/risk_classification_results.csv', encoding='utf-8')

# 2. big_data_set1_f.csv 파일 읽기
big_data = pd.read_csv('./data/big_data_set1_f.csv', encoding='cp949')

# 3. ENCODED_MCT를 통해 MCT_NM 매핑
# big_data에서 ENCODED_MCT와 MCT_NM만 선택하여 딕셔너리 생성
mct_mapping = big_data[['ENCODED_MCT', 'MCT_NM']].drop_duplicates().set_index('ENCODED_MCT')['MCT_NM'].to_dict()

# risk_data에 MCT_NM 컬럼 추가
risk_data['MCT_NM'] = risk_data['ENCODED_MCT'].map(mct_mapping)

risk_data.to_csv('./data/risk_classification_results_merge.csv', index=False, encoding='utf-8-sig')
print("risk_classification_results_merge.csv 파일이 생성되었습니다.")

# 4. ENCODED_MCT가 'D402962627'인 행의 데이터 추출
target_row = risk_data[risk_data['ENCODED_MCT'] == 'D402962627']

if not target_row.empty:
    # 첫 번째 매칭된 행의 데이터 가져오기
    mct_nm = target_row['MCT_NM'].values[0]
    risk_score = int(target_row['risk_score'].values[0])
    risk_level = target_row['risk_level'].values[0]
    risk_type = target_row['risk_type'].values[0]
    priority = target_row['priority'].values[0]
    
    # 5. 변수들을 딕셔너리로 구성하여 JSON 파일로 저장
    my_store_data = {
        'MCT_NM': mct_nm,
        'risk_score': risk_score,
        'risk_level': risk_level,
        'risk_type': risk_type,
        'priority': priority
    }
    
    # 6. high_risk_factors.json 파일 읽기
    with open('./data/high_risk_factors.json', 'r', encoding='utf-8') as f:
        high_risk_data = json.load(f)
    
    # 7. merchant_id가 'D402962627'인 것을 검색하여 모든 risk_factors 값들을 불러온다
    target_merchant = None
    for merchant in high_risk_data:
        if merchant['merchant_id'] == 'D402962627':
            target_merchant = merchant
            break
    
    if target_merchant:
        # 8. risk_factor의 값들 중에서 shap_value가 가장 높은 순대로 정렬
        sorted_risk_factors = sorted(
            target_merchant['risk_factors'], 
            key=lambda x: x['shap_value'], 
            reverse=True
        )
        
        # 9. 정렬된 risk_factors들을 저장
        my_store_data['closure_probability'] = target_merchant['closure_probability']
        my_store_data['risk_factors'] = sorted_risk_factors
        
        # ===== 추가 부분 시작 =====
        
        # 10. big_data_set2_f.csv 파일 읽기
        print("\nbig_data_set2_f.csv 파일을 읽는 중...")
        df2_full = pd.read_csv('./data/big_data_set2_f.csv', encoding='cp949')
        
        # 11. ENCODED_MCT가 'D402962627'인 행 추출
        df2 = df2_full[df2_full['ENCODED_MCT'] == 'D402962627'].copy()
        print(f"df2 추출된 행 수: {len(df2)}")
        
        # 12. big_data_set3_f.csv 파일 읽기
        print("big_data_set3_f.csv 파일을 읽는 중...")
        df3_full = pd.read_csv('./data/big_data_set3_f.csv', encoding='cp949')
        
        # 13. ENCODED_MCT가 'D402962627'인 행 추출
        df3 = df3_full[df3_full['ENCODED_MCT'] == 'D402962627'].copy()
        print(f"df3 추출된 행 수: {len(df3)}")
        
        # 14. df2와 df3를 TA_YM 기준으로 병합
        df_merged = pd.merge(df2, df3, on=['ENCODED_MCT', 'TA_YM'], how='outer')
        
        # 15. TA_YM 시간순으로 정렬
        df_merged = df_merged.sort_values('TA_YM').reset_index(drop=True)
        print(f"병합된 행 수: {len(df_merged)}")
        print(f"TA_YM 범위: {df_merged['TA_YM'].min()} ~ {df_merged['TA_YM'].max()}")
        
        # 16. info 카테고리 추가 (시간순 데이터를 리스트로 변환, ENCODED_MCT 제외)
        info_list = []
        for _, row in df_merged.iterrows():
            # NaN 값을 None으로 변환하고 딕셔너리로 변환
            row_dict = row.to_dict()
            
            # ENCODED_MCT 제거
            if 'ENCODED_MCT' in row_dict:
                del row_dict['ENCODED_MCT']
            
            # NaN 값을 None으로 변환
            for key, value in row_dict.items():
                if pd.isna(value):
                    row_dict[key] = None
                # 정수형으로 변환 가능한 경우 변환
                elif isinstance(value, float) and value.is_integer():
                    row_dict[key] = int(value)
            
            info_list.append(row_dict)
        
        my_store_data['info'] = info_list
        
        # ===== 추가 부분 끝 =====
        
        # 17. My_Store.json에 저장
        with open('./data/My_Store.json', 'w', encoding='utf-8') as json_file:
            json.dump(my_store_data, json_file, ensure_ascii=False, indent=4)
        
        print("\n✅ My_Store.json 파일이 생성되었습니다.")
        print(f"- info 카테고리에 {len(info_list)}개의 시계열 데이터가 추가되었습니다.")
        print(f"\n저장된 데이터 구조:")
        print(f"  - MCT_NM: {my_store_data['MCT_NM']}")
        print(f"  - risk_score: {my_store_data['risk_score']}")
        print(f"  - risk_level: {my_store_data['risk_level']}")
        print(f"  - risk_type: {my_store_data['risk_type']}")
        print(f"  - priority: {my_store_data['priority']}")
        print(f"  - closure_probability: {my_store_data['closure_probability']}")
        print(f"  - risk_factors: {len(my_store_data['risk_factors'])}개")
        print(f"  - info: {len(my_store_data['info'])}개 (시계열 데이터)")
    else:
        print("high_risk_factors.json에서 해당 merchant를 찾을 수 없습니다.")
else:
    print("ENCODED_MCT가 'D402962627'인 데이터를 찾을 수 없습니다.")


# import pandas as pd
# import json

# # 1. risk_classification_results.csv 파일 읽기
# risk_data = pd.read_csv('./data/risk_classification_results.csv', encoding='utf-8')

# # 2. big_data_set1_f.csv 파일 읽기
# big_data = pd.read_csv('./data/big_data_set1_f.csv', encoding='cp949')

# # 3. ENCODED_MCT를 통해 MCT_NM 매핑
# # big_data에서 ENCODED_MCT와 MCT_NM만 선택하여 딕셔너리 생성
# mct_mapping = big_data[['ENCODED_MCT', 'MCT_NM']].drop_duplicates().set_index('ENCODED_MCT')['MCT_NM'].to_dict()

# # risk_data에 MCT_NM 컬럼 추가
# risk_data['MCT_NM'] = risk_data['ENCODED_MCT'].map(mct_mapping)

# risk_data.to_csv('./data/risk_classification_results_merge.csv', index=False, encoding='utf-8-sig')
# print("risk_classification_results_merge.csv 파일이 생성되었습니다.")


# # 4. ENCODED_MCT가 '1A9644F28E'인 행의 데이터 추출
# target_row = risk_data[risk_data['ENCODED_MCT'] == '1A9644F28E']

# if not target_row.empty:
#     # 첫 번째 매칭된 행의 데이터 가져오기
#     mct_nm = target_row['MCT_NM'].values[0]
#     risk_score = int(target_row['risk_score'].values[0])
#     risk_level = target_row['risk_level'].values[0]
#     risk_type = target_row['risk_type'].values[0]
#     priority = target_row['priority'].values[0]
    
#     # 5. 변수들을 딕셔너리로 구성하여 JSON 파일로 저장
#     my_store_data = {
#         'MCT_NM': mct_nm,
#         'risk_score': risk_score,
#         'risk_level': risk_level,
#         'risk_type': risk_type,
#         'priority': priority
#     }
    
#     # 6. high_risk_factors.json 파일 읽기
#     with open('./data/high_risk_factors.json', 'r', encoding='utf-8') as f:
#         high_risk_data = json.load(f)
    
#     # 7. merchant_id가 '1A9644F28E'인 것을 검색하여 모든 risk_factors 값들을 불러온다
#     target_merchant = None
#     for merchant in high_risk_data:
#         if merchant['merchant_id'] == '1A9644F28E':
#             target_merchant = merchant
#             break
    
#     if target_merchant:
#         # 8. risk_factor의 값들 중에서 shap_value가 가장 높은 순대로 정렬
#         sorted_risk_factors = sorted(
#             target_merchant['risk_factors'], 
#             key=lambda x: x['shap_value'], 
#             reverse=True
#         )
        
#         # 9. 정렬된 risk_factors들을 저장
#         my_store_data['closure_probability'] = target_merchant['closure_probability']
#         my_store_data['risk_factors'] = sorted_risk_factors
    
#     with open('./data/My_Store.json', 'w', encoding='utf-8') as json_file:
#         json.dump(my_store_data, json_file, ensure_ascii=False, indent=4)
    
#     print("My_Store.json 파일이 생성되었습니다.")
#     print(f"\n저장된 데이터:")
#     print(json.dumps(my_store_data, ensure_ascii=False, indent=4))
# else:
#     print("ENCODED_MCT가 '1A9644F28E'인 데이터를 찾을 수 없습니다.")


