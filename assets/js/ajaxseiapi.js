// 每次发起请求调用接口时,根路径都得写
// 调用ajaxPrefilter 函数,可以拿到ajax提供的配置对象
$.ajaxPrefilter(function(option) {
    // 在发起ajax请求之前拼接好URL
    option.url = 'http://www.liulongbin.top:3007' + option.url
})