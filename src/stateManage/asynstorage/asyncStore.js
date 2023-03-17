import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeAuthToken = async (value) => {
    try {
        console.log('storeAuthToken #####')
    //   await AsyncStorage.setItem('auth_token', value);
    } catch (e) {
      // saving error
    }
  }

  export const removeAuthToken = async () => {
    try {
        console.log('Value', value)
      await AsyncStorage.removeItem('auth_token')
    } catch (e) {
      // saving error
    }
  }
  export const getAuthToken = async () => {
    try {
        const value = await AsyncStorage.getItem('auth_token')
        if(value){
            console.log('VALUE INSDIE getAuthToken',value)
            return value;
        }else {
            return null;
        }
    } catch(e) {
      // error reading value
    }
  }