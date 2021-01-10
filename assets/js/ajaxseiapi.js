// 每次发起请求调用接口时,根路径都得写
// 调用ajaxPrefilter 函数,可以拿到ajax提供的配置对象
$.ajaxPrefilter(function(option) {
    // 在发起ajax请求之前拼接好URL
    option.url = 'http://www.liulongbin.top:3007' + option.url
        // 设置headers请求
    if (option.url.indexOf('/my/') !== -1) {
        option.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    // 设置全局complete回调
    option.complete = function(res) {
        // 可以使用res.responseJSON 获取数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            localStorage.removeItem('token')
            location.href = '/login.html'
        }
    }
})