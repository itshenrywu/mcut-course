(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{348:function(t,e,o){"use strict";o.r(e);var r=o(23),n=(o(25),o(37),o(36),o(59),o(60),o(30),o(15),o(51),o(31),o(52));function l(t,e){var o=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),o.push.apply(o,r)}return o}var c={props:{mobileOnly:{type:String,default:""}},data:function(){return{profileImage:null,profileName:null}},mounted:function(){var t=this;this.profileImage=localStorage.profile_image,this.profileName=localStorage.profile_name,this.$root.$on("showProfileImage",(function(e){t.profileImage=e,t.profileName=localStorage.profile_name}))},methods:{logout:function(){var t=this;this.$swal.fire({title:"確定要登出嗎？",icon:"warning",showCancelButton:!0,confirmButtonText:"登出",confirmButtonColor:"var(--ts-negative-600)",cancelButtonText:"取消"}).then((function(e){e.isConfirmed&&t.$router.replace("/logout/")}))}},computed:function(t){for(var e=1;e<arguments.length;e++){var o=null!=arguments[e]?arguments[e]:{};e%2?l(Object(o),!0).forEach((function(e){Object(r.a)(t,e,o[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(o)):l(Object(o)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(o,e))}))}return t}({},Object(n.c)({showAd:function(t){return t.show_ad}}))},d=c,f=o(42),component=Object(f.a)(d,(function(){var t=this,e=t._self._c;return t.profileImage||t.profileName?e("div",{staticClass:"ts-box is-raised has-top-spaced-large"},[e("div",{staticClass:"ts-content is-secondary"},[e("div",{staticClass:"ts-grid is-middle-aligned profile-form is-compact"},[e("div",{staticClass:"column is-2-wide"},[t.profileImage?e("img",{staticClass:"profile-image is-fluid",staticStyle:{"vertical-align":"middle"},attrs:{src:"data:image/jpeg;base64,"+t.profileImage}}):t._e()]),t._v(" "),e("div",{staticClass:"column is-9-wide"},[t._v("\n\t\t\t\t"+t._s(t.profileName)+"\n\t\t\t\t"),t.showAd?t._e():e("span",{staticClass:"ts-badge is-small is-dense"},[t._v("Pro")])]),t._v(" "),e("div",{staticClass:"column is-5-wide",staticStyle:{"text-align":"right"}},[e("button",{staticClass:"ts-button is-small is-dense is-end-icon is-circular",on:{click:function(e){return t.logout()}}},[t._v("\n\t\t\t\t\t登出\n\t\t\t\t\t"),e("span",{staticClass:"ts-icon is-arrow-right-from-bracket-icon"})])])])])]):e("div",{staticClass:"ts-box is-raised has-top-spaced-large"},[e("div",{staticClass:"ts-content is-secondary"},[e("div",{staticClass:"ts-grid is-middle-aligned profile-form"},[e("div",{staticClass:"column is-11-wide"},[t._v("\n\t\t\t\t登入後即可跨裝置同步收藏的課程與我的課表！\n\t\t\t")]),t._v(" "),e("div",{staticClass:"column is-5-wide",staticStyle:{"text-align":"right"}},[e("NuxtLink",{staticClass:"ts-button is-small is-dense is-start-icon is-circular",attrs:{to:"/login/"}},[e("span",{staticClass:"ts-icon is-arrow-right-to-bracket-icon"}),t._v("\n\t\t\t\t\t登入\n\t\t\t\t")])],1)])])])}),[],!1,null,null,null);e.default=component.exports}}]);