(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{326:function(t,e,r){"use strict";var n=r(2),o=r(219).trim;n({target:"String",proto:!0,forced:r(328)("trim")},{trim:function(){return o(this)}})},327:function(t,e,r){"use strict";var n=r(2),o=r(76).find,c=r(150),l="find",d=!0;l in[]&&Array(1)[l]((function(){d=!1})),n({target:"Array",proto:!0,forced:d},{find:function(t){return o(this,t,arguments.length>1?arguments[1]:void 0)}}),c(l)},328:function(t,e,r){"use strict";var n=r(92).PROPER,o=r(4),c=r(220);t.exports=function(t){return o((function(){return!!c[t]()||"​᠎"!=="​᠎"[t]()||n&&c[t].name!==t}))}},333:function(t,e,r){"use strict";var n=r(2),o=r(334),c=r(29),l=r(44),d=r(64),m=r(117);n({target:"Array",proto:!0},{flat:function(){var t=arguments.length?arguments[0]:void 0,e=c(this),r=l(e),n=m(e,0);return n.length=o(n,e,e,r,0,void 0===t?1:d(t)),n}})},334:function(t,e,r){"use strict";var n=r(78),o=r(44),c=r(152),l=r(61),d=function(t,e,source,r,m,v,h,f){for(var element,_,C=m,w=0,y=!!h&&l(h,f);w<r;)w in source&&(element=y?y(source[w],w,e):source[w],v>0&&n(element)?(_=o(element),C=d(t,e,element,_,C,v-1)-1):(c(C+1),t[C]=element),C++),w++;return C};t.exports=d},335:function(t,e,r){"use strict";r(150)("flat")},345:function(t,e,r){var content=r(402);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(115).default)("6d1e202a",content,!0,{sourceMap:!1})},401:function(t,e,r){"use strict";r(345)},402:function(t,e,r){var n=r(114)((function(i){return i[1]}));n.push([t.i,'.monospace{font-family:monospace}#page-course tbody tr td:first-child{font-weight:700;width:7rem}#page-course tbody tr td:last-child{font-weight:400}#page-course .time{display:block}#course-time{display:inline}#course-time .time{display:inline-block}#course-time .time:after{content:"、"}#course-time .time:last-child:after{content:""}.statistic-title{font-size:.9rem}#page-course .ts-content{padding:.25rem .75rem}.ts-statistic .ts-icon{color:var(--ts-gray-500);font-size:.9rem;margin-right:.25rem}.ts-statistic .ts-icon:hover{cursor:pointer}.similar-courses .swal2-html-container{margin-top:1rem;overflow-x:hidden;padding-top:0}.term-group .term-title{background:var(--ts-gray-100);font-weight:700;margin:0 -2rem .25rem;padding:.5rem;position:sticky;top:0}@media screen and (max-width:767.98px){#page-course .time{display:inline-block}#page-course .time:after{content:"　"}#page-course .time:last-child:after{content:""}#course-time .time:after{content:"、"}#page-course tbody tr td{display:block;padding:0;width:100%}#page-course tbody tr td:first-child{padding-top:.4rem;width:100%}#page-course tbody tr td:last-child{padding-bottom:.4rem}.statistic-title{font-size:.8rem}#page-course .ts-grid .column.mobile-fluid .ts-wrap{justify-content:center}#page-course .ts-grid .column.mobile-fluid .ts-button{width:calc(50% - .5rem)}#page-course .ts-content{padding:.25rem 1rem .3rem}#page-course .ts-content.is-in-table{padding:.25rem 1rem .5rem}}@media print{#similar-course-button,.button-fab{display:none!important}#page-course tbody tr td:first-child{width:12rem}#page-course .ts-icon.is-circle-info-icon{display:none}#page-course .time:first-child,#page-course .time:nth-child(2){display:inline;padding-right:.5rem}}',""]),n.locals={},t.exports=n},418:function(t,e,r){"use strict";r.r(e);r(43),r(28),r(15),r(50),r(326);var n=r(23),o=r(10),c=(r(36),r(327),r(333),r(65),r(37),r(116),r(53),r(221),r(335),r(30),r(59),r(60),r(25),r(45),r(51),r(31),r(62),r(52));function l(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function d(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?l(Object(r),!0).forEach((function(e){Object(n.a)(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):l(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}var m={asyncData:function(t){return Object(o.a)(regeneratorRuntime.mark((function e(){var r;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t.params,!(r=t.payload)){e.next=3;break}return e.abrupt("return",{course:r});case 3:case"end":return e.stop()}}),e)})))()},data:function(){return{time_section:["0.5","1","2","3","4","4.5","5","6","7","8","8.5","9","10","11","12"],week_text:["","(一)","(二)","(三)","(四)","(五)","(六)",""],course:{},courses:[],more:[],office_time:[],schedule:[],savedCourse:[],loading:!0,start:Date.now(),similarCourses:[],newestYear:"",notFound:!1}},head:function(){return{title:(this.course.name?this.course.id.substring(0,3)+"-"+this.course.id.substring(3,4)+" "+this.course.name+" | ":"")+"明志科技大學選課小幫手",meta:[{hid:"og:title",property:"og:title",content:(this.course.name?this.course.id.substring(0,3)+"-"+this.course.id.substring(3,4)+" "+this.course.name+" | ":"")+"明志科技大學選課小幫手"},{hid:"description",name:"description",content:this.course.dept+" "+this.course.year+" "+this.course.class+"・"+this.course.type+"・"+this.course.credit+" 學分・"+this.course.teacher+" 老師"},{hid:"og:description",name:"og:description",content:this.course.dept+" "+this.course.year+" "+this.course.class+"・"+this.course.type+"・"+this.course.credit+" 學分・"+this.course.teacher+" 老師"},{hid:"og:url",property:"og:url",content:"https://mcut-course.com"+this.$router.currentRoute.path},{hid:"og:image",property:"og:image",content:"https://og.mcut-course.com"+this.$router.currentRoute.path+".jpg?t="+Date.now()},{hid:"twitter:image",name:"twitter:image",content:"https://og.mcut-course.com"+this.$router.currentRoute.path+".jpg?t="+Date.now()}]}},filters:{formatDate:function(t){if(!t)return"";var e=new Date(t);return e?e.getMonth()+1+"/"+e.getDate()+" "+["","(一)","(二)","(三)","(四)","(五)","(六)",""][e.getDay()]:t.replace(/^0/,"").replace(/\/0/,"/")},formatTime:function(time){if(time){var t=time.split("~");return t[0]==t[1]?"第 "+t[0]+" 節":t.join(" ~ ")+" 節"}}},mounted:function(){var t=this;return Object(o.a)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t.$route.params.id){e.next=3;break}return t.$router.push("/"),e.abrupt("return");case 3:return e.next=5,t.$store.dispatch("getSavedCourse");case 5:if(t.savedCourse=e.sent,t.course&&t.course.name){e.next=9;break}return t.notFound=!0,e.abrupt("return");case 9:t.fetchData();case 10:case"end":return e.stop()}}),e)})))()},computed:d(d({},Object(c.c)({showAd:function(t){return t.show_ad}})),{},{hasCoursedTime:function(){var t=this;return 0==this.savedCourse.length||this.savedCourse[0].substring(0,4)!==this.course.id.substring(0,4)?[]:this.courses?this.savedCourse.map((function(e){var r=t.courses.find((function(t){return t.id===e}));return!!r&&r.time.map((function(time){var e=time[0],section=time[1].split("~").map((function(section){return t.time_section.indexOf(section)}));return Array.from({length:section[1]-section[0]+1},(function(r,i){return e+"_"+t.time_section[section[0]+i]}))})).flat()})).flat():[]}}),methods:d(d({},Object(c.b)(["setSavedCourse"])),{},{isConflicted:function(){var t=this;return 0!=this.savedCourse.length&&(!this.savedCourse.includes(this.course.id)&&(!!this.course.time&&this.course.time.some((function(time){var e=time[0],section=time[1].split("~").map((function(section){return t.time_section.indexOf(section)}));return Array.from({length:section[1]-section[0]+1},(function(r,i){return e+"_"+t.time_section[section[0]+i]})).some((function(e){if(t.hasCoursedTime.includes(e))return!0}))}))))},fetchData:function(){var t,e=this;this.currentTerm=null!==(t=localStorage.term)&&void 0!==t?t:"",this.savedCourse&&this.savedCourse.length>0&&(this.currentTerm=this.savedCourse[0].substring(0,3)+"-"+this.savedCourse[0].substring(3,4));var r=(new Date).getTime(),n=localStorage["courseData_"+this.currentTerm],o=localStorage["courseDataTime_"+this.currentTerm];n&&o&&r-o<18e5?this.courses=JSON.parse(n).course:this.$axios.get("https://api.mcut-course.com/list.php?term="+this.currentTerm).then((function(t){localStorage["courseData_"+e.currentTerm]=JSON.stringify(t.data),localStorage["courseDataTime_"+e.currentTerm]=r,e.courses=t.data.course})),this.$axios.get("https://api.mcut-course.com/detail.php?id="+this.$router.currentRoute.path.replace(/course/g,"").replace(/\//g,"")+"&ver=full").then((function(t){var r,n,o,c;e.course=null!==(r=t.data[3])&&void 0!==r?r:{},e.more=null!==(n=t.data[0])&&void 0!==n?n:[],e.office_time=null!==(o=t.data[1])&&void 0!==o?o:[],e.schedule=null!==(c=t.data[2])&&void 0!==c?c:[],e.loading=!1})),this.$axios.get("https://api.mcut-course.com/similar.php?id="+this.$router.currentRoute.path.replace(/course/g,"").replace(/\//g,"")).then((function(t){t.data.similar&&(e.similarCourses=t.data.similar,e.newestYear=t.data.newest_year)}))},saveCourse:function(){var t=this;return Object(o.a)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!t.savedCourse.includes(t.course.id)){e.next=5;break}t.savedCourse=t.savedCourse.filter((function(e){return e!==t.course.id})),t.$swal({title:"已取消收藏「"+t.course.name+"」",icon:"success",toast:!0,timer:3e3,timerProgressBar:!0,position:"bottom-start",showConfirmButton:!1}),e.next=10;break;case 5:if(!t.savedCourse[0]||t.savedCourse[0].substring(0,4)===t.course.id.substring(0,4)){e.next=8;break}return t.$swal({title:"無法收藏跨學期的課程",icon:"warning",html:"是否要清空目前已收藏的課程，並切換至 "+t.course.id.substring(0,3)+"-"+t.course.id.substring(3,4)+" 學期？",confirmButtonText:"清空並切換",cancelButtonText:"取消",showCancelButton:!0}).then((function(e){e.isConfirmed&&(t.savedCourse=[t.course.id],localStorage.term=t.course.id.substring(0,3)+"-"+t.course.id.substring(3,4),t.setSavedCourse([t.savedCourse]),t.$root.$emit("updateSavedCourse",t.savedCourse),t.$swal({title:"「"+t.course.name+"」已收藏",icon:"success",toast:!0,timer:3e3,timerProgressBar:!0,position:"bottom-start",showConfirmButton:!1}))})),e.abrupt("return");case 8:t.savedCourse.push(t.course.id),t.$swal({title:"已收藏「"+t.course.name+"」",icon:"success",toast:!0,timer:3e3,timerProgressBar:!0,position:"bottom-start",showConfirmButton:!1});case 10:t.setSavedCourse([t.savedCourse]),t.$root.$emit("updateSavedCourse",t.savedCourse);case 12:case"end":return e.stop()}}),e)})))()},share:function(){var t=this;navigator.share&&window.innerWidth<768?navigator.share({title:(this.course.name?this.course.name+" | ":"")+"明志科技大學選課小幫手",url:document.location.href}):this.$swal({title:"分享這門課程",html:'<div class="ts-box"><div class="ts-content is-start-aligned is-dense">'+document.location.origin+document.location.pathname+"</div></div>",confirmButtonText:"複製網址",showCloseButton:!0}).then((function(e){if(e.isConfirmed){var r=document.createElement("textarea");r.value=document.location.origin+document.location.pathname,document.body.appendChild(r),r.select(),document.execCommand("copy"),document.body.removeChild(r),t.$swal({title:"已複製分享連結",icon:"success",toast:!0,timer:3e3,timerProgressBar:!0,position:"bottom-start",showConfirmButton:!1})}}))},showTimeInfo:function(){var t=this,e=[["07:00","07:50"],["08:00","08:50"],["09:00","09:50"],["10:00","10:50"],["11:00","11:50"],["12:00","12:50"],["13:00","13:50"],["14:00","14:50"],["15:00","15:50"],["16:00","16:50"],["17:00","17:50"],["18:40","19:25"],["19:30","20:15"],["20:25","21:10"],["21:15","22:00"]],r="";(this.course.time.every((function(time){return time[1].includes(".5")&&time[1].split("~")[0]==time[1].split("~")[1]}))||this.course.time.every((function(time){return 0==time[0]||7==time[0]})))&&(this.course.name.includes("勤勞教育")||this.course.name.includes("大學之道")||this.course.name.includes("實習前職場素養訓練")||this.course.name.includes("專題")||this.course.name.includes("工讀實務實習")||this.course.name.includes("工讀自學英文")||this.course.name.includes("設計思考"))?r="「"+this.course.name+"」課程於系統上無表定上課時間，請參考備註或教學進度表，也可以詢問授課老師/班級導師。":this.course.time.forEach((function(time){var n=time[0],section=time[1].split("~").map((function(section){return t.time_section.indexOf(section)}));r+="星期"+t.week_text[n].replace(/[\(\)]/g,"")+"　"+e[section[0]][0]+" ~ "+e[section[1]][1]+"<br>"})),this.$swal({title:"上課時間",html:'<div style="text-align:left">'+r+"</div>",showConfirmButton:!1,showCloseButton:!0,width:r.includes("無固定")?"28rem":"20rem"})},viewSimilarCourses:function(){var t=this;this.$swal({title:"歷年開課 / 各系所開課 ("+this.similarCourses.length+")",customClass:{container:"similar-courses"},html:'<div class="ts-menu is-small is-dense is-separated alt_course_courses" style="max-height:75vh">'+function(){var e=t.similarCourses.sort((function(a,b){return a.dept!=t.course.dept&&b.dept==t.course.dept?1:a.dept==t.course.dept&&b.dept!=t.course.dept?-1:a.time[0][0]-b.time[0][0]})),r={};e.forEach((function(t){var e=t.id.substring(0,4);r[e]||(r[e]=[]),r[e].push(t)}));var html="";return Object.keys(r).sort((function(a,b){return b-a})).forEach((function(e){var n=e.substring(0,3)+"-"+e.substring(3,4)+" 學期";html+='<div class="term-group"><div class="term-title">'+n+"</div>",r[e].forEach((function(e){html+='<a class="item" href="/course/'+e.id.substring(0,4)+"/"+e.id.substring(4,8)+"/"+e.id.substring(8)+'/">\t\t\t\t\t\t\t\t\t\t<div class="ts-header">'+e.name+(e.type!=t.course.type?'&nbsp;<span class="ts-badge is-small is-dense">'+e.type+"</span>":"")+'</div>\t\t\t\t\t\t\t\t\t\t<div class="ts-text is-description is-start-aligned">'+e.dept+"・"+e.teacher+" 老師</div>\t\t\t\t\t\t\t\t\t</a>"})),html+="</div>"})),html+"</div>"}(),showConfirmButton:!1,showCloseButton:!0}).then((function(e){e.isConfirmed&&t.$router.push("/course/"+t.newestYear+"/"+t.course.id.substring(4))}))}})},v=(r(401),r(42)),component=Object(v.a)(m,(function(){var t=this,e=t._self._c;return e("div",{staticClass:"cell is-secondary is-scrollable is-fluid is-horizontal",attrs:{id:"page-course"}},[t.notFound?e("div",{staticClass:"ts-app-center"},[t._m(0)]):e("div",{staticClass:"ts-container has-top-padded-large"},[e("div",{staticClass:"ts-grid is-compact is-middle-aligned"},[e("div",{staticClass:"column is-10-wide mobile-fluid"},[e("div",{staticClass:"ts-text is-description"},[t._v("\n\t\t\t\t\t"+t._s(t.course.id?t.course.id.substring(0,3)+"-"+t.course.id.substring(3,4)+" 學期・":"")),e("span",{staticClass:"monospace"},[t._v(t._s(t.course.id))])]),t._v(" "),e("h1",{staticClass:"ts-header is-huge"},[t._v(t._s(t.course.name))])]),t._v(" "),e("div",{staticClass:"column is-6-wide mobile-fluid"},[e("div",{staticClass:"ts-wrap is-end-aligned"},[t.courses&&t.courses.length>0?[t.isConflicted()?e("button",{staticClass:"ts-button is-start-icon is-secondary is-negative is-disabled"},[e("span",{staticClass:"ts-icon is-triangle-exclamation-icon"}),t._v("衝堂\n\t\t\t\t\t\t")]):t.savedCourse.includes(t.course.id)?e("button",{staticClass:"ts-button is-start-icon",on:{click:function(e){return t.saveCourse()}}},[e("span",{staticClass:"ts-icon is-star-icon"}),t._v("已收藏\n\t\t\t\t\t\t")]):e("button",{staticClass:"ts-button is-start-icon is-secondary",on:{click:function(e){return t.saveCourse()}}},[e("span",{staticClass:"ts-icon is-regular is-star-icon"}),t._v("收藏\n\t\t\t\t\t\t")])]:[e("button",{staticClass:"ts-button is-start-icon is-secondary is-disabled"},[t._v("讀取中...")])],t._v(" "),e("button",{staticClass:"ts-button is-start-icon is-secondary",on:{click:function(e){return t.share()}}},[e("span",{staticClass:"ts-icon is-share-icon"}),t._v("分享\n\t\t\t\t\t")])],2)])]),t._v(" "),t.course.name?e("div",{staticClass:"ts-grid is-stretched has-top-spaced"},[t.similarCourses.length>0?e("div",{staticClass:"column is-16-wide mobile-fluid",attrs:{id:"similar-course-button"}},[e("a",{staticClass:"ts-box",staticStyle:{cursor:"pointer"},attrs:{"aria-label":"查看歷年開課紀錄"},on:{click:function(e){return t.viewSimilarCourses()}}},[e("div",{staticClass:"ts-content"},[e("div",{staticClass:"ts-grid is-compact is-middle-aligned"},[e("div",{staticClass:"column is-15-wide"},[e("div",{staticClass:"ts-text is-description"},[e("span",{staticClass:"ts-badge is-small is-dense"},[t._v("提示")]),t._v(" "),t.newestYear!=t.course.id.substring(0,3)?[t._v("您正在查看前幾學期的開課資料，這門課在 "+t._s(t.newestYear)+" 學年也有開設！")]:t.similarCourses.some((function(e){return e.id.substring(0,3)!=t.newestYear}))?[t._v("這門課在前幾個學年也有開設，點此可查看歷年開課紀錄！")]:[t._v("這門課也有其他系所開設，點此可查看開課資料！")]],2)]),t._v(" "),t._m(1)])])])]):t._e(),t._v(" "),e("div",{staticClass:"column is-8-wide mobile-fluid"},[e("div",{staticClass:"ts-box"},[e("div",{staticClass:"ts-content"},[e("span",{staticClass:"statistic-title"},[t._v("開課單位/班級")]),t._v(" "),e("div",{staticClass:"ts-statistic"},[e("div",{staticClass:"value"},[t._v(t._s(t.course.dept+" "+t.course.year+" "+t.course.class))])])]),t._v(" "),t._m(2)])]),t._v(" "),e("div",{staticClass:"column",class:{"is-6-wide mobile-3-by-4":t.course.otherinfo,"is-4-wide mobile-half":!t.course.otherinfo}},[e("div",{staticClass:"ts-box"},[e("div",{staticClass:"ts-content"},[e("span",{staticClass:"statistic-title"},[t._v("修別 "+t._s(t.course.otherinfo?" / 通識類別":""))]),t._v(" "),e("div",{staticClass:"ts-statistic"},[e("div",{staticClass:"value"},[t._v(t._s(t.course.type+(t.course.otherinfo?" "+t.course.otherinfo:"")))])])]),t._v(" "),t._m(3)])]),t._v(" "),e("div",{staticClass:"column mobile-half",class:{"is-2-wide mobile-1-by-4":t.course.otherinfo,"is-4-wide mobile-half":!t.course.otherinfo}},[e("div",{staticClass:"ts-box"},[e("div",{staticClass:"ts-content"},[e("span",{staticClass:"statistic-title"},[t._v("學分")]),t._v(" "),e("div",{staticClass:"ts-statistic"},[e("div",{staticClass:"value"},[t._v(t._s(t.course.credit))])])]),t._v(" "),t._m(4)])]),t._v(" "),e("div",{staticClass:"column mobile-fluid",class:{"is-12-wide":t.course.time.length>=3,"is-8-wide":t.course.time.length<3}},[e("div",{staticClass:"ts-box"},[e("div",{staticClass:"ts-content"},[e("span",{staticClass:"statistic-title"},[t._v("上課時間")]),t._v(" "),e("div",{staticClass:"ts-statistic"},[e("div",{staticClass:"value",attrs:{id:"course-time"}},t._l(t.course.time,(function(time){return e("span",{staticClass:"time"},[time[1].split("~")[0]==time[1].split("~")[1]?[t._v(t._s(t.week_text[time[0]]+" 第 "+time[1].split("~")[0]+" 節"))]:[t._v(t._s(t.week_text[time[0]]+" "+time[1]+" 節"))]],2)})),0),t._v(" "),t.course.time.length>=1?e("span",{staticClass:"ts-icon is-circle-info-icon",on:{click:function(e){return t.showTimeInfo()}}}):t._e()])]),t._v(" "),t._m(5)])]),t._v(" "),e("div",{staticClass:"column mobile-fluid",class:{"is-4-wide":t.course.time.length>=3,"is-8-wide":t.course.time.length<3}},[e("div",{staticClass:"ts-box"},[e("div",{staticClass:"ts-content"},[e("span",{staticClass:"statistic-title"},[t._v("授課老師")]),t._v(" "),e("div",{staticClass:"ts-statistic"},[e("div",{staticClass:"value"},[t._v(t._s(t.course.teacher))])])]),t._v(" "),t._m(6)])])]):t._e(),t._v(" "),t.course.name?e("table",{staticClass:"ts-table is-sticked has-top-spaced"},[e("tbody",[e("tr",[e("td",[t._v("人數限制")]),t._v(" "),e("td",[t._v(t._s(t.course.min)+" ~ "+t._s(t.course.max))])]),t._v(" "),e("tr",[e("td",[t._v("備註")]),t._v(" "),e("td",[t._v(t._s(t.course.comment))])]),t._v(" "),t.loading?e("tr",[t._m(7)]):t._e(),t._v(" "),t.loading||t.more&&0!=t.more.length?t._e():e("tr",[t._m(8)]),t._v(" "),t._l(t.more,(function(r){return e("tr",[e("td",[t._v(t._s(r[0]))]),t._v(" "),"教學方法"==r[0]&&""!=r[1].trim()?e("td",[e("div",{staticClass:"ts-wrap is-compact"},t._l(r[1].split(","),(function(r){return e("div",{staticClass:"ts-badge is-secondary is-dense",domProps:{innerHTML:t._s(r)}})})),0)]):e("td",{domProps:{innerHTML:t._s(r[1])}})])})),t._v(" "),t.office_time.length>0?e("tr",[e("td",[t._v("Office Time")]),t._v(" "),e("td",[e("div",{staticClass:"ts-list is-unordered"},t._l(t.office_time,(function(r){return e("div",{staticClass:"item",domProps:{innerHTML:t._s(r)}})})),0)])]):t._e(),t._v(" "),t.showAd?e("tr",{staticClass:"ad"},[t._m(9)]):t._e(),t._v(" "),t.schedule.length>0?e("tr",[e("td",{attrs:{colspan:"2"}},[e("b",[t._v("教學進度表")]),t._v(" "),e("div",{staticClass:"ts-box has-top-spaced-small"},[e("div",{staticClass:"ts-content is-in-table"},[e("table",{staticClass:"ts-table"},[e("tbody",t._l(t.schedule,(function(s){return e("tr",[e("td",[e("span",{staticClass:"time"},[t._v(t._s(t._f("formatDate")(s[7]||s[0])))]),t._v(" "),e("span",{staticClass:"time"},[t._v(t._s(t._f("formatTime")(s[1])))]),t._v(" "),e("span",{staticClass:"time"},[t._v(t._s(""!=s[2]?s[2]+" 老師":""))])]),t._v(" "),e("td",[e("b",{domProps:{innerHTML:t._s(s[3])}}),t._v(" "),e("div",{staticClass:"ts-text is-description",domProps:{innerHTML:t._s(s[4])}}),t._v(" "),s[5]?e("div",{staticClass:"ts-text is-secondary",domProps:{innerHTML:t._s("作業："+s[5])}}):t._e(),t._v(" "),s[6]?e("div",{staticClass:"ts-text is-secondary",domProps:{innerHTML:t._s("備註："+s[6])}}):t._e()])])})),0)])])])])]):t._e()],2)]):t._e(),t._v(" "),e("br")]),t._v(" "),e("NuxtLink",{staticClass:"button-fab",attrs:{to:"/saved/","aria-label":"查看已儲存的課程"}},[e("span",{staticClass:"ts-icon is-star-icon"}),t._v(" "),t.savedCourse.length>0?e("span",{staticClass:"ts-badge is-negative"},[t._v(t._s(t.savedCourse.length))]):t._e()])],1)}),[function(){var t=this,e=t._self._c;return e("div",[e("div",{staticClass:"ts-header is-icon is-center-aligned is-big"},[e("span",{staticClass:"ts-icon ts-icon is-circle-exclamation-icon"}),t._v("\n\t\t\t\t找不到此課程\n\t\t\t")]),t._v(" "),e("div",{staticClass:"ts-text is-center-aligned has-top-padded"},[t._v("\n\t\t\t\t此連結可能已失效，"),e("br"),t._v("\n\t\t\t\t請點擊上方選單中的其他連結。\n\t\t\t")])])},function(){var t=this._self._c;return t("div",{staticClass:"column is-1-wide",staticStyle:{"text-align":"right"}},[t("span",{staticClass:"ts-icon is-angle-right-icon"})])},function(){var t=this._self._c;return t("div",{staticClass:"symbol"},[t("span",{staticClass:"ts-icon is-users-icon"})])},function(){var t=this._self._c;return t("div",{staticClass:"symbol"},[t("span",{staticClass:"ts-icon is-clipboard-check-icon"})])},function(){var t=this._self._c;return t("div",{staticClass:"symbol"},[t("span",{staticClass:"ts-icon is-list-check-icon"})])},function(){var t=this._self._c;return t("div",{staticClass:"symbol"},[t("span",{staticClass:"ts-icon is-regular is-calendar-days-icon"})])},function(){var t=this._self._c;return t("div",{staticClass:"symbol"},[t("span",{staticClass:"ts-icon is-person-chalkboard-icon"})])},function(){var t=this,e=t._self._c;return e("td",{staticClass:"is-center-aligned",attrs:{colspan:"2"}},[e("div",{staticClass:"ts-header is-icon is-center-aligned has-vertically-padded-large"},[e("span",{staticClass:"ts-icon is-spinning is-spinner-icon"}),t._v(" "),e("div",{staticClass:"has-top-padded-small"},[t._v("讀取中...")])])])},function(){var t=this._self._c;return t("td",{attrs:{colspan:"2"}},[t("div",{staticClass:"ts-text is-center-aligned is-disabled has-vertically-padded-huge"},[this._v("\n\t\t\t\t\t\t\t授課老師未填寫詳細課程資訊\n\t\t\t\t\t\t")])])},function(){var t=this,e=t._self._c;return e("td",{attrs:{colspan:"2"}},[e("div",{staticClass:"ts-box ad is-hollowed"},[e("div",{staticClass:"ts-content"},[e("div",{staticClass:"ts-text is-description has-bottom-padded-small"},[t._v("贊助商")]),t._v(" "),e("script",{attrs:{async:"",src:"https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5900703871265800",crossorigin:"anonymous",onerror:"document.querySelector('.ad .ts-content').innerHTML='<div class=\"ts-text is-description has-bottom-padded-small\">贊助商</div><div class=\"ts-text is-secondary is-center-aligned has-vertically-padded\">太無情了吧，擋廣告 😭<br>加入白名單，救救開發者 🙏</div>';"}}),t._v(" "),e("ins",{staticClass:"adsbygoogle",staticStyle:{display:"block","text-align":"center"},attrs:{"data-ad-layout":"in-article","data-ad-format":"fluid","data-ad-client":"ca-pub-5900703871265800","data-ad-slot":"3164180037"}}),t._v(" "),e("script",[t._v("\n\t\t\t\t\t\t\t\t\t(adsbygoogle = window.adsbygoogle || []).push({});\n\t\t\t\t\t\t\t\t")])])])])}],!1,null,null,null);e.default=component.exports}}]);