import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Subheading, FAB, Button, TouchableRipple, RadioButton, Appbar, TextInput, Surface, Checkbox } from 'react-native-paper';

//navigator
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

//stack
const Stack = createStackNavigator()

//pages

import Home from './Home'
import User from './User'

function Main() {
	return(


			<NavigationContainer initialRouteName='Home'>
				<Stack.Navigator headerMode='none'>
					<Stack.Screen name='Home' component={Home} />
					<Stack.Screen name='UserPage' component={User} />

				</Stack.Navigator>
			</NavigationContainer>
			

	)
}


export default Main