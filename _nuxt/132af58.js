(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{316:function(t,e,r){"use strict";var n=r(2),l=r(74).find,o=r(147),c="find",d=!0;c in[]&&Array(1)[c]((function(){d=!1})),n({target:"Array",proto:!0,forced:d},{find:function(t){return l(this,t,arguments.length>1?arguments[1]:void 0)}}),o(c)},339:function(t,e,r){"use strict";var n=r(2),l=r(226).values;n({target:"Object",stat:!0},{values:function(t){return l(t)}})},340:function(t,e,r){var content=r(392);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(114).default)("2641c83c",content,!0,{sourceMap:!1})},391:function(t,e,r){"use strict";r(340)},392:function(t,e,r){var n=r(113)((function(i){return i[1]}));n.push([t.i,"#page-rule .ts-box .ts-icon.is-angle-down-icon,#page-rule .ts-box .ts-icon.is-angle-up-icon{float:right}#page-rule li{line-height:1.4rem;padding:4px 0}#page-rule ol{padding-left:0}#page-rule ol ::marker{color:var(--ts-gray-500)}#page-rule td:first-child{width:40%}#page-rule td:nth-child(2){width:4rem}#page-rule td:nth-child(3){width:6rem}#page-rule td:nth-child(4){width:9rem}#page-rule .rule_subtype{overflow:hidden}#page-rule .rule_subtype_name:hover{cursor:pointer}#page-rule td.r-remark{color:var(--ts-gray-500);font-size:.8rem}#page-rule tr:hover{background-color:var(--ts-gray-100);cursor:pointer}#page-rule tr.is-not-clickable:hover{background-color:transparent;cursor:default}@media screen and (max-width:768px){#page-rule .is-scrollable{overflow-y:visible;overflow-y:initial}#page-rule,#page-rule tbody,#page-rule td,#page-rule tfoot,#page-rule th,#page-rule tr{display:block}#page-rule tr:hover{background-color:transparent}#page-rule tr td{padding:.05rem 1rem}#page-rule td:first-child,#page-rule td:nth-child(2),#page-rule td:nth-child(3),#page-rule td:nth-child(4){display:inline-block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#page-rule td:first-child{width:calc(100% - 12rem)}#page-rule td:nth-child(2),#page-rule td:nth-child(3){padding:0;text-align:right}#page-rule td:nth-child(4){width:100%}#page-rule td:empty{display:none}#page-rule td:first-child{padding-top:.4rem}#page-rule td:last-child{padding-bottom:.4rem}}@media print{.sidebar{display:none;width:0}.rule_subtype{display:block!important}#page-rule td:nth-child(2){width:5rem}#page-rule .ts-box .ts-icon.is-angle-down-icon,#page-rule .ts-box .ts-icon.is-angle-up-icon{display:none}}",""]),n.locals={},t.exports=n},403:function(t,e,r){"use strict";r.r(e);r(47),r(316),r(53),r(56),r(32),r(17),r(339),r(27),r(38),r(54),r(72);var n=r(12),l=(r(73),r(149),r(57),r(35),r(156),r(37),r(60),{asyncData:function(t){return Object(n.a)(regeneratorRuntime.mark((function e(){var r,n,l,o,c,d,h,v,m,f;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(r=t.$axios,t.params,n=t.payload,l={},o={},c=[],d=[],h="",!n){e.next=13;break}l=n.depts,o=n.rules,d=n.terms,h=n.name,e.next=20;break;case 13:return e.next=15,r.get("https://api.mcut-course.com/rule/list2.php");case 15:v=e.sent,l=v.data.depts,o=v.data.rules,d=v.data.terms,h="";case 20:for(m=(new Date).getFullYear()-1911,(new Date).getMonth()<8&&m--,f=m;f>=108;f--)c.push(f);return e.abrupt("return",{depts:l,rules:o,years:c,terms:d,currentRuleName:h});case 24:case"end":return e.stop()}}),e)})))()},data:function(){return{currentYear:"",currentDept:"",currentRule:"",currentRuleTerm:"",currentRuleName:"",rules:{},rule:{},terms:[],years:[],allAourses:[],loading:!0,showMobileSidebar:!1}},head:function(){var t=this.currentYear||this.$route.params.year;return{title:(t?t+" 學年度入學 - ":"")+(this.currentRuleName||"")+"課程總表 | 明志科技大學選課小幫手",meta:[{hid:"og:title",property:"og:title",content:(t?t+" 學年度入學 - ":"")+(this.currentRuleName||"")+"課程總表 | 明志科技大學選課小幫手"},{hid:"twitter:title",name:"twitter:title",content:(t?t+" 學年度入學 - ":"")+(this.currentRuleName||"")+"課程總表 | 明志科技大學選課小幫手"},{hid:"og:url",property:"og:url",content:"https://mcut-course.com"+this.$router.currentRoute.path},{hid:"og:image",property:"og:image",content:"https://og.mcut-course.com"+this.$router.currentRoute.path+".jpg?t="+Date.now()},{hid:"twitter:image",name:"twitter:image",content:"https://og.mcut-course.com"+this.$router.currentRoute.path+".jpg?t="+Date.now()}]}},computed:{currentDeptName:function(){var t,e=this;return""==this.currentDept?"":null===(t=Object.values(this.depts[this.currentYear]).find((function(t){return e.currentDept in t})))||void 0===t?void 0:t[this.currentDept]},findCourses:function(){var t=this;return function(e){return t.courses?t.courses.filter((function(r){return r.id.includes(t.currentRuleTerm.replace("-","")+e)})):[]}}},mounted:function(){this.init()},methods:{init:function(){var t=this;return Object(n.a)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:t.$route.params.id?(t.currentYear=t.$route.params.year,t.currentDept=t.$route.params.dept,t.currentRule=t.$route.params.id):(t.currentYear=localStorage.ruleYear||t.years[0],t.currentDept=localStorage.ruleDept||Object.keys(Object.values(t.depts[t.currentYear])[0])[0],t.currentRule=localStorage.ruleRule||"-1"),t.terms.includes(localStorage.ruleTerm)?t.currentRuleTerm=localStorage.ruleTerm:t.terms.includes(localStorage.term)&&(t.currentRuleTerm=localStorage.term),""==t.currentRuleTerm&&(t.currentRuleTerm=t.terms[0]),t.loading=!1,t.saveRuleInput();case 6:case"end":return e.stop()}}),e)})))()},saveRuleInput:function(){"-1"!=this.currentRule&&(localStorage.ruleYear=this.currentYear,localStorage.ruleDept=this.currentDept,localStorage.ruleRule=this.currentRule,this.$route.path!="/rule/"+this.currentYear+"/"+this.currentDept+"/"+this.currentRule+"/"&&history.replaceState([],"","/rule/"+this.currentYear+"/"+this.currentDept+"/"+this.currentRule+"/"),this.getRule())},chooseYear:function(){this.currentDeptName||(this.currentDept=Object.keys(Object.values(this.depts[this.currentYear])[0])[0]),this.currentRule=-1,history.replaceState([],"","/rule/")},chooseDept:function(){this.currentRule=-1,history.replaceState([],"","/rule/")},getRule:function(){var t,e=this;this.loading=!0,"000"==this.currentRule?this.currentRuleName=this.currentDeptName:this.currentRuleName=null===(t=Object.values(this.rules[this.currentYear]).find((function(t){return e.currentRule in t})))||void 0===t?void 0:t[this.currentRule].name,this.$axios.get("https://api.mcut-course.com/rule/get.php?year="+this.currentYear+"&dept="+this.currentDept+"&rule="+this.currentRule).then((function(t){e.rule=t.data,e.initializeShowProperty(),e.loading=!1})),this.changeTerm()},initializeShowProperty:function(){var t=this;this.rule&&this.rule.data&&(this.rule.data.forEach((function(e){e.data.forEach((function(e){t.$set(e,"show",!1)}))})),setTimeout((function(){document.querySelector(".adsbygoogle")&&0==document.querySelector(".adsbygoogle").offsetHeight&&(document.querySelector(".ad .ts-content").innerHTML='<div class="ts-text is-description has-bottom-padded-small">贊助商</div>\t\t\t\t\t<div class="ts-text is-secondary is-center-aligned has-vertically-padded">太無情了吧擋廣告 :(</div>')}),500))},formatRemark:function(t){var e=[],r=t.split("\r\n"),n=[];r.forEach((function(t){"<br />"!=t&&(0===t.search(/\d{1,2}\s/)?(n.push(["s",t.slice(t.split(" ")[0].length+1),"'"+t.split(" ")[0]+". '"]),e.includes("s")||e.push("s")):0===t.search(/\d{1,2}\./)?(n.push(["d",t.slice(t.split(".")[0].length+1),"'"+t.split(".")[0]+". '"]),e.includes("d")||e.push("d")):0===t.search(/.{1,2}、/)?(n.push(["c",t.slice(t.split("、")[0].length+1),"'"+t.split("、")[0]+"、'"]),e.includes("c")||e.push("c")):0===t.search(/\*/)?(n.push(["b",t.slice(1),"' • '"]),e.includes("b")||e.push("b")):0===t.search(/\(\d{1,2}\)/)?(n.push(["q",t.slice(t.split(")")[0].length+1),"'"+t.split(")")[0]+") '"]),e.includes("q")||e.push("q")):(n.push(["n",t,"none"]),e.includes("n")||e.push("n")))}));var l=0,o={};e.forEach((function(style){l+="n"==style?0:"c"==style?35:20,o[style]=l}));var output="<ol>";return output+=n.map((function(t){return'<li class="'+t[0]+'" style="margin-left:'+o[t[0]]+"px;list-style-type:"+t[2]+'">'+t[1]+"</li>"})).join(""),output+="</ul>"},changeTerm:function(){var t=this;this.initializeShowProperty(),localStorage.ruleTerm=this.currentRuleTerm;var e=(new Date).getTime(),r=localStorage["courseData_"+this.currentRuleTerm],n=localStorage["courseDataTime_"+this.currentRuleTerm];r&&n&&e-n<18e5?this.courses=JSON.parse(r).course:(this.loading=!0,this.$axios.get("https://api.mcut-course.com/list.php?term="+this.currentRuleTerm).then((function(r){localStorage["courseData_"+t.currentRuleTerm]=JSON.stringify(r.data),localStorage["courseDataTime_"+t.currentRuleTerm]=e,t.courses=r.data.course,t.loading=!1})))},showFindCourse:function(t){var e,r=this;if(0!=this.findCourses(t).length){var n=JSON.parse(null!==(e=localStorage.savedCourse)&&void 0!==e?e:"[]")||[];n.length>=1&&n[0].substring(0,4)!=this.currentRuleTerm.replace("-","")?this.$swal({icon:"warning",title:"欲選課學期與收藏的課程學期不同",html:"目前收藏的課程為 "+n[0].substring(0,3)+"-"+n[0].substring(3,4)+" 學期，是否要清空並切換至 "+this.currentRuleTerm+" 學期以檢視相符的課程？",confirmButtonText:"切換並檢視",cancelButtonText:"取消",showCancelButton:!0}).then((function(e){e.isConfirmed&&(localStorage.savedCourse="[]",localStorage.term=r.currentRuleTerm,localStorage.searchQuery=t,localStorage.dept="",localStorage.class="",localStorage.type="",r.$router.push("/course/"))})):(localStorage.term=this.currentRuleTerm,localStorage.searchQuery=t,localStorage.dept="",localStorage.class="",localStorage.type="",this.$router.push("/course/"))}},showInfo:function(t){var e=this;["永續發展與社會實踐","經典教育與社會實踐"].includes(t)&&this.$swal({title:t+" 開課方式",html:'<div style="text-align:left">\t\t\t\t\t<div class="ts-header is-large">1. 與通識必選課結合 (X+1)</div>\t\t\t\t\t<p>在大一、大二的必修（如國文、英文、體育）或通識選修開學時，由老師詢問同學修課意願（依任課老師意願，不是每堂課都會詢問），達 15 人以上即可開設。</p>\t\t\t\t\t<div class="ts-header is-large">2. 由通識中心開設課程</div>\t\t\t\t\t<p style="margin-bottom:0">課程會開設在大三及大四，類似通識選修，將於選課系統上供學生選課。</p>\t\t\t\t\t</div>',showConfirmButton:this.findCourses("00700F"),confirmButtonText:"查看 "+this.currentRuleTerm+" 開課課程",showCloseButton:!0}).then((function(t){t.isConfirmed&&e.showFindCourse("00700F")}))},beforeSlide:function(t){t.style.height="0"},slideIn:function(t,e){t.offsetHeight,t.style.transition="height .5s ease",t.style.height=t.scrollHeight+"px",t.addEventListener("transitionend",e)},slideOut:function(t,e){t.style.transition="height .5s ease",t.style.height="0",t.addEventListener("transitionend",e)}}}),o=(r(391),r(34)),component=Object(o.a)(l,(function(){var t=this,e=t._self._c;return e("div",{staticClass:"cell is-scrollable is-fluid is-horizontal",attrs:{id:"page-rule"}},[e("div",{staticClass:"cell is-tertiary is-scrollable sidebar",class:{show:t.showMobileSidebar}},[e("div",{staticClass:"ts-content"},[e("div",{staticClass:"ts-wrap is-vertical has-top-padded"},[e("button",{staticClass:"ts-close is-large mobile-only close-sidebar",on:{click:function(e){t.showMobileSidebar=!t.showMobileSidebar}}}),t._v(" "),e("div",[e("div",{staticClass:"ts-text is-label has-bottom-padded-small"},[t._v("入學學年度")]),t._v(" "),e("div",{staticClass:"ts-select is-fluid"},[e("select",{directives:[{name:"model",rawName:"v-model",value:t.currentYear,expression:"currentYear"}],on:{change:[function(e){var r=Array.prototype.filter.call(e.target.options,(function(t){return t.selected})).map((function(t){return"_value"in t?t._value:t.value}));t.currentYear=e.target.multiple?r:r[0]},function(e){return t.chooseYear()}]}},t._l(t.years,(function(r){return e("option",{domProps:{value:r}},[t._v(t._s(r+" (U"+r.toString().substring(1,4)+")"))])})),0)])]),t._v(" "),e("div",[e("div",{staticClass:"ts-text is-label has-bottom-padded-small"},[t._v("入學系所/學程/組別")]),t._v(" "),e("div",{staticClass:"ts-select is-fluid"},[e("select",{directives:[{name:"model",rawName:"v-model",value:t.currentDept,expression:"currentDept"}],on:{change:[function(e){var r=Array.prototype.filter.call(e.target.options,(function(t){return t.selected})).map((function(t){return"_value"in t?t._value:t.value}));t.currentDept=e.target.multiple?r:r[0]},function(e){return t.chooseDept()}]}},t._l(t.depts[t.currentYear],(function(r,n){return e("optgroup",{attrs:{label:n}},t._l(r,(function(r,n){return e("option",{domProps:{value:n}},[t._v(t._s(r))])})),0)})),0)])]),t._v(" "),""!=t.currentDept?e("div",[e("div",{staticClass:"ts-text is-label has-bottom-padded-small"},[t._v("系所/學分學程總表")]),t._v(" "),e("div",{staticClass:"ts-select is-fluid"},[e("select",{directives:[{name:"model",rawName:"v-model",value:t.currentRule,expression:"currentRule"}],on:{change:[function(e){var r=Array.prototype.filter.call(e.target.options,(function(t){return t.selected})).map((function(t){return"_value"in t?t._value:t.value}));t.currentRule=e.target.multiple?r:r[0]},function(e){return t.saveRuleInput()}]}},[e("option",{attrs:{value:"-1",disabled:""}},[t._v("請選擇...")]),t._v(" "),t._l(t.rules[t.currentYear]._,(function(r,n){return r.name==t.currentDeptName?e("option",{attrs:{value:"000"}},[t._v("系所課程總表")]):t._e()})),t._v(" "),t._l(t.rules[t.currentYear],(function(r,n){return"_"!=n?e("optgroup",{attrs:{label:n}},t._l(r,(function(r,n){return e("option",{attrs:{disabled:r.hide_for==t.currentDeptName},domProps:{value:n}},[t._v(t._s(r.name))])})),0):t._e()}))],2)])]):t._e(),t._v(" "),"-1"!=t.currentRule?e("div",[e("div",{staticClass:"ts-text is-label has-bottom-padded-small"},[t._v("欲選課學期")]),t._v(" "),e("div",{staticClass:"ts-select is-fluid"},[e("select",{directives:[{name:"model",rawName:"v-model",value:t.currentRuleTerm,expression:"currentRuleTerm"}],on:{change:[function(e){var r=Array.prototype.filter.call(e.target.options,(function(t){return t.selected})).map((function(t){return"_value"in t?t._value:t.value}));t.currentRuleTerm=e.target.multiple?r:r[0]},function(e){return t.changeTerm()}]}},t._l(t.terms,(function(r){return e("option",[t._v(t._s(r))])})),0)])]):t._e()])])]),t._v(" "),e("div",{staticClass:"cell is-secondary is-fluid is-scrollable",staticStyle:{"min-height":"100%"}},[e("div",{staticClass:"ts-container has-top-padded-large is-fitted mobile-padded"},[e("h1",{staticClass:"ts-header is-huge has-top-padded has-bottom-padded-large"},[t._v("畢業學分門檻")]),t._v(" "),e("button",{staticClass:"ts-button is-fluid is-secondary is-end-labeled-icon mobile-only",on:{click:function(e){t.showMobileSidebar=!t.showMobileSidebar}}},["-1"==t.currentRule?[t._v("選擇一個課程總表")]:"000"==t.currentRule?[t._v("\n\t\t\t\t\t"+t._s(t.currentYear)+" 入學 /\n\t\t\t\t\t"+t._s(t.currentDeptName)+"\n\t\t\t\t")]:[t._v("\n\t\t\t\t\t"+t._s(t.currentYear)+" 入學 /\n\t\t\t\t\t"+t._s(t.currentRuleName)+"\n\t\t\t\t")],t._v(" "),e("span",{staticClass:"ts-icon is-chevron-down-icon"})],2)]),t._v(" "),e("div",{staticClass:"ts-container is-fitted"},[e("div",{staticClass:"ts-box has-vertically-spaced-large"},[e("div",{staticClass:"ts-content"},[e("span",{staticClass:"ts-badge has-bottom-spaced-small is-small is-dense"},[t._v("注意事項")]),t._v(" "),e("div",{staticClass:"ts-list is-ordered"},[t._m(0),t._v(" "),e("div",{staticClass:"item"},[t._v("須修畢你的"),e("b",[t._v("「系所學程總表」")]),t.currentDeptName&&!(t.currentDeptName.includes("博士")||t.currentDeptName.includes("碩士")||t.currentDeptName.includes("在職專班")||t.currentDeptName.includes("國際學生專班")||t.currentDeptName.includes("菁英班")||t.currentDeptName.includes("學位學程"))?e("span",[t._v("，並須"),e("b",[t._v("任選一個學分學程（跨領域或第二專長）")])]):t._e(),t._v("才能畢業。\n\t\t\t\t\t\t")]),t._v(" "),e("div",{staticClass:"item"},[t._v("點擊各分類即可展開該分類課程。")]),t._v(" "),t._m(1),t._v(" "),t._m(2)])])]),t._v(" "),t.loading?e("div",{staticClass:"ts-header is-icon is-center-aligned has-vertically-padded-large"},[e("span",{staticClass:"ts-icon is-spinning is-spinner-icon"}),t._v(" "),e("div",{staticClass:"has-top-padded-small"},[t._v("讀取中...")])]):t._e(),t._v(" "),t.loading||"-1"==t.currentRule?t._e():[t._l(t.rule.data,(function(r){return t.rule.data?e("div",{staticClass:"ts-box has-vertically-spaced-large"},[e("div",{staticClass:"ts-content is-tertiary is-dense"},[t._v("\n\t\t\t\t\t\t"+t._s(r.name.split("（")[0])+"\n\t\t\t\t\t\t"),e("span",{staticClass:"ts-badge is-small is-dense is-start-spaced"},[t._v("\n\t\t\t\t\t\t\t"+t._s(r.name.split("（")[1].split("）")[0].replace(/([\x00-\xFF]+)(?=[^\x00-\xff])/g," $1 "))+"\n\t\t\t\t\t\t")])]),t._v(" "),t._l(r.data,(function(r){return[e("div",{staticClass:"ts-content is-secondary is-dense rule_subtype_name",on:{click:function(t){r.show=!r.show}}},[t._v("\n\t\t\t\t\t\t\t・\n\t\t\t\t\t\t\t"+t._s(r.name.split("（")[0])+"\n\t\t\t\t\t\t\t"),e("span",{staticClass:"ts-badge is-small is-dense is-outlined is-start-spaced"},[t._v("\n\t\t\t\t\t\t\t\t"+t._s(r.name.split("（")[1].split("）")[0].replace(/([\x00-\xFF]+)(?=[^\x00-\xff])/g," $1 "))+"\n\t\t\t\t\t\t\t")]),t._v(" "),e("span",{staticClass:"ts-icon",class:{"is-angle-down-icon":!r.show,"is-angle-up-icon":r.show}})]),t._v(" "),e("transition",{attrs:{name:"slide"},on:{"before-enter":t.beforeSlide,enter:t.slideIn,leave:t.slideOut}},[e("div",{directives:[{name:"show",rawName:"v-show",value:r.show,expression:"rule_subtype.show"}],staticClass:"rule_subtype"},[e("table",{staticClass:"ts-table"},[e("tbody",t._l(r.data,(function(r){return e("tr",{class:{"is-not-clickable":0==t.findCourses(r.id).length},on:{click:function(e){return t.showFindCourse(r.id)}}},[e("td",[t._v(t._s(r.name))]),t._v(" "),e("td",[t._v(t._s(r.term))]),t._v(" "),e("td",[t._v(t._s(r.credit)+" 學分")]),t._v(" "),e("td",[t.courses&&t.findCourses(r.id).length>=1?[t._v("\n\t\t\t\t\t\t\t\t\t\t\t\t\t"+t._s(t.findCourses(r.id).length)+" 門相符課程\n\t\t\t\t\t\t\t\t\t\t\t\t\t"),e("span",{staticClass:"ts-icon is-angle-right-icon"})]:t._e()],2),t._v(" "),e("td",{staticClass:"r-remark"},[["永續發展與社會實踐","經典教育與社會實踐"].includes(r.name)?e("span",{on:{click:function(e){return e.stopPropagation(),t.showInfo(r.name)}}},[t._v("\n\t\t\t\t\t\t\t\t\t\t\t\t\t通識中心 X+1 課程，詳細說明 "),e("span",{staticClass:"ts-icon is-angle-right-icon"})]):r.remark?e("span",[t._v("\n\t\t\t\t\t\t\t\t\t\t\t\t\t"+t._s(r.remark)+"\n\t\t\t\t\t\t\t\t\t\t\t\t")]):t._e()])])})),0)])])])]}))],2):t._e()})),t._v(" "),t._m(3),t._v(" "),t.rule.remark&&t.rule.remark.length>0?e("div",{staticClass:"ts-box has-vertically-spaced-large"},[e("div",{staticClass:"ts-content",attrs:{id:"remark"}},[e("span",{staticClass:"ts-badge has-bottom-spaced-small is-small is-dense"},[t._v("說明")]),t._v(" "),t._l(t.rule.remark,(function(r){return e("div",{domProps:{innerHTML:t._s(t.formatRemark(r))}})}))],2)]):t._e(),t._v(" "),t.rule.data&&"000"!=t.currentRule?e("div",{staticClass:"ts-box has-vertically-spaced-large"},[e("div",{staticClass:"ts-content"},[e("span",{staticClass:"ts-badge has-bottom-spaced is-small is-dense"},[t._v("檔案下載")]),t._v(" "),e("div",{staticClass:"ts-wrap is-dense"},[Object.values(t.rules[t.currentYear]["跨領域"]).find((function(e){return e.name==t.currentRuleName}))?e("a",{staticClass:"ts-button is-small is-dense is-short is-secondary is-start-icon",attrs:{href:"https://info.mcut.edu.tw/update/data/A231020008.docx",target:"_blank"}},[e("span",{staticClass:"ts-icon is-download-icon"}),t._v("學分學程實施辦法\n\t\t\t\t\t\t\t")]):t._e(),t._v(" "),Object.values(t.rules[t.currentYear]["第二專長"]).find((function(e){return e.name==t.currentRuleName}))?e("a",{staticClass:"ts-button is-small is-dense is-short is-secondary is-start-icon",attrs:{href:"https://info.mcut.edu.tw/update/data/A231160002.pdf",target:"_blank"}},[e("span",{staticClass:"ts-icon is-download-icon"}),t._v("學生修讀第二專長實施辦法\n\t\t\t\t\t\t\t")]):t._e(),t._v(" "),t.rule.file&&""!=t.rule.file?e("a",{staticClass:"ts-button is-small is-dense is-short is-secondary is-start-icon",attrs:{href:"https://info.mcut.edu.tw/update/%e8%a6%8f%e7%ab%a0%e9%a1%9e%e6%96%87%e4%bb%b6%e4%b8%8b%e8%bc%89.aspx?id="+t.rule.file,target:"_blank"}},[e("span",{staticClass:"ts-icon is-download-icon"}),t._v("本學分學程實施要點\n\t\t\t\t\t\t\t")]):t._e()])])]):t._e(),t._v(" "),t.rule.contact?e("div",{staticClass:"ts-box has-vertically-spaced-large"},[e("div",{staticClass:"ts-content"},[e("span",{staticClass:"ts-badge has-bottom-spaced-small is-small is-dense"},[t._v("承辦人")]),e("br"),t._v("\n\t\t\t\t\t\t"+t._s(t.rule.contact[0]+" "+t.rule.contact[1])),e("br"),t._v(" "),e("a",{attrs:{href:"tel:0229089899,"+t.rule.contact[2]}},[t._v("(02) 2908-9899 #"+t._s(t.rule.contact[2]))])])]):t._e()],t._v(" "),e("br")],2),t._v(" "),e("div",{directives:[{name:"show",rawName:"v-show",value:t.showMobileSidebar,expression:"showMobileSidebar"}],staticClass:"ts-mask",on:{click:function(e){t.showMobileSidebar=!t.showMobileSidebar}}})])])}),[function(){var t=this,e=t._self._c;return e("div",{staticClass:"item"},[t._v("請先選擇"),e("b",[t._v("「入學學年度」")]),t._v("及"),e("b",[t._v("「入學系所/學程/組別」")]),t._v("。")])},function(){var t=this,e=t._self._c;return e("div",{staticClass:"item"},[t._v("欲選課前切換"),e("b",[t._v("「欲選課學期」")]),t._v("，即可查看該學期是否有開課。")])},function(){var t=this,e=t._self._c;return e("div",{staticClass:"item"},[t._v("此頁面僅提供"),e("b",[t._v("「畢業學分門檻」")]),t._v("，其他畢業門檻（如路跑、英文等）請見學校規定。")])},function(){var t=this,e=t._self._c;return e("div",{staticClass:"ts-box ad is-hollowed box-mobile-spaced"},[e("div",{staticClass:"ts-content"},[e("div",{staticClass:"ts-text is-description has-bottom-padded-small"},[t._v("贊助商")]),t._v(" "),e("script",{attrs:{async:"",src:"https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5900703871265800",crossorigin:"anonymous"}}),t._v(" "),e("ins",{staticClass:"adsbygoogle",staticStyle:{display:"block","text-align":"center"},attrs:{"data-ad-layout":"in-article","data-ad-format":"fluid","data-ad-client":"ca-pub-5900703871265800","data-ad-slot":"3164180037"}}),t._v(" "),e("script",[t._v("\n\t\t\t\t\t\t\t(adsbygoogle = window.adsbygoogle || []).push({});\n\t\t\t\t\t\t")])])])}],!1,null,null,null);e.default=component.exports}}]);