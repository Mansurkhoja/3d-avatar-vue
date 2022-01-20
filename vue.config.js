// module.export = {
//     css:{
//         loaderOptions:{
//             sass: {
//                 data: `@import "@/assets/scss/_vars.scss";`
//             }
//         }
//     }
// }
module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
    ? '/3d-avatar-vue/'
    : '/'
}