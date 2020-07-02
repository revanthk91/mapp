import React, {useState, useEffect} from 'react';
import { StyleSheet,Text, View } from 'react-native';
import {Caption, Title, Divider, TouchableRipple, Appbar,ActivityIndicator, Surface, Avatar } from 'react-native-paper';

//redux
import {useSelector, useDispatch} from 'react-redux';
import {loadUsers,setLoad, selectUser} from './actions'

//nav
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function Home({ navigation }) {
	//redux vars
	const dispatch = useDispatch()
	const isLoading = useSelector(state => state.loading)
	const allUsers = useSelector(state => state.profiles)


	

	//thump
	useEffect(() =>{
		dispatch(setLoad(true))

		fetch('https://cell91.xyz/api/m99/users')
		.then(body => body.json())
		.then(res => {
			dispatch(setLoad(false))
			dispatch(loadUsers(res.status))
		})

	},[])
	

	return(
		<View>
			<Appbar.Header>
				<Appbar.Content title="M 99" />
				<Appbar.Action icon = 'dots-vertical' />
			</Appbar.Header>
			
			<View style={all.page}>
				<Title>Select your profile </Title>
			
				<View>
					{allUsers.map((x,i) => <Profile nav={navigation} data={x} key={i} />)}
				</View>
				<ActivityIndicator size={64} hidesWhenStopped={true} animating={isLoading}/>
			</View>
		</View>
	)
}


function Profile(props) {
	let dispatch = useDispatch()

	function movePage() {
		dispatch(selectUser(props.data))
		props.nav.navigate('UserPage')
	}

	if (props.data.username == 'mApp') {
		props.data.username = 'Guest'
	}

	return (
		<TouchableRipple onPress={movePage}>
		<View>	
				<View style={all.box}>
					<Avatar.Text size={64} label={props.data.username.slice(0,2).toUpperCase()} />
					<Br />
					<Text style={{fontSize: 20,color: 'grey'}}>{props.data.username}</Text>
				</View>
				<Divider />
		</View>
		</TouchableRipple>
	)
} 

function Br() {

	return(
		<View style={{margin:10}} />
	)
}

const all = StyleSheet.create({
		page: {
			padding: 24,
			height: '100%',
		},

		box: {
			flexDirection: 'row',
			alignItems: 'center',
			marginVertical: 16,
		},

		br: {
			margin: 10,
		}
	})


export default Home