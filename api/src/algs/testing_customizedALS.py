import sys
import warnings
if not sys.warnoptions:
        warnings.simplefilter("ignore")
'''
    There will be NumbaDeprecationWarnings here, use the above code to hide the warnings
'''          
import pandas as pd
import pickle


if __name__ == '__main__':

    print('Test importing object')   
    f_import = open('model/implictMF.pkl', 'rb')
    trained_model = pickle.load(f_import)
    f_import.close()
    
    liveUserID = 'temp'
    # algo has this attribute: 
            # item_index_(pandas.Index): Items in the model (length=:math:`n`).
    items = trained_model.item_index_.to_numpy()
    # testing_path = 'testing_rating/rating_set.csv'
    # fullpath_test =  testing_path + liveUserID + '.csv'
    fullpath_test = 'test_ratings/ratings_set.csv'
    ratings_liveUser = pd.read_csv(fullpath_test, encoding='latin1')
    # print(ratings_liveUser)
        #['item', 'title', 'rating']
    new_ratings = pd.Series(ratings_liveUser.rating.to_numpy(), index = ratings_liveUser.item)
    new_preds, user_feature = trained_model.predict_for_user(liveUserID, items, new_ratings)
    # return a series & numpy.ndarray
    print(type(user_feature))
    print(user_feature)