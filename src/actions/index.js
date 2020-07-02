//loading profiles

export const loadUsers = (all) => {
	return {
		type: 'LOAD',
		data: all,
	}
}

//select User

export const selectUser = (id) => {
	return {
		type: 'FIX',
		data: id
	}
}


//load movie data

export const loadData = (data) => {
	return {
		type: 'LOADLIST',
		data: data
	}
}

//loader

export const setLoad = bool => {
	return {
		type: 'SET',
		data: bool,
	}
}