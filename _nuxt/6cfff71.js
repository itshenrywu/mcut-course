(window.webpackJsonp=window.webpackJsonp||[]).push([[18],{326:function(t,e,r){"use strict";var n=r(2),l=r(219).trim;n({target:"String",proto:!0,forced:r(328)("trim")},{trim:function(){return l(this)}})},327:function(t,e,r){"use strict";var n=r(2),l=r(76).find,o=r(150),c="find",d=!0;c in[]&&Array(1)[c]((function(){d=!1})),n({target:"Array",proto:!0,forced:d},{find:function(t){return l(this,t,arguments.length>1?arguments[1]:void 0)}}),o(c)},328:function(t,e,r){"use strict";var n=r(92).PROPER,l=r(4),o=r(220);t.exports=function(t){return l((function(){return!!o[t]()||"​᠎"!=="​᠎"[t]()||n&&o[t].name!==t}))}},346:function(t,e,r){"use strict";var n=r(2),l=r(229).values;n({target:"Object",stat:!0},{values:function(t){return l(t)}})},347:function(t,e,r){var content=r(404);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(115).default)("2b3b7f2f",content,!0,{sourceMap:!1})},403:function(t,e,r){"use strict";r(347)},404:function(t,e,r){var n=r(114)((function(i){return i[1]}));n.push([t.i,"#page-rule .ts-box .ts-icon.is-angle-down-icon,#page-rule .ts-box .ts-icon.is-angle-up-icon{float:right}#page-rule li{line-height:1.4rem;padding:4px 0}#page-rule ol{padding-left:0}#page-rule ol ::marker{color:var(--ts-gray-500)}#page-rule td:first-child{width:40%}#page-rule td:nth-child(2){width:4rem}#page-rule td:nth-child(3){width:6rem}#page-rule td:nth-child(4){width:10rem}#page-rule .rule_subtype{overflow:hidden}#page-rule .rule_subtype_name:hover{cursor:pointer}#page-rule td.r-remark{color:var(--ts-gray-500);font-size:.8rem}#page-rule tr:hover{background-color:var(--ts-gray-100);cursor:pointer}#page-rule tr.is-not-clickable:hover{background-color:transparent;cursor:default}@media screen and (max-width:767.98px){#page-rule .is-scrollable{overflow-y:visible;overflow-y:initial}#page-rule,#page-rule tbody,#page-rule td,#page-rule tfoot,#page-rule th,#page-rule tr{display:block}#page-rule tr:hover{background-color:transparent}#page-rule tr td{padding:.05rem 1rem}#page-rule td:first-child,#page-rule td:nth-child(2),#page-rule td:nth-child(3),#page-rule td:nth-child(4){display:inline-block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#page-rule td:first-child{width:calc(100% - 12rem)}#page-rule td:nth-child(2),#page-rule td:nth-child(3){padding:0;text-align:right}#page-rule td:nth-child(4){width:100%}#page-rule td:empty{display:none}#page-rule td:first-child{padding-top:.4rem}#page-rule td:last-child{padding-bottom:.4rem}}@media print{#page-rule{overflow-y:visible!important}#page-rule .ts-content.is-secondary,#page-rule .ts-content.is-tertiary{border-bottom:1px solid var(--ts-gray-200)}#page-rule td:first-child{padding-left:4rem}#page-rule td.ts-text.is-description,.sidebar{display:none}.sidebar{width:0}.rule_subtype{display:block!important}#page-rule td:nth-child(2){width:5rem}#page-rule .ts-box .ts-icon.is-angle-down-icon,#page-rule .ts-box .ts-icon.is-angle-up-icon{display:none}}",""]),n.locals={},t.exports=n},419:function(t,e,r){"use strict";r.r(e);r(36),r(327),r(43),r(53),r(28),r(15),r(346),r(25),r(38),r(50),r(51),r(326);var n=r(23),l=r(10),o=(r(62),r(116),r(63),r(37),r(59),r(60),r(30),r(157),r(31),r(52));function c(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function d(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?c(Object(r),!0).forEach((function(e){Object(n.a)(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):c(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}var h={asyncData:function(t){return Object(l.a)(regeneratorRuntime.mark((function e(){var r,n,l,o,c,d,h,v,m,f;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(r=t.$axios,t.params,n=t.payload,l={},o={},c=[],d=[],h="",!n){e.next=13;break}l=n.depts,o=n.rules,d=n.terms,h=n.name,e.next=20;break;case 13:return e.next=15,r.get("https://api.mcut-course.com/rule/list2.php");case 15:v=e.sent,l=v.data.depts,o=v.data.rules,d=v.data.terms,h="";case 20:for(m=(new Date).getFullYear()-1911,(new Date).getMonth()<8&&m--,f=m;f>=108;f--)c.push(f);return e.abrupt("return",{depts:l,rules:o,years:c,terms:d,currentRuleName:h});case 24:case"end":return e.stop()}}),e)})))()},data:function(){return{currentYear:"",currentDept:"",currentRule:"",currentRuleTerm:"",currentRuleName:"",rules:{},rule:{},terms:[],years:[],allAourses:[],loading:!0,notFound:!1,showMobileSidebar:!1}},head:function(){var t=this.currentYear||this.$route.params.year;return{title:(t?t+" 學年度入學 - ":"")+(this.currentRuleName||"")+"課程總表 | 明志科技大學選課小幫手",meta:[{hid:"og:title",property:"og:title",content:(t?t+" 學年度入學 - ":"")+(this.currentRuleName||"")+"課程總表 | 明志科技大學選課小幫手"},{hid:"twitter:title",name:"twitter:title",content:(t?t+" 學年度入學 - ":"")+(this.currentRuleName||"")+"課程總表 | 明志科技大學選課小幫手"},{hid:"og:url",property:"og:url",content:"https://mcut-course.com"+this.$router.currentRoute.path},{hid:"og:image",property:"og:image",content:"https://og.mcut-course.com"+this.$router.currentRoute.path+".jpg?t="+Date.now()},{hid:"twitter:image",name:"twitter:image",content:"https://og.mcut-course.com"+this.$router.currentRoute.path+".jpg?t="+Date.now()}]}},computed:d(d({},Object(o.c)({showAd:function(t){return t.show_ad}})),{},{currentDeptName:function(){var t,e=this;return""==this.currentDept?"":null===(t=Object.values(this.depts[this.currentYear]).find((function(t){return e.currentDept in t})))||void 0===t?void 0:t[this.currentDept]},findCourses:function(){var t=this;return function(e){return t.courses?t.courses.filter((function(r){return r.id.includes(t.currentRuleTerm.replace("-","")+e)})):[]}}}),mounted:function(){var t=this;this.$root.$on("showAd",(function(){t.showAd=!0})),this.init(),!this.currentRuleName&&this.$route.params.id&&(this.notFound=!0)},methods:d(d({},Object(o.b)(["setSavedCourse"])),{},{init:function(){var t=this;return Object(l.a)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:t.$route.params.id?(t.currentYear=t.$route.params.year,t.currentDept=t.$route.params.dept,t.currentRule=t.$route.params.id):(t.currentYear=localStorage.ruleYear||t.years[0],t.currentDept=localStorage.ruleDept||Object.keys(Object.values(t.depts[t.currentYear])[0])[0],t.currentRule=localStorage.ruleRule||"-1"),t.terms.includes(localStorage.ruleTerm)?t.currentRuleTerm=localStorage.ruleTerm:t.terms.includes(localStorage.term)&&(t.currentRuleTerm=localStorage.term),""==t.currentRuleTerm&&(t.currentRuleTerm=t.terms[0]),t.loading=!1,t.saveRuleInput();case 6:case"end":return e.stop()}}),e)})))()},saveRuleInput:function(){"-1"!=this.currentRule&&(localStorage.ruleYear=this.currentYear,localStorage.ruleDept=this.currentDept,localStorage.ruleRule=this.currentRule,this.$route.path!="/rule/"+this.currentYear+"/"+this.currentDept+"/"+this.currentRule+"/"&&history.replaceState([],"","/rule/"+this.currentYear+"/"+this.currentDept+"/"+this.currentRule+"/"),this.getRule())},chooseYear:function(){this.currentDeptName||(this.currentDept=Object.keys(Object.values(this.depts[this.currentYear])[0])[0]),this.currentRule=-1,history.replaceState([],"","/rule/")},chooseDept:function(){this.currentRule=-1,history.replaceState([],"","/rule/")},getRule:function(){var t,e=this;this.loading=!0,this.notFound=!1,"000"==this.currentRule?this.currentRuleName=this.currentDeptName:this.currentRuleName=null===(t=Object.values(this.rules[this.currentYear]).find((function(t){return e.currentRule in t})))||void 0===t?void 0:t[this.currentRule].name,this.$axios.get("https://api.mcut-course.com/rule/get.php?year="+this.currentYear+"&dept="+this.currentDept+"&rule="+this.currentRule).then((function(t){e.rule=t.data,e.initializeShowProperty(),e.loading=!1,e.rule.data&&0!=e.rule.data.length||(e.notFound=!0)})),this.changeTerm()},initializeShowProperty:function(){var t=this;this.rule&&this.rule.data&&this.rule.data.forEach((function(e){e.data.forEach((function(e){t.$set(e,"show",!1)}))}))},formatRemark:function(t){var e=[],r=t.split("\r\n"),n=[];r.forEach((function(t){"<br />"!=t&&(0===t.search(/\d{1,2}\s/)?(n.push(["s",t.slice(t.split(" ")[0].length+1),"'"+t.split(" ")[0]+". '"]),e.includes("s")||e.push("s")):0===t.search(/\d{1,2}\./)?(n.push(["d",t.slice(t.split(".")[0].length+1),"'"+t.split(".")[0]+". '"]),e.includes("d")||e.push("d")):0===t.search(/.{1,2}、/)?(n.push(["c",t.slice(t.split("、")[0].length+1),"'"+t.split("、")[0]+"、'"]),e.includes("c")||e.push("c")):0===t.search(/\*/)?(n.push(["b",t.slice(1),"' • '"]),e.includes("b")||e.push("b")):0===t.search(/\(\d{1,2}\)/)?(n.push(["q",t.slice(t.split(")")[0].length+1),"'"+t.split(")")[0]+") '"]),e.includes("q")||e.push("q")):(n.push(["n",t,"none"]),e.includes("n")||e.push("n")))}));var l=0,o={};e.forEach((function(style){l+="n"==style?0:"c"==style?35:20,o[style]=l}));var output="<ol>";return output+=n.map((function(t){return'<li class="'+t[0]+'" style="margin-left:'+o[t[0]]+"px;list-style-type:"+t[2]+'">'+t[1].replace(/([^\x00-\x7F]+)([A-Za-z0-9]+)/g,"$1 $2").replace(/([A-Za-z0-9]+)([^\x00-\x7F]+)/g,"$1 $2")+"</li>"})).join(""),output+="</ul>"},changeTerm:function(){var t=this;this.initializeShowProperty(),localStorage.ruleTerm=this.currentRuleTerm;var e=(new Date).getTime(),r=localStorage["courseData_"+this.currentRuleTerm],n=localStorage["courseDataTime_"+this.currentRuleTerm];r&&n&&e-n<18e5?this.courses=JSON.parse(r).course:(this.loading=!0,this.$axios.get("https://api.mcut-course.com/list.php?term="+this.currentRuleTerm).then((function(r){localStorage["courseData_"+t.currentRuleTerm]=JSON.stringify(r.data),localStorage["courseDataTime_"+t.currentRuleTerm]=e,t.courses=r.data.course,t.loading=!1})))},showFindCourse:function(t){var e=this;return Object(l.a)(regeneratorRuntime.mark((function r(){var n;return regeneratorRuntime.wrap((function(r){for(;;)switch(r.prev=r.next){case 0:if(0!=e.findCourses(t).length){r.next=2;break}return r.abrupt("return");case 2:return r.next=4,e.$store.dispatch("getSavedCourse");case 4:if(!((n=r.sent).length>=1&&n[0].substring(0,4)!=e.currentRuleTerm.replace("-",""))){r.next=8;break}return e.$swal({icon:"warning",title:"欲選課學期與收藏的課程學期不同",html:"目前收藏的課程為 "+n[0].substring(0,3)+"-"+n[0].substring(3,4)+" 學期，是否要清空並切換至 "+e.currentRuleTerm+" 學期以檢視相符的課程？",confirmButtonText:"切換並檢視",cancelButtonText:"取消",showCancelButton:!0}).then((function(r){r.isConfirmed&&(e.setSavedCourse([]),localStorage.term=e.currentRuleTerm,localStorage.searchQuery=t,localStorage.dept="",localStorage.class="",localStorage.type="",e.$router.push("/course/"))})),r.abrupt("return");case 8:localStorage.term=e.currentRuleTerm,localStorage.searchQuery=t,localStorage.dept="",localStorage.class="",localStorage.type="",e.$router.push("/course/");case 14:case"end":return r.stop()}}),r)})))()},showInfo:function(t){var e=this;["永續發展與社會實踐","經典教育與社會實踐"].includes(t)&&this.$swal({title:t+" 開課方式",html:'<div style="text-align:left">\t\t\t\t\t<div class="ts-header is-large">1. 與通識必選課結合 (X+1)</div>\t\t\t\t\t<p>在大一、大二的必修（如國文、英文、體育）或通識選修開學時，由老師詢問同學修課意願（依任課老師意願，不是每堂課都會詢問），達 15 人以上即可開設。</p>\t\t\t\t\t<div class="ts-header is-large">2. 由通識中心開設課程</div>\t\t\t\t\t<p style="margin-bottom:0">課程會開設在大三及大四，類似通識選修，將於選課系統上供學生選課。</p>\t\t\t\t\t</div>',showConfirmButton:this.findCourses("00700F"),confirmButtonText:"查看 "+this.currentRuleTerm+" 開課課程",showCloseButton:!0}).then((function(t){t.isConfirmed&&e.showFindCourse("00700F")}))},beforeSlide:function(t){t.style.height="0"},slideIn:function(t,e){t.offsetHeight,t.style.transition="height .5s ease",t.style.height=t.scrollHeight+"px",t.addEventListener("transitionend",e)},slideOut:function(t,e){t.style.transition="height .5s ease",t.style.height="0",t.addEventListener("transitionend",e)}})},v=(r(403),r(42)),component=Object(v.a)(h,(function(){var t=this,e=t._self._c;return e("div",{staticClass:"cell is-scrollable is-fluid is-horizontal",attrs:{id:"page-rule"}},[e("div",{staticClass:"cell is-tertiary is-scrollable sidebar",class:{show:t.showMobileSidebar}},[e("div",{staticClass:"ts-content"},[e("div",{staticClass:"ts-wrap is-vertical has-top-padded"},[e("button",{staticClass:"ts-close is-large mobile-only close-sidebar",attrs:{"aria-label":"關閉此彈出視窗"},on:{click:function(e){t.showMobileSidebar=!t.showMobileSidebar}}}),t._v(" "),e("div",[e("div",{staticClass:"ts-text is-label has-bottom-padded-small"},[t._v("入學學年度")]),t._v(" "),e("div",{staticClass:"ts-select is-fluid"},[e("select",{directives:[{name:"model",rawName:"v-model",value:t.currentYear,expression:"currentYear"}],attrs:{"aria-label":"入學學年度"},on:{change:[function(e){var r=Array.prototype.filter.call(e.target.options,(function(t){return t.selected})).map((function(t){return"_value"in t?t._value:t.value}));t.currentYear=e.target.multiple?r:r[0]},function(e){return t.chooseYear()}]}},t._l(t.years,(function(r){return e("option",{domProps:{value:r}},[t._v(t._s(r+" (U"+r.toString().substring(1,4)+")"))])})),0)])]),t._v(" "),e("div",[e("div",{staticClass:"ts-text is-label has-bottom-padded-small"},[t._v("入學系所/學程/組別")]),t._v(" "),e("div",{staticClass:"ts-select is-fluid"},[e("select",{directives:[{name:"model",rawName:"v-model",value:t.currentDept,expression:"currentDept"}],attrs:{"aria-label":"入學系所/學程/組別"},on:{change:[function(e){var r=Array.prototype.filter.call(e.target.options,(function(t){return t.selected})).map((function(t){return"_value"in t?t._value:t.value}));t.currentDept=e.target.multiple?r:r[0]},function(e){return t.chooseDept()}]}},t._l(t.depts[t.currentYear],(function(r,n){return e("optgroup",{attrs:{label:n}},t._l(r,(function(r,n){return e("option",{domProps:{value:n}},[t._v(t._s(r))])})),0)})),0)])]),t._v(" "),""!=t.currentDept?e("div",[e("div",{staticClass:"ts-text is-label has-bottom-padded-small"},[t._v("系所/學分學程總表")]),t._v(" "),e("div",{staticClass:"ts-select is-fluid"},[e("select",{directives:[{name:"model",rawName:"v-model",value:t.currentRule,expression:"currentRule"}],attrs:{"aria-label":"系所/學分學程總表"},on:{change:[function(e){var r=Array.prototype.filter.call(e.target.options,(function(t){return t.selected})).map((function(t){return"_value"in t?t._value:t.value}));t.currentRule=e.target.multiple?r:r[0]},function(e){return t.saveRuleInput()}]}},[e("option",{attrs:{value:"-1",disabled:""}},[t._v("請選擇...")]),t._v(" "),t._l(t.rules[t.currentYear]._,(function(r,n){return r.name==t.currentDeptName?e("option",{attrs:{value:"000"}},[t._v("系所課程總表")]):t._e()})),t._v(" "),t._l(t.rules[t.currentYear],(function(r,n){return"_"!=n?e("optgroup",{attrs:{label:n}},t._l(r,(function(r,n){return e("option",{attrs:{disabled:r.hide_for==t.currentDeptName},domProps:{value:n}},[t._v(t._s(r.name))])})),0):t._e()}))],2)])]):t._e(),t._v(" "),"-1"!=t.currentRule?e("div",[e("div",{staticClass:"ts-text is-label has-bottom-padded-small"},[t._v("欲選課學期")]),t._v(" "),e("div",{staticClass:"ts-select is-fluid"},[e("select",{directives:[{name:"model",rawName:"v-model",value:t.currentRuleTerm,expression:"currentRuleTerm"}],attrs:{"aria-label":"欲選課學期"},on:{change:[function(e){var r=Array.prototype.filter.call(e.target.options,(function(t){return t.selected})).map((function(t){return"_value"in t?t._value:t.value}));t.currentRuleTerm=e.target.multiple?r:r[0]},function(e){return t.changeTerm()}]}},t._l(t.terms,(function(r){return e("option",[t._v(t._s(r))])})),0)])]):t._e()])])]),t._v(" "),t.notFound?e("div",{staticClass:"cell is-secondary is-fluid is-scrollable",staticStyle:{"min-height":"100%",display:"flex","align-items":"center"}},[e("div",{staticClass:"ts-container",staticStyle:{display:"flex","flex-direction":"column","align-items":"center"}},[t._m(0),t._v(" "),e("div",{staticClass:"ts-text is-center-aligned has-top-padded"},[t._v("\n\t\t\t\t此連結可能已失效，請點擊上方選單中的其他連結，或選擇其他課程總表。\n\t\t\t")]),t._v(" "),e("button",{staticClass:"ts-button is-secondary is-end-labeled-icon mobile-only has-top-spaced",on:{click:function(e){t.showMobileSidebar=!t.showMobileSidebar}}},[t._v("選擇課程總表\n\t\t\t\t"),e("span",{staticClass:"ts-icon is-chevron-down-icon"})])]),t._v(" "),e("div",{directives:[{name:"show",rawName:"v-show",value:t.showMobileSidebar,expression:"showMobileSidebar"}],staticClass:"ts-mask",on:{click:function(e){t.showMobileSidebar=!t.showMobileSidebar}}})]):e("div",{staticClass:"cell is-secondary is-fluid is-scrollable",staticStyle:{"min-height":"100%"}},[e("div",{staticClass:"ts-container has-top-padded-large is-fitted mobile-padded"},[e("h1",{staticClass:"ts-header is-huge has-top-padded has-bottom-padded-large"},[t._v("\n\t\t\t\t畢業學分門檻\n\t\t\t\t"),"-1"!=t.currentRule?e("div",{staticClass:"print-only",staticStyle:{"margin-left":"1rem"}},["000"==t.currentRule?[t._v("\n\t\t\t\t\t\t"+t._s(t.currentYear)+" 入學 /\n\t\t\t\t\t\t"+t._s(t.currentDeptName)+"\n\t\t\t\t\t")]:[t._v("\n\t\t\t\t\t\t"+t._s(t.currentYear)+" 入學 /\n\t\t\t\t\t\t"+t._s(t.currentRuleName)+"\n\t\t\t\t\t")]],2):t._e()]),t._v(" "),e("button",{staticClass:"ts-button is-fluid is-secondary is-end-labeled-icon mobile-only",on:{click:function(e){t.showMobileSidebar=!t.showMobileSidebar}}},["-1"==t.currentRule?[t._v("選擇課程總表")]:"000"==t.currentRule?[t._v("\n\t\t\t\t\t"+t._s(t.currentYear)+" 入學 /\n\t\t\t\t\t"+t._s(t.currentDeptName)+"\n\t\t\t\t")]:[t._v("\n\t\t\t\t\t"+t._s(t.currentYear)+" 入學 /\n\t\t\t\t\t"+t._s(t.currentRuleName)+"\n\t\t\t\t")],t._v(" "),e("span",{staticClass:"ts-icon is-chevron-down-icon"})],2)]),t._v(" "),e("div",{staticClass:"ts-container is-fitted"},[e("div",{staticClass:"ts-box has-vertically-spaced-large"},[e("div",{staticClass:"ts-content"},[e("span",{staticClass:"ts-badge has-bottom-spaced-small is-small is-dense"},[t._v("注意事項")]),t._v(" "),e("div",{staticClass:"ts-list is-ordered"},[t._m(1),t._v(" "),e("div",{staticClass:"item"},[t._v("須修畢你的"),e("b",[t._v("「系所學程總表」")]),t.currentDeptName&&!(t.currentDeptName.includes("博士")||t.currentDeptName.includes("碩士")||t.currentDeptName.includes("在職專班")||t.currentDeptName.includes("國際學生專班")||t.currentDeptName.includes("菁英班")||t.currentDeptName.includes("學位學程"))?e("span",[t._v("，並須"),e("b",[t._v("任選一個學分學程（跨領域或第二專長）")])]):t._e(),t._v("才能畢業。\n\t\t\t\t\t\t")]),t._v(" "),e("div",{staticClass:"item"},[t._v("點擊各分類即可展開該分類課程。")]),t._v(" "),t._m(2),t._v(" "),t._m(3)])])]),t._v(" "),t.loading?e("div",{staticClass:"ts-header is-icon is-center-aligned has-vertically-padded-large"},[e("span",{staticClass:"ts-icon is-spinning is-spinner-icon"}),t._v(" "),e("div",{staticClass:"has-top-padded-small"},[t._v("讀取中...")])]):t._e(),t._v(" "),t.loading||"-1"==t.currentRule?t._e():[t._l(t.rule.data,(function(r){return t.rule.data?e("div",{staticClass:"ts-box has-vertically-spaced-large"},[e("div",{staticClass:"ts-content is-tertiary is-dense"},[t._v("\n\t\t\t\t\t\t"+t._s(r.name.split("（")[0])+"\n\t\t\t\t\t\t"),e("span",{staticClass:"ts-badge is-small is-dense is-start-spaced"},[t._v("\n\t\t\t\t\t\t\t"+t._s(r.name.split("（")[1].split("）")[0].replace(/([\x00-\xFF]+)(?=[^\x00-\xff])/g," $1 "))+"\n\t\t\t\t\t\t")])]),t._v(" "),t._l(r.data,(function(r){return[e("div",{staticClass:"ts-content is-secondary is-dense rule_subtype_name",on:{click:function(t){r.show=!r.show}}},[t._v("\n\t\t\t\t\t\t\t・\n\t\t\t\t\t\t\t"+t._s(r.name.split("（")[0])+"\n\t\t\t\t\t\t\t"),e("span",{staticClass:"ts-badge is-small is-dense is-outlined is-start-spaced"},[t._v("\n\t\t\t\t\t\t\t\t"+t._s(r.name.split("（")[1].split("）")[0].replace(/([\x00-\xFF]+)(?=[^\x00-\xff])/g," $1 "))+"\n\t\t\t\t\t\t\t")]),t._v(" "),e("span",{staticClass:"ts-icon",class:{"is-angle-down-icon":!r.show,"is-angle-up-icon":r.show}})]),t._v(" "),e("transition",{attrs:{name:"slide"},on:{"before-enter":t.beforeSlide,enter:t.slideIn,leave:t.slideOut}},[e("div",{directives:[{name:"show",rawName:"v-show",value:r.show,expression:"rule_subtype.show"}],staticClass:"rule_subtype"},[e("table",{staticClass:"ts-table"},[e("tbody",t._l(r.data,(function(r){return e("tr",{class:{"is-not-clickable":0==t.findCourses(r.id).length},on:{click:function(e){return t.showFindCourse(r.id)}}},[e("td",[t._v(t._s(r.name))]),t._v(" "),e("td",[t._v(t._s(r.term))]),t._v(" "),e("td",[t._v(t._s(r.credit)+" 學分")]),t._v(" "),e("td",{staticClass:"ts-text is-description"},[t.courses&&t.findCourses(r.id).length>=1?[t._v("\n\t\t\t\t\t\t\t\t\t\t\t\t\t"+t._s(t.findCourses(r.id).length)+" 門相符課程\n\t\t\t\t\t\t\t\t\t\t\t\t\t"),e("span",{staticClass:"ts-icon is-angle-right-icon"})]:t._e()],2),t._v(" "),e("td",{staticClass:"r-remark"},[["永續發展與社會實踐","經典教育與社會實踐"].includes(r.name)?e("span",{on:{click:function(e){return e.stopPropagation(),t.showInfo(r.name)}}},[t._v("\n\t\t\t\t\t\t\t\t\t\t\t\t\t通識中心 X+1 課程，詳細說明 "),e("span",{staticClass:"ts-icon is-angle-right-icon"})]):r.remark&&""!=r.remark.trim()?e("span",[t._v("\n\t\t\t\t\t\t\t\t\t\t\t\t\t"+t._s(r.remark)+"\n\t\t\t\t\t\t\t\t\t\t\t\t")]):t._e()])])})),0)])])])]}))],2):t._e()})),t._v(" "),t.showAd?e("div",{staticClass:"ts-box ad is-hollowed box-mobile-spaced"},[t._m(4)]):t._e(),t._v(" "),t.rule.remark&&t.rule.remark.length>0?e("div",{staticClass:"ts-box has-vertically-spaced-large"},[e("div",{staticClass:"ts-content",attrs:{id:"remark"}},[e("span",{staticClass:"ts-badge has-bottom-spaced-small is-small is-dense"},[t._v("說明")]),t._v(" "),t._l(t.rule.remark,(function(r){return e("div",{domProps:{innerHTML:t._s(t.formatRemark(r))}})}))],2)]):t._e(),t._v(" "),t.rule.data&&"000"!=t.currentRule?e("div",{staticClass:"ts-box has-vertically-spaced-large"},[e("div",{staticClass:"ts-content"},[e("span",{staticClass:"ts-badge has-bottom-spaced is-small is-dense"},[t._v("檔案下載")]),t._v(" "),e("div",{staticClass:"ts-wrap is-dense"},[Object.values(t.rules[t.currentYear]["跨領域"]).find((function(e){return e.name==t.currentRuleName}))?e("a",{staticClass:"ts-button is-small is-dense is-short is-secondary is-start-icon",attrs:{href:"https://info.mcut.edu.tw/update/data/A231020008.docx",target:"_blank"}},[e("span",{staticClass:"ts-icon is-download-icon"}),t._v("學分學程實施辦法\n\t\t\t\t\t\t\t")]):t._e(),t._v(" "),Object.values(t.rules[t.currentYear]["第二專長"]).find((function(e){return e.name==t.currentRuleName}))?e("a",{staticClass:"ts-button is-small is-dense is-short is-secondary is-start-icon",attrs:{href:"https://info.mcut.edu.tw/update/data/A231160002.pdf",target:"_blank"}},[e("span",{staticClass:"ts-icon is-download-icon"}),t._v("學生修讀第二專長實施辦法\n\t\t\t\t\t\t\t")]):t._e(),t._v(" "),t.rule.file&&""!=t.rule.file?e("a",{staticClass:"ts-button is-small is-dense is-short is-secondary is-start-icon",attrs:{href:"https://info.mcut.edu.tw/update/%e8%a6%8f%e7%ab%a0%e9%a1%9e%e6%96%87%e4%bb%b6%e4%b8%8b%e8%bc%89.aspx?id="+t.rule.file,target:"_blank"}},[e("span",{staticClass:"ts-icon is-download-icon"}),t._v("本學分學程實施要點\n\t\t\t\t\t\t\t")]):t._e()])])]):t._e(),t._v(" "),t.rule.contact?e("div",{staticClass:"ts-box has-vertically-spaced-large"},[e("div",{staticClass:"ts-content"},[e("span",{staticClass:"ts-badge has-bottom-spaced-small is-small is-dense"},[t._v("承辦人")]),e("br"),t._v("\n\t\t\t\t\t\t"+t._s(t.rule.contact[0]+" "+t.rule.contact[1])),e("br"),t._v(" "),e("a",{attrs:{href:"tel:0229089899,"+t.rule.contact[2]}},[t._v("(02) 2908-9899 #"+t._s(t.rule.contact[2]))])])]):t._e()]],2),t._v(" "),e("div",{directives:[{name:"show",rawName:"v-show",value:t.showMobileSidebar,expression:"showMobileSidebar"}],staticClass:"ts-mask",on:{click:function(e){t.showMobileSidebar=!t.showMobileSidebar}}})])])}),[function(){var t=this._self._c;return t("div",{staticClass:"ts-header is-icon is-center-aligned is-big"},[t("span",{staticClass:"ts-icon ts-icon is-circle-exclamation-icon"}),this._v("\n\t\t\t\t找不到此課程總表\n\t\t\t")])},function(){var t=this,e=t._self._c;return e("div",{staticClass:"item"},[t._v("請先選擇"),e("b",[t._v("「入學學年度」")]),t._v("及"),e("b",[t._v("「入學系所/學程/組別」")]),t._v("。")])},function(){var t=this,e=t._self._c;return e("div",{staticClass:"item"},[t._v("欲選課前切換"),e("b",[t._v("「欲選課學期」")]),t._v("，即可查看該學期是否有開課。")])},function(){var t=this,e=t._self._c;return e("div",{staticClass:"item"},[t._v("此頁面僅提供"),e("b",[t._v("「畢業學分門檻」")]),t._v("，其他畢業門檻（如路跑、英文等）請見學校規定。")])},function(){var t=this,e=t._self._c;return e("div",{staticClass:"ts-content"},[e("div",{staticClass:"ts-text is-description has-bottom-padded-small"},[t._v("贊助商")]),t._v(" "),e("script",{attrs:{async:"",src:"https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5900703871265800",crossorigin:"anonymous",onerror:"document.querySelector('.ad .ts-content').innerHTML='<div class=\"ts-text is-description has-bottom-padded-small\">贊助商</div><div class=\"ts-text is-secondary is-center-aligned has-vertically-padded\">太無情了吧，擋廣告 😭<br>加入白名單，救救開發者 🙏</div>';"}}),t._v(" "),e("ins",{staticClass:"adsbygoogle",staticStyle:{display:"block","text-align":"center"},attrs:{"data-ad-layout":"in-article","data-ad-format":"fluid","data-ad-client":"ca-pub-5900703871265800","data-ad-slot":"3164180037"}}),t._v(" "),e("script",[t._v("\n\t\t\t\t\t\t\t(adsbygoogle = window.adsbygoogle || []).push({});\n\t\t\t\t\t\t")])])}],!1,null,null,null);e.default=component.exports}}]);