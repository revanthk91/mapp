import React, {useEffect, useState} from 'react';
import { Dimensions, StyleSheet, ToastAndroid, FlatList, Image, Vibration, ScrollView, Text, View } from 'react-native';

import {Appbar, FAB, Modal, Portal, Surface, TouchableRipple, Menu, Searchbar, ActivityIndicator, Card, Divider} from 'react-native-paper'

//redux
import {useSelector, useDispatch} from 'react-redux';
import {setLoad, loadData} from './actions'

import { throttle, debounce } from  'throttle-debounce'
import Icon from 'react-native-vector-icons/FontAwesome5';

//main vars
const omdbKey = '5fb249fa'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

function User() {
	const id = useSelector(state => state.mainId)
	const isLoading = useSelector(state => state.loading)
	const userData = useSelector(state => state.currentList)
	const result = useSelector(state => state.search)
	const search = React.createRef()
	const dispatch = useDispatch()

	useEffect(() => {
		dispatch(setLoad(true))

		//getting single user data
		fetch('https://cell91.xyz/api/m99/userdata',{
			method: 'POST',

			headers: {
    			'Content-Type': 'application/json',
  			},

			body: JSON.stringify({
				id: id
			})
		})

		.then(body => body.json())
		.then(res => {
			dispatch(loadData(res.status))
			dispatch(setLoad(false))
		})
	},[])

	//search handle (any forms/pure guis will use reat native hooks)
	const [searchText,setSearch] = useState('')
	const [modal,setModal] = useState(false)

	function handleSearch() {
		//check
		if (searchText == '') {
			return
		}

		setModal(true)

		let url = `http://www.omdbapi.com/?s=${encodeURI(searchText)}&apikey=${omdbKey}`
		console.log(url)
		fetch(url)
		.then(body => body.json())
		.then(res => {
			if (res.Response == 'True') {
				dispatch({type:'SEARCH',data:res.Search.slice(0,5)})
			}
			else {
				dispatch({type:'CLEARSEARCH'})
				setModal(false)
			}
		})
		.catch(e => {
			setModal(false)
			dispatch({type:'CLEARSEARCH'})
			ToastAndroid.show(e,ToastAndroid.SHORT,ToastAndroid.BOTTOM)
		})
	}

	function addMovie(imdb) {
		setModal(false)
		dispatch(setLoad(true))

		fetch(`http://www.omdbapi.com/?apikey=${omdbKey}&i=${imdb}`)
		.then(body => body.json())
		.then(res => {
			res.open = false
			dispatch({type:'ADDMOVIE',data: res})
			dispatch(setLoad(false))
		})
		.catch(e => {
			//snakbar
			dispatch(setLoad(false))
			ToastAndroid.show(e,ToastAndroid.SHORT,ToastAndroid.BOTTOM)
		})

		dispatch({type:'CLEARSEARCH'})
		setSearch('')
		search.current.blur()

	}	

	//save to cloud
	function saveCloud(){
		fetch('https://cell91.xyz/api/m99/update',{
			method: 'POST',

			headers: {
    			'Content-Type': 'application/json',
  			},

			body: JSON.stringify({
				id: id,
				movies: userData.data
			})
		})
		.then(b => b.json())
		.then(res => ToastAndroid.show('saved to cloud!',ToastAndroid.SHORT,ToastAndroid.BOTTOM))
		.catch(e => ToastAndroid.show(e,ToastAndroid.SHORT,ToastAndroid.BOTTOM) )
	}




	return (
		<View style={{flex:1}}>
			<Appbar.Header>
				<Appbar.Content title={userData.name ? `${userData.name}'s Watchlist` : "loading profile..."  } />
				<Appbar.Action icon = 'dots-vertical' />
			</Appbar.Header>

			<View style={all.page}>

				<Searchbar onSubmitEditing={handleSearch} ref={search} value={searchText} onChangeText={(t)=>setSearch(t)} placeholder='search movies' />
				<ActivityIndicator size={64}  hidesWhenStopped={true} animating={isLoading}/>
				
				{/*MOVIES*/}


				<ScrollView style={all.scroll}>
					<View style={{margin: 8}}>
						{userData.data.map((x,i) => <MovieBox data={x} key={i} id={i} />)}
					</View>
				</ScrollView>

				{/*Search*/}
				<Portal>
					<Modal visible={modal} onDismiss={() => {
						dispatch({type:'CLEARSEARCH'})
						setModal(false)
					}} >
						<Surface style={all.modal}>
							{result.map((x,i) => <ResultItem addMovie={addMovie} data={x} key={i}/>)}
							

						</Surface>
					</Modal>
				</Portal>

				{/*Fab*/}
				<FAB icon='content-save' onPress={saveCloud} style={{width: '16%',left:'80%',backgroundColor:'#900000'}}/>

			</View>

		</View>
	)
}
 
//------------------

function ResultItem(props) {
	return (

		<TouchableRipple onPress={() => props.addMovie(props.data.imdbID)}>
			<View>
				<Text style={{fontSize:20}}>{props.data.Title}</Text>
				<Text style={{color:'#aaa'}}>{props.data.Year}</Text>
				<Divider />	
			</View>
		</TouchableRipple>

	)
}

function MovieBox(props) {
	const dispatch = useDispatch()

	function deleteMovie() {
		Vibration.vibrate(20)
		dispatch({type:'DELETEMOVIE',data:props.id})
	}

	return(
		<TouchableRipple onLongPress={deleteMovie} onPress={() => dispatch({type:'TOGGLEMOVIE',data:props.id})}>
		<Surface style={all.box} >
			<View style={{flexDirection: 'row',alignItems: 'center'}}>
				<Image style={{width: 100, height: 140}} source={{uri:props.data.Poster}}/>
				<Br />
				<View style={{width: '60%'}}>
					<Text style={{fontSize: 20}}>{props.data.Title}</Text>
					<Text style={{color:'#aaa'}}>
						<Text>{props.data.Year} | </Text>
						<Text>{props.data.Genre} | </Text>
						<Text>{props.data.Runtime}</Text>
					</Text>
				{/*RATINGs*/}
					<Text>
						{props.data.Ratings.map((x,i)=> {
							let score = ['I','R','M']
							let color = ['#f39c12','#e74c3c','#27ae60']
							return <Text style={{fontSize: 12,color: '#aaa'}}><Text style={{fontWeight: 'bold',color:color[i]}}>{score[i]} </Text><Text>{x.Value}  </Text></Text>
						})}
					</Text>
				</View>
			</View>

			<View style={{padding: 10, color: '#aaa', display: props.data.open ? 'flex':'none'}}>
				<Text>
					<Icon name='camera' /><Text> {props.data.Director}</Text>
				</Text><Br/>
				<Text>
					<Icon name='users' /><Text> {props.data.Actors}</Text>
				</Text><Br/>
				<Text>
					<Icon name='file-alt' /><Text>  {props.data.Plot}</Text>
				</Text><Br/>
				<Text>
					<Icon name='award' /><Text> {props.data.Awards}</Text>
				</Text><Br/>
			</View>

		</Surface>
		</TouchableRipple>
	)
}

function Br() {

	return(
		<View style={{margin:10}} />
	)
}




export default User

const all = StyleSheet.create({
	page: {
		padding: 24,
		flex: 1,
	},
	modal: {
		padding: 16,
	},
	box: {
		elevation: 4,
		padding: 10,
		width: '100%',
		marginVertical: 8,
	},
	scroll: {
		flex: 1,
	}
})


