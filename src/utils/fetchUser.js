const fetchUser=()=>{
    const user=localStorage.getItem('user')!==undefined ? JSON.parse(localStorage.getItem('user')):''
    return user
}

export default fetchUser;