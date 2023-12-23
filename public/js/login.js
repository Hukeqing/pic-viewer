login = () => {
    const token = document.getElementById("token").value
     Service.login(token, null, () => {
        window.location.href = `${BASE_URL}/`
    }, res => alert(res.msg))
}
