import {combineReducers} from 'redux'



const allUsers = (state = [], action) => {
	switch(action.type) {
		case "LOAD":
			var temp = action.data.filter(x => x.username == 'Revanth' || x.username == 'mApp')
			return temp;

		default:
			return state;

	}
}

//temp
let user = {
	name: null,
	data: [],
}

const movieList = (state = user, action) => {
	switch(action.type) {
		case 'LOADLIST':
			return {name: action.data.username, data: action.data.movies}

		case 'ADDMOVIE':{
			let temp = {...state}
			temp.data.push(action.data)
			return temp;
			}

		case 'DELETEMOVIE':
			let temp = {...state}
			temp.data.splice(action.data,1)
			return temp;

		case 'TOGGLEMOVIE': {
			let temp = {...state}
			temp.data[action.data].open = !temp.data[action.data].open
			return temp;
		}


		default:
			return state;

	}
}


const mainUser = (state = null, action) => {
	switch(action.type) {
		case 'FIX':
			return action.data._id

		default:
			return state;
	}
}

const loading = (state = false, action) => {
	switch(action.type) {
		case 'SET':  
			return action.data

		default:
			return state;

	}
}


const searchReducer = (state=[],action) => {
	switch(action.type) {
		case 'SEARCH':
			return action.data;

		case 'CLEARSEARCH':
			return []

		default:
			return state;
	}
}


const allReducers  = combineReducers({
	currentList: movieList,
	loading: loading,
	mainId: mainUser,
	profiles: allUsers,
	search: searchReducer,
})

export default allReducers