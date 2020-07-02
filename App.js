import React, {useState} from 'react';
import { DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import Main from './src/Main.js'

//redux
import {createStore} from 'redux'
import { Provider as StoreProvider} from 'react-redux'


import allReducers from './src/reducers'

const myStore = createStore(allReducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

//theme
const theme = {
  ...DefaultTheme,
  roundness: 10,
  colors: {
    ...DefaultTheme.colors,
    primary: '#900000',
    accent: '#181818',
  },
};


function App() {
  return (
  	<StoreProvider store= {myStore}>
	    <PaperProvider theme={theme}>
	      <Main/>
	    </PaperProvider>
	 </StoreProvider>
  )
}






export default App