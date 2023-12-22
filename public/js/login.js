login = () => {
    const token = document.getElementById("token").value
    post('/api/users/login', {token: token}).then(res => {
        window.location.href = '/'
    }).catch(v => alert(v.msg))
}
